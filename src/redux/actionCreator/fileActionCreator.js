import * as types from "../actionTypes/fileActionTypes";
import firebaseApp from "../../config/firebase";

const addFile = (payload) => ({
  type: types.UPLOAD_FILE,
  payload,
});

const getFiles = (payload) => ({
  type: types.GET_FILES,
  payload,
});

export const uploadFile = (data) => (dispatch) => {
  firebaseApp
    .firestore()
    .collection("files")
    .add(data)
    .then(async (file) => {
      const fileData = (await file.get()).data();
      dispatch(addFile(fileData));
    });
};

export const fetchFiles = (folderId) => (dispatch) => {
  firebaseApp
    .firestore()
    .collection("files")
    .get()
    .then((files) => {
      const filesData = files.docs.map((file) => ({
        ...file.data(),
        id: file.id,
      }));
      const filteredData = filesData.filter(
        (file) => file.folderId === folderId && !file.isDeleted
      );
      dispatch(getFiles(filteredData));
    })
    .catch((err) => console.error(err));
};

export const fetchDeletedFiles = () => (dispatch) => {
  firebaseApp
    .firestore()
    .collection("files")
    .get()
    .then((files) => {
      const filesData = files.docs.map((file) => ({
        ...file.data(),
        id: file.id,
      }));
      const filteredData = filesData.filter((file) => file.isDeleted);
      dispatch(getFiles(filteredData));
    })
    .catch((err) => console.error(err));
};

export const deleteFile = (fileId) => () => {
  firebaseApp.firestore().collection("files").doc(fileId).delete();
};

export const updateFile = (fileId, data) => () => {
  firebaseApp.firestore().collection("files").doc(fileId).update(data);
};

export default uploadFile;
