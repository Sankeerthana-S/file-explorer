import * as types from "../actionTypes/folderActionTypes";

const initialState = {
  isLoading: true,
  isPageLoading: true,
  activeFolderId: "",
  folders: [],
  deletedFolders: [],
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
        folders: [...(action.payload.folders || [])],
        deletedFolders: [...(action.payload.deletedFolders || [])],
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
    case types.SET_PAGE_LOADING:
      return {
        ...state,
        isPageLoading: action.payload,
      };
    case types.SET_ACTIVE_FOLDER_ID:
      return {
        ...state,
        activeFolderId: action.payload,
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
    } else if (action.type === types.FETCH_FOLDER_DETAILS) return state;
  }
  return state;
};

const tempChoosenFolderReducer = (state = loadState, action) => {
  if (action.payload) {
    const { id, name, path } = action.payload;

    if (action.type === types.SET_TEMP_FOLDER_DETAILS) {
      return {
        ...state,
        id,
        name,
        path,
      };
    } else if (action.type === types.FETCH_TEMP_FOLDER_DETAILS) return state;
  }
  return state;
};

export { folderReducer, chosenFolderReducer, tempChoosenFolderReducer };
