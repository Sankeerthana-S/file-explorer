

import PropTypes from 'prop-types';
import { useDispatch } from 'react-redux';
import { useContext, useCallback } from 'react';

import * as Icon from "react-bootstrap-icons";
import { AccordionContext} from "react-bootstrap";
import { useAccordionButton } from 'react-bootstrap/AccordionButton';

import { updateFolderDetails } from '../../../../redux/actionCreator/folderActionCreator';


function ListViewComponent({folder, allFolders, eventKey, callback}) {
  const dispatch = useDispatch();
  const { activeEventKey } = useContext(AccordionContext);

  const isCurrentEventKey = activeEventKey === eventKey;
  const subFolders = allFolders.filter((listFolder) => listFolder.parent === folder.name);

  const decoratedOnClick = useAccordionButton(
    eventKey,
    () => callback && callback(eventKey),
  );

  const handleClick = useCallback((folder)=> {
    const {id, name, path} = folder;
    dispatch(updateFolderDetails({id, name, path, subFolders}))
  })


  return (
    <>
    {
      subFolders.length > 0 ?     
        <button
          type="button"
          className='btn list-btn'
          style={{ backgroundColor: isCurrentEventKey ? '#a6ccff' : '#edf0f5' }}
          onClick={() => {decoratedOnClick(); handleClick(folder);}}>
            {
              (isCurrentEventKey) ? 
                <Icon.CaretDownFill size={20} className="pb-1 pe-2"/> : 
                <Icon.CaretRightFill size={20} className="pb-1 pe-2"/>
            }
          
          {folder.name}
        </button>
        :
        <button
          type="button"
          className='btn list-btn'
          style={{ backgroundColor: isCurrentEventKey ? '#a6ccff' : '#edf0f5' }}
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
  callback: PropTypes.func
};

export default ListViewComponent;