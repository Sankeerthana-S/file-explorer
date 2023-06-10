import PropTypes from 'prop-types';
import { useEffect, useState, useCallback } from "react";
import { useDispatch, useSelector, shallowEqual } from "react-redux";

import * as Icon from "react-bootstrap-icons";
import { Table, OverlayTrigger, Popover, ListGroup, Modal, Button, Spinner } from 'react-bootstrap';

import emptyFolder from '../../../assets/folder-empty.jpg'
import FolderListComponent from '../FolderList/FolderList.component';
import { imageFiles, csvFiles } from "../../../constants/fileTypes";

import { fetchFiles, updateFile } from '../../../redux/actionCreator/fileActionCreator';
import { fetchFolders, setActiveFolder, updateFolder } from "../../../redux/actionCreator/folderActionCreator";

const FolderViewComponent = ({ folders }) => {
  const dispatch = useDispatch();

  const {id, isFoldersLoading, isFilesLoading, filesList, tempFolderId, tempFolderName, tempFolderPath } = useSelector((state) => ({
    id: state.folderReducer.activeFolderId,
    isFoldersLoading: state.folderReducer.isLoading,
    isFilesLoading: state.fileReducer.isLoading,
    filesList: state.fileReducer.files,
    tempFolderId: state.tempChoosenFolderReducer.id,
    tempFolderName: state.tempChoosenFolderReducer.name,
    tempFolderPath: state.tempChoosenFolderReducer.path
  }), shallowEqual);

  const [ files, setFiles ] = useState([...filesList]);
  const [ currentPath, setCurrentPath ] = useState([]);
  const [ subFolders, setSubFolders ] = useState([]);
  const [ chosenFile, setChosenFile ] = useState(null);
  const [ chosenFolder, setChosenFolder ] = useState(null);
  const [ showFileDetails, setShowFileDetails ] = useState(false);
  const [ showMoveToModal, setshowMoveToModal ] = useState(false);

  useEffect(() => {
    if (id) {
      const activeFolder = folders.find((folder) => folder.id === id);
      const viewFolders = folders.filter((folder) => folder.parent === id);
      setCurrentPath(activeFolder.path);
      setSubFolders(viewFolders ?? [])
    }
  }, [ id, isFoldersLoading, folders.length ]);

  useEffect(() => {
    setFiles(filesList ? [...filesList]: []);
  }, [id, isFilesLoading, filesList.length])

  const openFolder = useCallback((folderId) => {
    const foundFolder = folders.find((folder) => folder.id === folderId)
    const subFolders = folders.filter((listFolder) => listFolder.parent === folderId);
    foundFolder.lastAccessed = new Date();
    setSubFolders(subFolders)

    dispatch(updateFolder(foundFolder.id, foundFolder));
    dispatch(setActiveFolder(folderId));
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

  const removeFile = useCallback((fileId, file) => {
    if(file) {
      file.isDeleted = true;
      dispatch(updateFile(fileId, file));
      dispatch(fetchFiles(id));
    }
  });

  const removeFolder = useCallback((folderId, folder) => {
    if(folder) {
      folder.isDeleted = true;
      dispatch(updateFolder(folderId, folder));
      dispatch(fetchFolders());
    }
  });

  const viewDetails = useCallback((file) => {
    file.lastAccessed = new Date();

    dispatch(updateFile(file.id, file));
    dispatch(fetchFiles(id));
    setChosenFile(file);
    setShowFileDetails(true);
  });

  const moveTo = useCallback((data, type) => {
    if(type === 'file') setChosenFile(data);
    else setChosenFolder(data)
    
    setshowMoveToModal(true);
  });

  const handleMoveFile = useCallback((moveFile) => {
    moveFile.folderId = tempFolderId;

    dispatch(updateFile(moveFile.id, moveFile));
    dispatch(fetchFiles(id));
    setshowMoveToModal(false);
    setChosenFile(null);
  })

  const handleMoveFolder = useCallback((moveFolder) => {
    moveFolder.parent = tempFolderId
    moveFolder.path = [...tempFolderPath, { id: moveFolder.id, name: moveFolder.name}];

    dispatch(updateFolder(moveFolder.id, moveFolder));
    setshowMoveToModal(false);
    setChosenFolder(null);
    dispatch(fetchFolders());
  })

  const fileActionTools = (fileId, file) => {
    if (file) {
     return (
      <Popover id="popover-basic" className='shadow'>
        <Popover.Body>
          <ListGroup defaultActiveKey="0">
            <ListGroup.Item action className="popover-btn" onClick={() => {document.body.click(); viewDetails(file)}}>
              <span><Icon.InfoCircle size={18} /></span>
              <span className='ms-3'>View Details</span>
            </ListGroup.Item>
            <ListGroup.Item action className="popover-btn" onClick={() => {document.body.click(); moveTo(file, 'file')}}>
              <span><Icon.FolderSymlink size={20} /></span>
              <span className='ms-3'>Move To</span>
            </ListGroup.Item>
            <ListGroup.Item action className="popover-btn" onClick={() => {document.body.click(); removeFile(fileId, file)}}>
              <span><Icon.Trash size={18} /></span>
              <span className='ms-3'>Remove</span>
            </ListGroup.Item>
          </ListGroup>
        </Popover.Body>
      </Popover>
     ) 
    }
  };

  const folderActionTools = (folderId, folder) => {
    if (folder) {
      return (
       <Popover id="popover-basic" className='shadow'>
         <Popover.Body>
           <ListGroup defaultActiveKey="0">
             <ListGroup.Item action className="popover-btn" onClick={() => {document.body.click(); moveTo(folder, 'folder')}}>
               <span><Icon.FolderSymlink size={20} /></span>
               <span className='ms-3'>Move To</span>
             </ListGroup.Item>
             <ListGroup.Item action className="popover-btn" onClick={() => {document.body.click(); removeFolder(folderId, folder)}}>
               <span><Icon.Trash size={18} /></span>
               <span className='ms-3'>Remove</span>
             </ListGroup.Item>
           </ListGroup>
         </Popover.Body>
       </Popover>
      ) 
     }
  }

  return (
    <>
      {
        (currentPath && currentPath.length > 0) && 
        <>
          {
            currentPath.map((path, index) => {
              return <span className="lead" key={path.id}><a className="pe-stroke" onClick={() => {openFolder(path.id)}}>{path.name}</a>&nbsp;&nbsp;{index === currentPath.length-1 ? '' : '/'}&nbsp;&nbsp;&nbsp;</span>;
            })
          }
        </>
      }
      {
      (isFoldersLoading || isFilesLoading) ?
        <div className="m-auto text-center">
          <Spinner animation="grow" size={40}>
            <span className="visually-hidden">Loading...</span>
          </Spinner> 
        </div>
      :
        <div className="shadow mt-3 me-3 p-3 pt-0 folder-view-scroll">        
        {
          ((subFolders && subFolders.length > 0) || (files && files.length)) ?
          (
          <>
            <Table hover variant="light" className="bg-white">
              <thead className="sticky-top py-2">
                <tr>
                  <td className="folder-image pe-0">Name</td>
                  <td></td>
                  <td className="col-3 text-center">Created At</td>
                  <td className="col-3 text-center">Last Accessed</td>
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
                        <button type="button" className="list-item" onClick={() => {openFolder(folder.id)}}>
                          {folder.name}
                        </button>
                      </td>
                      <td className="col-3 text-center">{folder.createdAt?.seconds ? new Date(folder.createdAt?.seconds * 1000).toLocaleString(): '-'} </td>
                      <td className="col-3 text-center">{folder.lastAccessed?.seconds ? new Date(folder.lastAccessed?.seconds * 1000).toLocaleString(): '-'}</td>
                      <td className="text-end">
                        <OverlayTrigger trigger="click" placement="left" overlay={folderActionTools(folder.id, folder)} rootClose>
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
                      <td className="ps-0">
                      <button type="button" className="list-item" onClick={() => {viewDetails(file)}}>
                          {file.name}
                        </button></td>
                      <td className="col-3 text-center">{file.uploadedAt?.seconds ? new Date(file.uploadedAt?.seconds * 1000).toLocaleString(): '-'} </td>
                      <td className="col-3 text-center">{file.lastAccessed?.seconds ? new Date(file.lastAccessed?.seconds * 1000).toLocaleString(): '-'}</td>
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
            </Table>
            {
              chosenFile &&
              <Modal centered show={showFileDetails} backdrop="static" onHide={() => {setShowFileDetails(false)}}>
                <Modal.Header closeButton>
                  <Modal.Title>
                    <span>{fileImage(chosenFile.type)}</span>
                    <span className='ms-3'>{chosenFile.name}</span>
                  </Modal.Title>
                </Modal.Header>
                <Modal.Body>
                <ListGroup>
                  {  imageFiles.includes(chosenFile.type) &&
                  <ListGroup.Item className='text-center'>
                    <img src={chosenFile.url} width={430}/>
                  </ListGroup.Item>
                  }
                  <ListGroup.Item>
                    <span>Size: </span>
                    <span className='ms-2'>
                      {chosenFile.size ? chosenFile.size/1000 + ' kB' : '-'}
                    </span>
                  </ListGroup.Item>
                  <ListGroup.Item>
                    <span>Location: </span>
                    <span className='ms-2'>
                    {
                      currentPath.map((path, index) => {
                        return <span key={path.id}>&nbsp;{path.name}&nbsp;{index === currentPath.length-1 ? '' : '>'}&nbsp;</span>;
                      })
                    }
                    </span>
                  </ListGroup.Item>
                  <ListGroup.Item>
                    <span>Uploaded On: </span>
                    <span className='ms-2'>
                      {chosenFile.uploadedAt?.seconds ? new Date(chosenFile.uploadedAt?.seconds * 1000).toLocaleString(): '-'}
                    </span>
                  </ListGroup.Item>
                  <ListGroup.Item>
                    <div>
                      <a href={chosenFile.url} target="_blank" rel="noopener noreferrer"><Icon.BoxArrowUpRight className='pb-1 me-2' size={17}/>View file new tab</a>
                    </div>
                  </ListGroup.Item>
                </ListGroup>
                </Modal.Body>
              </Modal>
            }
            {
              chosenFile &&
              <Modal centered show={showMoveToModal} backdrop="static" onHide={() => {setshowMoveToModal(false);}}>
                <Modal.Header closeButton>
                  <Modal.Title>
                    <div className='ms-3'>Move {chosenFile.name}</div>                  
                  </Modal.Title>
                </Modal.Header>
                <Modal.Body>
                  <div className='ms-3 mb-3 fs-14'>
                    <span>Current location: </span>
                    <span className='ms-2'>
                    {
                      currentPath.map((path, index) => {
                        return <span key={path.id}>{path.name}&nbsp;{index === currentPath.length-1 ? '' : '>'}&nbsp;</span>;
                      })
                    }
                    </span>
                  </div>
                  <div className='ms-3 mb-3 fs-14'>
                    <span>Chosen location: </span>
                    <span className='ms-2'>
                    { 
                      tempFolderPath && 
                      tempFolderPath.map((path, index) => {
                        return <span className="fs-14 mt-5" key={path.id}><a>{path.name}</a>&nbsp;&nbsp;{index === tempFolderPath.length-1 ? '' : '>'}&nbsp;&nbsp;&nbsp;</span>;
                      })
                    }
                    </span>
                  </div>
                  <FolderListComponent folders={folders} parent="" type="moveTo"/>
                </Modal.Body>
                <Modal.Footer>
                  <Button variant="primary" onClick={() => {handleMoveFile(chosenFile)}}>
                    Move file to {tempFolderName}
                  </Button>
                </Modal.Footer>
              </Modal>
            }
            {
              chosenFolder &&
              <Modal centered show={showMoveToModal} backdrop="static" onHide={() => {setshowMoveToModal(false)}}>
                <Modal.Header closeButton>
                  <Modal.Title>
                    <div className='ms-3'>Move {chosenFolder.name}</div>                  
                  </Modal.Title>
                </Modal.Header>
                <Modal.Body>
                  <div className='ms-3 mb-3 fs-14'>
                    <span>Current location: </span>
                    <span className='ms-2'>
                    {
                      currentPath.map((path, index) => {
                        return <span key={path.id}>{path.name}&nbsp;{index === currentPath.length-1 ? '' : '>'}&nbsp;</span>;
                      })
                    }
                    </span>
                  </div>
                  <div className='ms-3 mb-3 fs-14'>
                    <span>Chosen location: </span>
                    <span className='ms-2'>
                    { 
                      tempFolderPath && 
                      tempFolderPath.map((path, index) => {
                        return <span className="fs-14 mt-5" key={path.id}><a>{path.name}</a>&nbsp;&nbsp;{index === tempFolderPath.length-1 ? '' : '>'}&nbsp;&nbsp;&nbsp;</span>;
                      })
                    }
                    </span>
                  </div>
                  <FolderListComponent folders={folders} parent="" type="delete" removeFolderId={chosenFolder.id}/>
                </Modal.Body>
                <Modal.Footer>
                  <Button variant="primary" onClick={() => {handleMoveFolder(chosenFolder)}}>
                    Move file to {tempFolderName}
                  </Button>
                </Modal.Footer>
              </Modal>
            }
          </>
          )
          :
          (
            <div className="w-100">
              <img src={emptyFolder} alt="Folder Empty" width={300} className="d-block m-auto mt-5 pt-5"/>
              <div className="text-center">No folders or files found</div>
            </div>
          )
          
        }
        </div>
      }
    </>
  );
}

FolderViewComponent.propTypes = {
  folders: PropTypes.any.isRequired
};

export default FolderViewComponent