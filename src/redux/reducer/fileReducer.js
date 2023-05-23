import * as types from "../actionTypes/fileActionTypes";

const initialState = {
  files: [],
};

const loadState = {
  id: "",
  name: "",
  url: "",
  size: "",
  isDeleted: false,
  lastModified: null,
};

const fileReducer = (state = initialState, action) => {
  switch (action.type) {
    case types.GET_FILES:
      return {
        ...state,
        files: [...action.payload],
      };
    case types.UPLOAD_FILE:
      return {
        ...state,
        files: [...state.files, action.payload],
      };
    case types.DELETE_FILE:
      return {
        ...state,
        deletedAt: action.payload,
      };
    default:
      return state;
  }
};

const chosenFileReducer = (state = loadState, action) => {
  if (action.payload) {
    const { id, name, url } = action.payload;

    if (action.type === types.SET_FILE_DETAILS) {
      return {
        ...state,
        id,
        name,
        url,
      };
    } else return state;
  } else return state;
};

export { fileReducer, chosenFileReducer };
