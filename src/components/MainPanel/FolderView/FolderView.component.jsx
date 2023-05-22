import PropTypes from 'prop-types';
import { useEffect, useState, useCallback } from "react";
import { useDispatch, useSelector, shallowEqual } from "react-redux";

import * as Icon from "react-bootstrap-icons";
import { Table, OverlayTrigger, Popover, ListGroup } from 'react-bootstrap';

import emptyFolder from '../../../assets/folder-empty.jpg'
import { imageFiles, csvFiles } from "../../../constants/fileTypes";
import { fetchFolderDetails, updateFolderDetails } from "../../../redux/actionCreator/folderActionCreator";
import { fetchFiles, updateFile } from '../../../redux/actionCreator/fileActionCreator';

const FolderViewComponent = ({ folders }) => {
  const dispatch = useDispatch();
  const [ currentPath, setCurrentPath ] = useState([]);

  const baseClasses = "shadow mt-3 me-3 p-3 pt-0";
  const {id, name, path, subFolders, files } = useSelector((state) => ({
    id: state.chosenFolderReducer.id,
    name: state.chosenFolderReducer.name,
    path: state.chosenFolderReducer.path,
    subFolders: state.chosenFolderReducer.subFolders,
    files: state.fileReducer.files
  }), shallowEqual);

  useEffect(() => {
    dispatch(fetchFolderDetails());
    setCurrentPath(path);
  }, [id, name ]);

  const openFolder = useCallback((folder) => {
    const subFolders = folders.filter((listFolder) => listFolder.parent === folder.name);
    folder.lastAccessed = new Date();

    dispatch(updateFolderDetails({...folder, subFolders}));
  })

  const fileImage = (fileType) => {
    if(imageFiles.includes(fileType)) {
      return <Icon.Image color="#e65c5c" />
    } else if(csvFiles.includes(fileType)) {
      return <Icon.Table color="#5ce68f" />
    } else {
      return <Icon.FileEarmarkFill size={18} color="#5c95e6"/>
    }
  }

  const removeFile = (fileId, file) => {
    if(file) {
      file.isDeleted = true;
      dispatch(updateFile(fileId, file));
      dispatch(fetchFiles(id));
    }
  }

  const fileActionTools = (fileId, file) => {
    if (file) {
     return (
      <Popover id="popover-basic" className='shadow'>
        <Popover.Body>
          <ListGroup defaultActiveKey={file.name + 'link'}>
            <ListGroup.Item action onClick={() => {alert('delete clicked')}}>
              <span><Icon.InfoCircle size={18} /></span>
              <span className='ms-3'>View Details</span>
            </ListGroup.Item>
            <ListGroup.Item action onClick={() => {alert('delete clicked')}}>
              <span><Icon.FolderSymlink size={20} /></span>
              <span className='ms-3'>Move To</span>
            </ListGroup.Item>
            <ListGroup.Item action onClick={() => {removeFile(fileId, file)}}>
              <span><Icon.Trash size={18} /></span>
              <span className='ms-3'>Remove</span>
            </ListGroup.Item>
          </ListGroup>
        </Popover.Body>
      </Popover>
     ) 
    }
  };

  return (
    <>
      {
        (currentPath && currentPath.length > 0) && 
        <>
          {
            currentPath.map((path, index) => {
              return <span className="lead" key={path.id}><a>{path.name}</a>&nbsp;&nbsp;{index === currentPath.length-1 ? '' : '/'}&nbsp;&nbsp;&nbsp;</span>;
            })
          }
        </>
      }
      <div 
        className={(subFolders.length + files.length > 9) ? 
          baseClasses + " folder-view-scroll": 
          baseClasses + " folder-view"}
      >        
      {
        ((subFolders && subFolders.length > 0) || (files && files.length)) ?
        (<Table hover variant="light" className="bg-white">
          <thead className="sticky-top py-2">
            <tr>
              <td className="folder-image pe-0">Name</td>
              <td></td>
              <td className="col-2">Created At</td>
              <td className="col-2">Last Accessed</td>
              <td className="col-1"></td>
            </tr>
          </thead>
          <tbody>
          {
            subFolders.map((folder) => {
              return (
                <tr key={'view-folder-'+folder.id}>
                  <td className='text-end pe-3'><Icon.FolderFill color="#f1bf33" size={20}/></td>
                  <td className="ps-0">
                    <button type="button" className="list-item" onClick={() => {openFolder(folder)}}>
                      {folder.name}
                    </button>
                  </td>
                  <td>{folder.createdAt?.seconds ? new Date(folder.createdAt?.seconds * 1000).toLocaleDateString(): '-'} </td>
                  <td>{folder.lastAccessed?.seconds ? new Date(folder.lastAccessed?.seconds * 1000).toLocaleDateString(): '-'}</td>
                  <td className="text-end"><Icon.ThreeDotsVertical /></td>
                </tr>
              );
            })
          }                    
          {
            files.map((file) => {
              return (
                <tr key={'view-file-'+file.id}>
                  <td className='text-end pe-3'>{fileImage(file.type)}</td>
                  <td className="ps-0">{file.name}</td>
                  <td>{file.uploadedAt?.seconds ? new Date(file.uploadedAt?.seconds * 1000).toLocaleDateString(): '-'} </td>
                  <td>{file.lastAccessed?.seconds ? new Date(file.lastAccessed?.seconds * 1000).toLocaleDateString(): '-'}</td>
                  <td className="text-end">
                    <OverlayTrigger trigger="click" placement="left" overlay={fileActionTools(file.id, file)} rootClose>
                      <button className='action-tools'><Icon.ThreeDotsVertical /></button>
                    </OverlayTrigger>
                  </td>
                </tr>
              );
            })
          }
          </tbody>
        </Table>)
        :
        (
          <div className="w-100">
            <img src={emptyFolder} alt="Folder Empty" width={300} className="d-block m-auto mt-5"/>
            <div className="text-center">No folders or files found</div>
          </div>
        )
        
      }
      </div>
    </>
  );
}

FolderViewComponent.propTypes = {
  folders: PropTypes.any.isRequired
};

export default FolderViewComponent