import * as types from "../actionTypes/fileFolderActionTypes";
import firebaseApp from "../../config/firebase";

const addFolder = (payload) => ({
  type: types.CREATE_FOLDER,
  payload,
});

const getFolders = (payload) => ({
  type: types.GET_FOLDERS,
  payload,
});

const setLoading = (payload) => ({
  type: types.SET_LOADING,
  payload,
});

export const createFolder = (data) => (dispatch) => {
  firebaseApp
    .firestore()
    .collection("folders")
    .add(data)
    .then(async (folder) => {
      const folderData = (await folder.get()).data;
      dispatch(addFolder(folderData));
      dispatch(getFolders([folderData]));
      dispatch(setLoading(false));
    });
};

export const fetchFolders = () => (dispatch) => {
  dispatch(setLoading(true));
  firebaseApp
    .firestore()
    .collection("folders")
    .get()
    .then((folders) => {
      const foldersData = folders.docs.map((folder) => folder.data());
      dispatch(getFolders(foldersData));
      dispatch(setLoading(false));
    });
};

export default createFolder;
