import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import FishermenLogin from "./components/FishermenLogin";

const App = () => {
  return (
    <Router>
      <Routes>
        {/* <Route path="/" element={<Login />} />
        <Route path="/signup" element={<Signup />} /> */}
        <Route path="/" element={<FishermenLogin/>}/>
      </Routes>
    </Router>
  );
};

export default App;

