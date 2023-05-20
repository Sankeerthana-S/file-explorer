import { useEffect } from "react";
import { shallowEqual, useDispatch, useSelector } from "react-redux";
import { fetchFolders } from "../../redux/actionCreator/fileFolderActionCreator";
import FolderViewComponent from "./FolderView/FolderView.component";

const MainPanelComponent = () =>{

  const dispatch = useDispatch();

  const {isLoading, folders} = useSelector((state) => ({
    isLoading: state.fileFolders.isLoading,
    folders: state.fileFolders.folders
  }), shallowEqual);

  useEffect(() => {
    if(isLoading) {
      dispatch(fetchFolders());
    }
  }, [isLoading, folders.length, dispatch]);


  return (
    <div className="col-3">
      { isLoading ? <p>Loading</p>: (folders && folders.length) && <FolderViewComponent items={folders}/> }
    </div>
  );
}

export default MainPanelComponent;