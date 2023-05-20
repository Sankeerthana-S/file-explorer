
import './App.css';

import ActivityBarComponent from './components/ActivityBar/ActivityBar.component';
import MainPanelComponent from './components/MainPanel/MainPanel.component';

function App() {
  return (
    <div className='h-100'>
      <div className='row'>
        <ActivityBarComponent />
      </div>
      <div className='row h-100 my-3'>
        <MainPanelComponent />
      </div>
    </div>
  )
}

export default App
