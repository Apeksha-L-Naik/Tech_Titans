import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from './Components/Login'
import SignUp from './Components/Signup'
import BuyerHome from "./Components/BuyerHome";
import FishermenLogin from "./Components/FishermenLogin";

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login/>} />
        <Route path="/signup" element={<SignUp/>} />
        <Route path="/buyerhome" element={<BuyerHome/>}/>
        <Route path="/fisherlogin" element={<FishermenLogin/>}/>
      </Routes>
    </Router>
  );
};

export default App;

