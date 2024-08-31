import React from "react";
import { Route, BrowserRouter as Router, Routes } from "react-router-dom";
import { RecoilRoot } from "recoil";
import Home from "./pages/Home/Home";
import { Lists } from "./pages/Lists/Lists";
import Login from "./pages/Login/Login";
import SignUp from "./pages/SignUp/SignUp";

const App = () => {
    const usr = localStorage.getItem("token");

    return (
        <RecoilRoot>
            <Router>
                <Routes>
                    <Route path="*" element={<Home />} />
                    <Route path="/Home" element={<Home />} />
                    <Route path="/login" element={<Login />} />
                    <Route path="/signup" element={<SignUp />} />
                    <Route path="/lists" element={<Lists />} />
                </Routes>
            </Router>
        </RecoilRoot>
    );
};

export default App;
