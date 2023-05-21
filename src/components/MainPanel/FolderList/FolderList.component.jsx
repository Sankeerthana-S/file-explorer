import PropTypes from 'prop-types';
import { Accordion, Card } from "react-bootstrap";

import ListViewComponent from "./ListView/ListView.component";

const FolderListComponent = ({ folders, parent }) => {
  const filteredList = folders.filter((folder) => folder.parent === parent)
  const sortedItems = filteredList.sort((a, b) => a.name.toLowerCase().localeCompare(b.name.toLowerCase()));
  
  return (
    <>
    {
    (sortedItems && sortedItems.length > 0) &&
      <Accordion defaultActiveKey="0">
      {
        sortedItems.map((folder, index) => {
          return (
            <Card key={folder.id + index}>
              <Card.Header>
                <ListViewComponent eventKey={index} folder={folder} allFolders={folders}></ListViewComponent>
              </Card.Header>
              <Accordion.Collapse eventKey={index} className="ps-4">
                <FolderListComponent folders={folders} parent={folder.name}/>
              </Accordion.Collapse>
            </Card>
            );
            })
        }
      </Accordion>
    }
    </>
  );
}

FolderListComponent.propTypes = {
  folders: PropTypes.any.isRequired,
  parent: PropTypes.string.isRequired
};

export default FolderListComponent;

