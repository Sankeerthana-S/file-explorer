import { applyMiddleware, combineReducers } from "@reduxjs/toolkit";
import { legacy_createStore as createStore } from "redux";
import { composeWithDevTools } from "redux-devtools-extension";
import thunk from "redux-thunk";

import {
  folderReducer,
  chosenFolderReducer,
  tempChoosenFolderReducer,
} from "./reducer/folderReducer";
import { fileReducer, chosenFileReducer } from "./reducer/fileReducer";

const store = createStore(
  combineReducers({
    folderReducer,
    chosenFolderReducer,
    tempChoosenFolderReducer,
    fileReducer,
    chosenFileReducer,
  }),
  composeWithDevTools(applyMiddleware(thunk))
);

export default store;
