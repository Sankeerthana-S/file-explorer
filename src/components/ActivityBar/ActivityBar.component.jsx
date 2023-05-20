import { useState, useCallback } from "react";
import { shallowEqual, useSelector, useDispatch } from "react-redux";
import { Button, Modal, Navbar, Nav, Container, Form } from "react-bootstrap";
import * as Icon from "react-bootstrap-icons";

import createFolder from "../../redux/actionCreator/fileFolderActionCreator";

const ActivityBarComponent = () => {
  const dispatch = useDispatch();
  const [showModal, setShowModal] = useState(false);
  const [folderName, setFolderName] = useState("");

  const { currentFolder } = useSelector(
    (state) => ({
      currentFolder: state.fileFolders.currentFolder,
    }),
    shallowEqual
  );
  const handleClose = useCallback(() => setShowModal(false));
  const handleShow = useCallback(() => setShowModal(true));
  const handleInput = useCallback((event) => setFolderName(event.target.value));
  const handleSubmit = useCallback(() => {
    const data = {
      createdAt: new Date(),
      lastModified: null,
      lastAccessed: null,
      name: folderName,
      parent: currentFolder,
      path: currentFolder === "root" ? [] : ["sub parent"],
    };
    dispatch(createFolder(data));
    handleClose();
  });

  return (
    <>
      <Container>
        <Navbar collapseOnSelect expand="lg" variant="light" bg="light">
          <Navbar.Toggle aria-controls="responsive-navbar-nav" />
          <Navbar.Collapse id="responsive-navbar-nav">
            <Nav className="ms-1">
              <Button className="mx-1" variant="primary" onClick={handleShow}>
                <Icon.Plus size={30} />
                New Folder
              </Button>
              {/* <Button className="mx-1" variant="secondary">
                Upload
              </Button>{" "}
              <Button className="mx-1" variant="success">
                Success
              </Button>{" "} */}
            </Nav>
          </Navbar.Collapse>
          <Nav>
            <Form className="d-flex">
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

      <Modal show={showModal} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Create Folder</Modal.Title>
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
          <Button variant="primary" onClick={handleSubmit}>
            Create
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default ActivityBarComponent;
