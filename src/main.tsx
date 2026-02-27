import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import AppRouter from "@/app/router/AppRouter"
import {AppProviders} from "@/app/providers/AppProvider"
import "./index.css";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <AppProviders>
    <AppRouter />
    </AppProviders>
  </StrictMode>
);
