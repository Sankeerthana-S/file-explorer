import { useEffect, useState } from "react";
import { BrowserRouter as Router, Route, Switch, Link } from 'react-router-dom';
import { shallowEqual, useDispatch, useSelector } from "react-redux";

import { fetchFiles } from "../../redux/actionCreator/fileActionCreator";
import { fetchFolders, updateFolderDetails } from "../../redux/actionCreator/folderActionCreator";

import  { Spinner, Card} from 'react-bootstrap';
import * as Icon from "react-bootstrap-icons";

import FolderListComponent from "./FolderList/FolderList.component";
import FolderViewComponent from "./FolderView/FolderView.component";
import ViewTrashComponent from "./Trash/ViewTrash.component";

const MainPanelComponent = () =>{
  const dispatch = useDispatch();
  const [currentFolderId, setCurrentFolderId] = useState('')

  const {id, isLoading, folders} = useSelector((state) => ({
    id: state.chosenFolderReducer.id,
    isLoading: state.folderReducer.isLoading,
    folders: state.folderReducer.folders,
  }), shallowEqual);

  useEffect(() => {
    if(isLoading) {
      dispatch(fetchFolders());
    } 
    else {
      const root = folders.find((folder) => folder.parent === '');
      const subFolders = folders.filter((folder) => folder.parent === root.name);
      setCurrentFolderId(root.id)
      dispatch(updateFolderDetails({id: root.id, name: root.name, path: root.path, subFolders}));
    }
  }, [isLoading, folders.length, dispatch]);

  useEffect(() => {
    if(id !== currentFolderId) dispatch(fetchFiles(id))
  }, [id])

  return (
    <>
    {
      isLoading ? 
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
              { (folders && folders.length > 0) && <FolderListComponent folders={folders} parent=""/> }
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

