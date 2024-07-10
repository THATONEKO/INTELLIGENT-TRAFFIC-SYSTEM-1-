import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Welcome from "./pages/Welcome"
import React from "react";

export default function App() {
    return (
        <>
            <BrowserRouter>
                <Routes>
                    <Route path="/Main" element={<Home />} />
                    <Route path="/" element={<Welcome />} />
                </Routes>
            </BrowserRouter>
        </>
    )
}