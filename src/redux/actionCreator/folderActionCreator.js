import * as types from "../actionTypes/folderActionTypes";
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

const setFolderDetails = (payload) => ({
  type: types.SET_FOLDER_DETAILS,
  payload,
});

const getFolderDetails = () => ({
  type: types.FETCH_FOLDER_DETAILS,
});

export const createFolder = (data) => (dispatch) => {
  firebaseApp
    .firestore()
    .collection("folders")
    .add(data)
    .then(async (folder) => {
      const folderData = (await folder.get()).data();
      folderData.path[folderData.path.length - 1].id = folder.id;
      dispatch(addFolder({ ...folderData, id: folder.id }));
      dispatch(updateFolderPath(folder.id, folderData));
    });
};

export const fetchFolders = () => (dispatch) => {
  dispatch(setLoading(true));
  firebaseApp
    .firestore()
    .collection("folders")
    .get()
    .then((folders) => {
      const foldersData = folders.docs.map((folder) => ({
        ...folder.data(),
        id: folder.id,
      }));
      dispatch(getFolders(foldersData));
      dispatch(setLoading(false));
    });
};

export const updateFolderPath = (folderId, data) => () => {
  firebaseApp.firestore().collection("folders").doc(folderId).update(data);
};

export const updateFolderDetails = (data) => (dispatch) => {
  dispatch(setFolderDetails(data));
};

export const fetchFolderDetails = () => (dispatch) => {
  dispatch(getFolderDetails());
};

export default createFolder;
