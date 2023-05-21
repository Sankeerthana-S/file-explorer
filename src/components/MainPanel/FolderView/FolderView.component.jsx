
import { useEffect, useState } from "react";
import { useDispatch, useSelector, shallowEqual } from "react-redux";

import Table from 'react-bootstrap/Table';
import * as Icon from "react-bootstrap-icons";
import emptyFolder from '../../../assets/folder-empty.jpg'

import { fetchFolderDetails } from "../../../redux/actionCreator/folderActionCreator";

const FolderViewComponent = () => {
  const dispatch = useDispatch();
  const [ currentPath, setCurrentPath ] = useState([]);

  const {id, name, path, subFolders } = useSelector((state) => ({
    id: state.chosenFolderReducer.id,
    name: state.chosenFolderReducer.name,
    path: state.chosenFolderReducer.path,
    subFolders: state.chosenFolderReducer.subFolders
  }), shallowEqual);

  useEffect(() => {
    dispatch(fetchFolderDetails());
    setCurrentPath(path);
  }, [id, name ])

  return (
    <>
      {
        (currentPath && currentPath.length > 0) && 
        <>
          {
            currentPath.map((path, index) => {
              return <span className="lead" key={path.id}><a>{path.name}</a>&nbsp;&nbsp;{index === currentPath.length-1 ? '' : '/'}&nbsp;&nbsp;&nbsp;</span>;
            })
          }
        </>
      }
      {
        (subFolders && subFolders.length > 0) ?
        (<Table hover variant="light" className="mt-4">
          <thead>
            <tr>
              <td></td>
              <td>Name</td>
              <td>Created At</td>
              <td>Last Modified</td>
              <td></td>
            </tr>
          </thead>
          <tbody>
          {
            subFolders.map((folder) => {
              return (
                <tr key={'view-folder-'+folder.id}>
                  <td></td>
                  <td>{folder.name}</td>
                  <td>{folder.createdAt?.seconds ? new Date(folder.createdAt?.seconds * 1000).toLocaleDateString(): '-'} </td>
                  <td>{folder.lastModified?.seconds ? new Date(folder.lastModified?.seconds * 1000).toLocaleDateString(): '-'}</td>
                  <td><Icon.ThreeDotsVertical /></td>
                </tr>
              );
            })
          }
          </tbody>
        </Table>)
        :
        (
          <div className="h-100">
            <img src={emptyFolder} alt="Folder Empty" width={300}/>
          </div>
        )

      }
    </>
  );
}

export default FolderViewComponent