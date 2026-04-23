import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App";
import { HelmetProvider } from "react-helmet-async";
import { LikedProvider } from "./context/LikedContext";
import "./index.css";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <HelmetProvider>
      <BrowserRouter>
        <LikedProvider>
          <App />
        </LikedProvider>
      </BrowserRouter>
    </HelmetProvider>
  </React.StrictMode>,
);
