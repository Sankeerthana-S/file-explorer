import { useState, useCallback, useEffect } from "react";
import { shallowEqual, useSelector, useDispatch } from "react-redux";
import { getStorage, ref, getDownloadURL, uploadBytesResumable } from "firebase/storage";

import * as Icon from "react-bootstrap-icons";
import { Button, Modal, Navbar, Nav, Container, Form } from "react-bootstrap";

import firebaseApp from "../../config/firebase";
import { createFolder, fetchFolderDetails } from "../../redux/actionCreator/folderActionCreator";

const ActivityBarComponent = () => {
  const dispatch = useDispatch();
  const storage = getStorage(firebaseApp);

  const [file, setFile] = useState(null);
  const [imgUrl, setImgUrl] = useState(null);
  const [folderName, setFolderName] = useState("");
  const [progresspercent, setProgresspercent] = useState(0);
  const [showFolderModal, setShowFolderModal] = useState(false);
  const [showFileModal, setShowFileModal] = useState(false);

  const {id, name, path } = useSelector((state) => ({
    id: state.chosenFolderReducer.id,
    name: state.chosenFolderReducer.name,
    path: state.chosenFolderReducer.path
  }), shallowEqual);

  const handleClose = useCallback((type) => type === 'folder' ? setShowFolderModal(false): setShowFileModal(false));
  const handleShow = useCallback((type) => type === 'folder' ? setShowFolderModal(true): setShowFileModal(true));
  const handleInput = useCallback((event) => setFolderName(event.target.value));
  
  const folderModalSubmit = useCallback(() => {
    const createPath = [...path, {id: '', name: folderName}];
    const data = {
      createdAt: new Date(),
      lastModified: null,
      lastAccessed: null,
      name: folderName,
      parent: name,
      path: createPath,
    };
    dispatch(createFolder(data));
    handleClose('folder');
  });
  
  const handleFileSelect = useCallback((event) => {
    const chosenFile = event.target?.files[0]
    setFile(chosenFile || null);
  })

  const fileModalSubmit = useCallback((event)=> {
    event.preventDefault();
    if (!file) return;
    const storageRef = ref(storage, `files/${file.name}`);
    const uploadFileTask = uploadBytesResumable(storageRef, file);

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
          setImgUrl(downloadURL)
        });
      }
    );
  })

  useEffect(() => {
    dispatch(fetchFolderDetails());
  }, [id, name ])

  return (
    <>
      <Container>
        <Navbar collapseOnSelect expand="lg" variant="light" bg="light">
          <Navbar.Toggle aria-controls="responsive-navbar-nav" />
          <Navbar.Collapse id="responsive-navbar-nav">
            <Nav className="ms-1">
              <Button className="mx-2" variant="primary" onClick={() => {handleShow('folder')}}>
                <Icon.Plus size={30} />
                New Folder
              </Button>
              <Button className="mx-2" variant="primary" onClick={() => {handleShow('file')}}>
                <Icon.Upload size={20} className="me-2 mb-1"/>
                Upload File
              </Button>{" "}
              {/* <Button className="mx-1" variant="success">
                Success
              </Button>{" "} */}
            </Nav>
          </Navbar.Collapse>
          <Nav>
            <Form className="d-flex me-3">
              <Form.Control
                type="text"
                className="me-2"
                placeholder="Search"
                aria-label="Search"
              />
              <Button variant="outline-primary">Search</Button>
            </Form>
          </Nav>
        </Navbar>
      </Container>

      <Modal show={showFolderModal} backdrop="static" onHide={() => {handleClose('folder')}}>
        <Modal.Header closeButton>
          <Modal.Title>Create Folder in {name}</Modal.Title>
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
          <Modal.Title>Upload file to {name}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form className="d-flex">
            <Form.Control
              type="file"
              className="me-2"
              accept="image/png, image/gif, image/jpeg"
              onChange={handleFileSelect}
            />
          </Form>
          {
        !imgUrl &&
        <div className='outerbar'>
          <div className='innerbar' style={{ width: `${progresspercent}%` }}>{progresspercent}%</div>
        </div>
      }
      {
        imgUrl &&
        <img src={imgUrl} alt='uploaded file' height={200} />
      }
        </Modal.Body>
        <Modal.Footer>
          <Button variant="primary" onClick={fileModalSubmit}>
            Upload
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default ActivityBarComponent;
