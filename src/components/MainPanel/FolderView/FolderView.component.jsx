import { Accordion } from "react-bootstrap";
import PropTypes from 'prop-types';

const FolderViewComponent = ({ items }) => {
  return (
    <>
    {
      (items && items.length > 0) &&
      <Accordion defaultActiveKey="0">
      {
        items.map((folder, index) => {
          return (
            <Accordion.Item eventKey={index} key={folder.name}>
              <Accordion.Header>{folder.name}</Accordion.Header>
              {/* {
                (folder.folders && folder.folders.length > 0) &&
                <Accordion.Body>
                  <FolderViewComponent items={folder.folders}/>
                </Accordion.Body>
              } */}
            </Accordion.Item>
          );
        })
      }
      </Accordion>
    }
    </>
  );
}

FolderViewComponent.propTypes = {
  items: PropTypes.any.isRequired,
};

export default FolderViewComponent;