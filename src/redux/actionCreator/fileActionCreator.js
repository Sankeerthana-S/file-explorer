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

const setLoading = (payload) => ({
  type: types.SET_LOADING,
  payload,
});

export const uploadFile = (data) => (dispatch) => {
  firebaseApp
    .firestore()
    .collection("files")
    .add(data)
    .then(async (file) => {
      const fileData = (await file.get()).data();
      dispatch(addFile({ ...fileData, id: file.id }));
    });
};

export const fetchFiles = () => (dispatch) => {
  dispatch(setLoading(true));
  firebaseApp
    .firestore()
    .collection("files")
    .get()
    .then((files) => {
      const filesData = files.docs.map((file) => ({
        ...file.data(),
        id: file.id,
      }));
      dispatch(getFiles(filesData));
      dispatch(setLoading(false));
    });
};

export default uploadFile;
