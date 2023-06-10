import { useEffect } from "react";
import { BrowserRouter as Router, Route, Switch, Link } from 'react-router-dom';
import { shallowEqual, useDispatch, useSelector } from "react-redux";

import { fetchFiles } from "../../redux/actionCreator/fileActionCreator";
import { fetchFolders, setPageLoader } from "../../redux/actionCreator/folderActionCreator";

import  { Spinner, Card} from 'react-bootstrap';
import * as Icon from "react-bootstrap-icons";

import FolderListComponent from "./FolderList/FolderList.component";
import FolderViewComponent from "./FolderView/FolderView.component";
import ViewTrashComponent from "./Trash/ViewTrash.component";

const MainPanelComponent = () =>{
  const dispatch = useDispatch();

  const {activeFolderId, isPageLoading, folders} = useSelector((state) => ({
    activeFolderId: state.folderReducer.activeFolderId,
    isPageLoading: state.folderReducer.isPageLoading,
    folders: state.folderReducer.folders,
  }), shallowEqual);

  useEffect(() => {
    if(isPageLoading) {
      dispatch(fetchFolders());

      if(folders.length > 0) dispatch(setPageLoader(!isPageLoading))
    } 
  }, [isPageLoading, activeFolderId, folders.length, dispatch]);

  useEffect(() => {
    dispatch(fetchFiles(activeFolderId))
  }, [activeFolderId])

  return (
    <>
    {
      isPageLoading ? 
      <div className="m-auto text-center">
        <Spinner animation="grow" size={40}>
          <span className="visually-hidden">Loading...</span>
        </Spinner> 
      </div>
      :  

      <Router>
        <div className="row mx-2">
          <div className="col-2 ps-0">
            <Link to="/">
              { (folders && folders.length > 0) && <FolderListComponent folders={folders} parent="" type="sidebar"/> }
            </Link>             
            <Link to="/bin">
              <Card key='trash'>
                <Card.Header>
                <button
                  type="button"
                  className='btn list-btn'>
                  <Icon.TrashFill size={25} className="pb-1 pe-2" />Bin
                </button>
                </Card.Header>
              </Card>
            </Link>
          </div>
          <div className="col-10">
            <Switch>
              <Route exact path="/" render={()=> <FolderViewComponent folders={folders}/>}/>
              <Route exact path="/bin" component={ViewTrashComponent}/>
            </Switch>
          </div>
        </div>
      </Router>
    }
    </>
  );
}

export default MainPanelComponent;

