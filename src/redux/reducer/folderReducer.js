import * as types from "../actionTypes/folderActionTypes";

const initialState = {
  isLoading: true,
  folders: [],
};

const loadState = {
  id: "",
  name: "",
  path: [],
  subFolders: [],
};

const folderReducer = (state = initialState, action) => {
  switch (action.type) {
    case types.GET_FOLDERS:
      return {
        ...state,
        folders: [...action.payload],
      };
    case types.CREATE_FOLDER:
      return {
        ...state,
        folders: [...state.folders, action.payload],
      };
    case types.SET_LOADING:
      return {
        ...state,
        isLoading: action.payload,
      };
    default:
      return state;
  }
};

const chosenFolderReducer = (state = loadState, action) => {
  if (action.payload) {
    const { id, name, path, subFolders } = action.payload;

    if (action.type === types.SET_FOLDER_DETAILS) {
      return {
        ...state,
        id,
        name,
        path,
        subFolders,
      };
    } else return state;
  } else return state;
};

export { folderReducer, chosenFolderReducer };
