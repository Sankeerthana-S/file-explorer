import { useEffect } from "react";
import { useSelector, shallowEqual, useDispatch } from "react-redux";

import * as Icon from "react-bootstrap-icons";
import { Table, OverlayTrigger, Popover, ListGroup } from 'react-bootstrap';

import { imageFiles, csvFiles } from "../../../constants/fileTypes";
import { deleteFile, fetchDeletedFiles, updateFile } from "../../../redux/actionCreator/fileActionCreator";
import { useCallback } from "react";

const ViewTrashComponent = () => {
  const dispatch = useDispatch();

  const baseClasses = "shadow mt-3 me-3 p-3 pt-0";
  const {files } = useSelector((state) => ({
    files: state.fileReducer.files
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

  const deleteForever = useCallback((fileId) => {
    dispatch(deleteFile(fileId));
    dispatch(fetchDeletedFiles());
  });

  const restoreFile = useCallback((fileId, file) => {
    file.isDeleted = false;
    dispatch(updateFile(fileId, file));
    dispatch(fetchDeletedFiles());
  });

  const actionTools = (fileId, file) => {
    if (file) {
     return (
      <Popover id="popover-basic" className='shadow'>
        <Popover.Body>
          <ListGroup defaultActiveKey={file.name + 'link'}>
            <ListGroup.Item action onClick={() => {restoreFile(fileId, file)}}>
              <span><Icon.BackspaceReverse size={18} /></span>
              <span className='ms-3'>Restore</span>
            </ListGroup.Item>
            <ListGroup.Item action onClick={() => {deleteForever(fileId)}}>
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
    dispatch(fetchDeletedFiles());
  }, [files.length]);

  return (
    <>
      <div 
        className={(files.length + files.length > 9) ? 
          baseClasses + " folder-view-scroll": 
          baseClasses + " folder-view"}
      >  
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
            files.map((file) => {
              return (
                <tr key={'view-file-'+file.id}>
                  <td className='text-end pe-3'>{fileImage(file.type)}</td>
                  <td className="ps-0">{file.name}</td>
                  <td>{file.uploadedAt?.seconds ? new Date(file.uploadedAt?.seconds * 1000).toLocaleDateString(): '-'} </td>
                  <td>{file.lastAccessed?.seconds ? new Date(file.lastAccessed?.seconds * 1000).toLocaleDateString(): '-'}</td>
                  <td className="text-end">
                    <OverlayTrigger trigger="click" placement="left" overlay={actionTools(file.id, file)} rootClose>
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
    </>
  )
}

export default ViewTrashComponent;