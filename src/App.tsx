import React, { useState } from 'react';
import logo from './logo.svg';
import Content  from './Content/Content';
import './App.css';

function App() {
  const [layer, setLayer] = useState<"chooseCompany" | "chooseMedicine" | "viewMedicine">("chooseCompany")
  const [parameters, setParameters] = useState<{company: string, medicine: string}>({company: "", medicine: ""})
  return (
    <Content layer={layer} setLayer={setLayer} parameters={parameters} setParameters={setParameters}/>
  );
}

export default App;
