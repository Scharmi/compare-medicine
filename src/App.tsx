import React, { useState } from 'react';
import logo from './logo.svg';
import Content  from './Content/Content';
import './App.css';

function App() {
  const [layer, setLayer] = useState<"chooseCompany" | "chooseMedicine" | "viewMedicine">("chooseCompany")
  
  return (
    <Content layer={layer} setLayer={setLayer}/>
  );
}

export default App;
