import React from "react";
import { BrowserRouter, Route } from "react-router-dom";
import Login from "./components/Login/Login";
import Massenger from "./components/Massenger/Massenger";
import "./App.css";

const App = () => {
  return (
    <BrowserRouter>
      <Route path="/" exact component={Login} />
      <Route path="/massenger" component={Massenger} />
    </BrowserRouter>
  );
};

export default App;
