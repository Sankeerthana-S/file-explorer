

import PropTypes from 'prop-types';
import { useDispatch } from 'react-redux';
import { useContext, useCallback } from 'react';

import * as Icon from "react-bootstrap-icons";
import { AccordionContext} from "react-bootstrap";
import { useAccordionButton } from 'react-bootstrap/AccordionButton';

import { setActiveFolder, updateTempFolderDetails } from '../../../redux/actionCreator/folderActionCreator';
import { fetchFiles } from '../../../redux/actionCreator/fileActionCreator';

function ListViewComponent({folder, allFolders, eventKey, type, callback}) {
  const dispatch = useDispatch();
  const { activeEventKey } = useContext(AccordionContext);

  const isCurrentEventKey = activeEventKey === eventKey;
  const subFolders = allFolders.filter((listFolder) => listFolder.parent === folder.id);

  const decoratedOnClick = useAccordionButton(
    eventKey,
    () => callback && callback(eventKey),
  );

  const handleClick = useCallback((folder)=> {
    const {id, name, path} = folder;
    if(type === 'sidebar') {
      dispatch(setActiveFolder(id))
      dispatch(fetchFiles(id))
    } else {
      dispatch(updateTempFolderDetails({id, name, path}))
    }
  })

  return (
    <>
    {
      subFolders.length > 0 ?     
        <button
          type="button"
          className='btn list-btn'
          onClick={() => {decoratedOnClick(); handleClick(folder);}}>
            {
              (isCurrentEventKey) ? 
                <Icon.CaretDownFill size={20} className="pb-1 pe-2"/> : 
                <Icon.CaretRightFill size={20} className="pb-1 pe-2"/>
            }
            {
              folder.parent === '' && 
              <Icon.BoxFill size={25} className="pb-1 pe-2"/> 
            }
            {folder.name}
        </button>
        :
        <button
          type="button"
          className='btn list-btn'
          onClick={() => {decoratedOnClick(); handleClick(folder);}}>
          {folder.name}
        </button>
    }
    </>
  )
}

ListViewComponent.propTypes = {
  folder: PropTypes.any,
  allFolders: PropTypes.any,
  eventKey: PropTypes.any.isRequired,
  type: PropTypes.string,
  callback: PropTypes.func,
};

export default ListViewComponent;