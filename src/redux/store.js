import { applyMiddleware, combineReducers } from "@reduxjs/toolkit";
import { legacy_createStore as createStore } from "redux";
import { composeWithDevTools } from "redux-devtools-extension";
import thunk from "redux-thunk";

import fileFolderReducer from "./reducer/fileFolderReducer";

const store = createStore(
  combineReducers({ fileFolders: fileFolderReducer }),
  composeWithDevTools(applyMiddleware(thunk))
);

export default store;
