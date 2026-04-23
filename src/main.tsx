import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App";
import { AuthProvider } from "./context/AuthContext";
import { LikedProvider } from "./context/LikedContext";
import "./index.css";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <LikedProvider>
          <App />
        </LikedProvider>
      </AuthProvider>
    </BrowserRouter>
  </React.StrictMode>,
);
