import { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';

import './App.css';

import ActivityBarComponent from './components/ActivityBar/ActivityBar.component';
import MainPanelComponent from './components/MainPanel/MainPanel.component';

import { setActiveFolder } from './redux/actionCreator/folderActionCreator';

function App() {
  const dispatch = useDispatch();
  const [windowSize, setWindowSize] = useState([
    window.innerWidth,
    window.innerHeight,
  ]);

  const mainCollectionId = import.meta.env.DEV ? import.meta.env.VITE_MAIN_COLLECTION_ID : "";

  useEffect(() => {
    const handleWindowResize = () => {
      setWindowSize([window.innerWidth, window.innerHeight]);
    };

    window.addEventListener('resize', handleWindowResize);

    return () => {
      window.removeEventListener('resize', handleWindowResize);
    };
  }, []);

  useEffect(() => {
    dispatch(setActiveFolder(mainCollectionId));
  }, []);

  return (
    <>
    {
      windowSize[0] > 960 ?

        <div className='h-75'>
        <div className='row'>
          <ActivityBarComponent />
        </div>
        <div className='row h-100 my-3'>
          <MainPanelComponent />
        </div>
      </div>
      :
      <div className='h-100 w-100 text-center d-flex align-items-center bg-load'>
        <div className='w-100 lead mx-4'>
          <div className='mb-3'>The Application is not yet mobile or tablet friendly.</div>
          <div className='mb-1'>Please use wider screen</div>
          <div>Sorry for inconvenience!</div>          
        </div>
      </div>
    }
    </>
  )
}

export default App
