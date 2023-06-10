import { useEffect, useCallback } from "react";
import { useSelector, shallowEqual, useDispatch } from "react-redux";

import * as Icon from "react-bootstrap-icons";
import { Table, OverlayTrigger, Popover, ListGroup } from 'react-bootstrap';

import emptyBin from '../../../assets/bin-empty.svg'

import { imageFiles, csvFiles } from "../../../constants/fileTypes";
import { deleteFile, fetchDeletedFiles, updateFile } from "../../../redux/actionCreator/fileActionCreator";
import { deleteFolder, fetchFolders, updateFolder } from "../../../redux/actionCreator/folderActionCreator";

const ViewTrashComponent = () => {
  const dispatch = useDispatch();

  const {files, deletedFolders} = useSelector((state) => ({
    files: state.fileReducer.files,
    deletedFolders: state.folderReducer.deletedFolders
  }), shallowEqual);

  const fileImage = (fileType) => {
    if(imageFiles.includes(fileType)) {
      return <Icon.Image color="#e65c5c" />
    } else if(csvFiles.includes(fileType)) {
      return <Icon.Table color="#5ce68f" />
    } else {
      return <Icon.FileEarmarkFill size={18} color="#5c95e6"/>
    }
  }

  const deleteForever = useCallback((id, type) => {
    if(type === 'file') {
      dispatch(deleteFile(id));
      dispatch(fetchDeletedFiles());
    } else {
      dispatch(deleteFolder(id));
      dispatch(fetchFolders());
    }
  });

  const restore = useCallback((id, data, type) => {
    data.isDeleted = false;

    if(type === 'file') {
      dispatch(updateFile(id, data));
      dispatch(fetchDeletedFiles());
    } else {
      dispatch(updateFolder(id, data));
      dispatch(fetchFolders());
    }
  });

  const actionTools = (id, data, type) => {
    if (data) {
     return (
      <Popover id="popover-basic" className='shadow'>
        <Popover.Body>
          <ListGroup defaultActiveKey={data.name + 'link'}>
            <ListGroup.Item action className="popover-btn" onClick={() => {restore(id, data, type)}}>
              <span><Icon.BackspaceReverse size={18} /></span>
              <span className='ms-3'>Restore</span>
            </ListGroup.Item>
            <ListGroup.Item action className="popover-btn" onClick={() => {deleteForever(id, type)}}>
              <span><Icon.Trash size={20} /></span>
              <span className='ms-3'>Delete Forever</span>
            </ListGroup.Item>
          </ListGroup>
        </Popover.Body>
      </Popover>
     ) 
    }
  };

  useEffect(() => {
    dispatch(fetchFolders())
    dispatch(fetchDeletedFiles());
  }, [files.length, deletedFolders.length]);

  return (
    <>
      <div className="lead">
        Bin
      </div>
      {
        (files && files.length || deletedFolders && deletedFolders.length)? 
        <div className="shadow mt-3 me-3 p-3 pt-0 folder-view-scroll">  
          <Table hover variant="light" className="bg-white">
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
              deletedFolders.map((folder) => {
                return (
                  <tr key={'view-folder-'+folder.id}>
                    <td className='text-end pe-3'><Icon.FolderFill color="#f1bf33" size={20}/></td>
                    <td className="ps-0">{folder.name}</td>
                    <td>{folder.uploadedAt?.seconds ? new Date(folder.uploadedAt?.seconds * 1000).toLocaleDateString(): '-'} </td>
                    <td>{folder.lastAccessed?.seconds ? new Date(folder.lastAccessed?.seconds * 1000).toLocaleDateString(): '-'}</td>
                    <td className="text-end">
                      <OverlayTrigger trigger="click" placement="left" overlay={actionTools(folder.id, folder, 'folder')} rootClose>
                        <button className='action-tools'><Icon.ThreeDotsVertical /></button>
                      </OverlayTrigger>
                    </td>
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
                      <OverlayTrigger trigger="click" placement="left" overlay={actionTools(file.id, file, 'file')} rootClose>
                        <button className='action-tools'><Icon.ThreeDotsVertical /></button>
                      </OverlayTrigger>
                    </td>
                  </tr>
                );
              })
            }
            </tbody>
          </Table>
        </div>
        : 
        <div className="shadow mt-3 me-3 p-3 pt-0 folder-view-scroll" style={{background: '#f0f5f8'}}>  
          <div className="w-100">
            <img src={emptyBin} alt="Folder Empty" width={300} className="d-block m-auto mt-5"/>
            <div className="text-center">The bin is empty.</div>
          </div>
        </div>
      }
    </>
  )
}

export default ViewTrashComponent;