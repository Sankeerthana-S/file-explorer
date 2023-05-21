import { useEffect } from "react";
import { shallowEqual, useDispatch, useSelector } from "react-redux";

import { fetchFolders, updateFolderDetails } from "../../redux/actionCreator/folderActionCreator";

import FolderListComponent from "./FolderList/FolderList.component";
import FolderViewComponent from "./FolderView/FolderView.component";

const MainPanelComponent = () =>{

  const dispatch = useDispatch();

  const {isLoading, folders} = useSelector((state) => ({
    isLoading: state.folderReducer.isLoading,
    folders: state.folderReducer.folders
  }), shallowEqual);

  useEffect(() => {
    if(isLoading) {
      dispatch(fetchFolders());
    } 
    else {
      const root = folders.find((folder) => folder.parent === '');
      const subFolders = folders.filter((folder) => folder.parent === root.name);
      dispatch(updateFolderDetails({id: root.id, name: root.name, path: root.path, subFolders}))
    }
  }, [isLoading, folders.length, dispatch]);


  return (
    <div className="row mx-2">
      <div className="col-sm-3 col-2 ps-0">
        { isLoading ? <p>Loading</p>: (folders && folders.length > 0) && <FolderListComponent folders={folders} parent=""/> }
      </div>
      <div className="col-sm-9 col-10 pe-4"> 
        <FolderViewComponent />
      </div>
    </div>
  );
}

export default MainPanelComponent;