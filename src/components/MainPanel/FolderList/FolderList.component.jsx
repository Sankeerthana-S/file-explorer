import PropTypes from 'prop-types';
import { Accordion, Card } from "react-bootstrap";

import ListViewComponent from "../ListView/ListView.component";

const FolderListComponent = ({ folders, parent, type, removeFolderId }) => {
  const filteredList = folders.filter((folder) => folder.parent === parent)
  const sortedItems = filteredList.sort((a, b) => a.name.toLowerCase().localeCompare(b.name.toLowerCase()));
  
  return (
    <>
    {
    (sortedItems && sortedItems.length > 0) &&
      <Accordion defaultActiveKey="0">
      {
        sortedItems.map((folder, index) => {
          if(folder.id !== removeFolderId) {
            return (
              <Card key={folder.name + index}>
                <Card.Header key={folder.id + '-header'}>
                  <ListViewComponent eventKey={index} folder={folder} allFolders={folders} type={type}></ListViewComponent>
                </Card.Header>
                <Accordion.Collapse eventKey={index} className="ps-4">
                  <FolderListComponent folders={folders} parent={folder.name} type={type} removeFolderId={removeFolderId}/>
                </Accordion.Collapse>
              </Card>
              );
          }
          })
      }
      </Accordion>
    }
    </>
  );
}

FolderListComponent.propTypes = {
  folders: PropTypes.any.isRequired,
  parent: PropTypes.string.isRequired,
  type: PropTypes.string,
  removeFolderId: PropTypes.string
};

export default FolderListComponent;

