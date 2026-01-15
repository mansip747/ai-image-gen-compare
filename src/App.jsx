// src/App.jsx
import React from "react";
import { RouterProvider } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import pageRoutes from "./routes/pageRoutes";
import "./App.scss";

const App = () => {
  return (
    <>
      <RouterProvider router={pageRoutes} />
      <ToastContainer style={{ zIndex: 99999 }} />
    </>
  );
};

export default App;
