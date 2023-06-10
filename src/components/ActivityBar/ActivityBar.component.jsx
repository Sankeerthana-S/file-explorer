import { useState, useCallback, useEffect } from "react";
import { shallowEqual, useSelector, useDispatch } from "react-redux";
import { getStorage, ref, getDownloadURL, uploadBytesResumable } from "firebase/storage";

import * as Icon from "react-bootstrap-icons";
import ProgressBar from 'react-bootstrap/ProgressBar';
import { Button, Modal, Navbar, Nav, Container, Form } from "react-bootstrap";

import firebaseApp from "../../config/firebase";
import { createFolder } from "../../redux/actionCreator/folderActionCreator";
import uploadFile from "../../redux/actionCreator/fileActionCreator";
import { csvFiles, imageFiles, textFiles } from "../../constants/fileTypes";

const ActivityBarComponent = () => {
  const dispatch = useDispatch();
  const storage = getStorage(firebaseApp);
  const acceptFiles = [ ...imageFiles, ...textFiles, ...csvFiles ];

  const [ file, setFile] = useState(null);
  const [ folderName, setFolderName] = useState("");
  const [ parentFolderName, setParentFolderName ] = useState("");
  const [ parentFolderPath, setParentFolderPath ] = useState([]);
  const [ progresspercent, setProgresspercent ] = useState(0);
  const [ showFolderModal, setShowFolderModal ] = useState(false);
  const [ showFileModal, setShowFileModal ] = useState(false);

  const {parentFolderId, folders } = useSelector((state) => ({
    parentFolderId: state.folderReducer.activeFolderId,
    folders: state.folderReducer.folders,
  }), shallowEqual);


  useEffect(() => {
    if(folders.length > 0) {
      const parentFolder = folders.find((folder) => folder.id === parentFolderId);

      if(parentFolder) {
        setParentFolderName(parentFolder.name)
        setParentFolderPath(parentFolder.path)
      }
    } 
  }, [parentFolderId, folders.length, dispatch ])

  const handleClose = useCallback((type) => {
    if(type === 'folder')setShowFolderModal(false)
    else {
      setFile(null)
      setProgresspercent(0);
      setShowFileModal(false);
    }
  })
  const handleShow = useCallback((type) => type === 'folder' ? setShowFolderModal(true): setShowFileModal(true));
  const handleInput = useCallback((event) => setFolderName(event.target.value));
  const handleFileSelect = useCallback((event) => {
    const chosenFile = event.target?.files[0]
    setFile(chosenFile || null);
  })

  const folderModalSubmit = useCallback(() => {
    const createPath = [...parentFolderPath, {id: '', name: folderName}];
    const data = {
      createdAt: new Date(),
      lastModified: null,
      lastAccessed: null,
      name: folderName,
      parent: parentFolderId,
      path: createPath,
      isDeleted: false
    };

    dispatch(createFolder(data));
    handleClose('folder');
  });
  
  const fileModalSubmit = useCallback((event)=> {
    event.preventDefault();
    if (!file) return;
    const storageRef = ref(storage, `files/${file.name}`);
    const uploadFileTask = uploadBytesResumable(storageRef, file);
    const payload = {
      url: '',
      folderId: parentFolderId,
      size: file.size,
      name: file.name,
      type: file.type,
      uploadedAt: new Date(),
      lastAccessed: null,
      lastModified: null,
      isDeleted: false
    }

    uploadFileTask.on("state_changed",
      (snapshot) => {
        const progress =
          Math.round((snapshot.bytesTransferred / snapshot.totalBytes) * 100);
        setProgresspercent(progress);
      },
      (error) => {
        alert(error);
      },
      () => {
        getDownloadURL(uploadFileTask.snapshot.ref).then((downloadURL) => {
          payload.url = downloadURL
          dispatch(uploadFile(payload))
        });
      }
    );
  })


  return (
    <>
      <Container>
        <Navbar variant="light" bg="light" className="d-flex justify-content-between">
          <Nav className="ms-1">
            <Button className="mx-2" variant="primary" onClick={() => {handleShow('folder')}}>
              <Icon.Plus size={30} />
              New Folder
            </Button>
            <Button className="mx-2" variant="primary" onClick={() => {handleShow('file')}}>
              <Icon.Upload size={20} className="me-2 mb-1"/>
              Upload File
            </Button>
          </Nav>
          <Nav>
            <div className="h4 me-4">File Explorer</div>
          </Nav>
        </Navbar>
      </Container>

      <Modal show={showFolderModal} backdrop="static" onHide={() => {handleClose('folder')}}>
        <Modal.Header closeButton>
          <Modal.Title>Create Folder in {parentFolderName}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form className="d-flex">
            <Form.Control
              type="text"
              className="me-2"
              placeholder="Folder Name"
              aria-label="Folder Name"
              onChange={handleInput}
            />
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="primary" onClick={folderModalSubmit}>
            Create
          </Button>
        </Modal.Footer>
      </Modal>

      <Modal show={showFileModal} backdrop="static" onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Upload file to {parentFolderName}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form className="d-flex">
            <Form.Control
              type="file"
              accept={acceptFiles}
              onChange={handleFileSelect}
            />
          </Form>
          <ProgressBar animated now={progresspercent} className="mt-2 progressbar" />
          {
            progresspercent === 100 &&
            <p>File Uploaded Successfully</p>
          }
        </Modal.Body>
        <Modal.Footer>
          {
            progresspercent === 100 ? 
            <Button variant="primary" onClick={handleClose}>Close</Button>
            : 
            <Button variant="primary" onClick={fileModalSubmit}>
              Upload
            </Button>
          }
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default ActivityBarComponent;
