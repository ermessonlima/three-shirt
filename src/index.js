import { createRoot } from 'react-dom/client'
import './styles.css'
import { App as Canvas } from './Canvas'
import Overlay from './Overlay'
import { useEffect, useState } from 'react';


function App() {
  const [imagePath, setImagePath] = useState(null);
  const [fullimagePath, setfullImagePath] = useState(null);
 

return (
  <>
    <Canvas imagePath={imagePath} fullimagePath={fullimagePath} />
    <Overlay setImagePath={setImagePath} setfullImagePath={setfullImagePath}/>
  </>
);
}

createRoot(document.getElementById('root')).render(<App />);