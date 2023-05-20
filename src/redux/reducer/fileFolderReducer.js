import * as types from "../actionTypes/fileFolderActionTypes";

const initialState = {
  isLoading: true,
  currentFolder: "root",
  folders: [],
};

const fileFolderReducer = (state = initialState, action) => {
  switch (action.type) {
    case types.CREATE_FOLDER:
      return {
        ...state,
        folders: [...state.folders, action.payload],
      };
    case types.GET_FOLDERS:
      return {
        ...state,
        folders: [...action.payload],
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

export default fileFolderReducer;
