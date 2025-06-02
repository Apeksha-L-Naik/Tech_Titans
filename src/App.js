import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from './Components/Login'
import SignUp from './Components/Signup'
import BuyerHome from "./Components/BuyerHome";

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login/>} />
        <Route path="/signup" element={<SignUp/>} />
        <Route path="/buyerhome" element={<BuyerHome/>}/>
      </Routes>
    </Router>
  );
};

export default App;

