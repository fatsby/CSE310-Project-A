import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import ItemPage from "./pages/ItemPage.jsx";

import { MantineProvider } from "@mantine/core";
import Landing from "./pages/Landing/Landing.js";
import LandingLayout from "./layouts/LandingLayout/LandingLayout.js";
import UserLayout from "./layouts/UserLayout/UserLayout.js";
import Upload from "./pages/Upload/Upload.js";

const router = createBrowserRouter([
  {
    path: "/",
    element: (
      <LandingLayout>
        <Landing />
      </LandingLayout>
    ),
  },
  {
    path: "/upload",
    element: (
      <UserLayout>
        <Upload />
      </UserLayout>
    ),
  },
  {
    path: "/item/:id",
    element: <ItemPage />,
  },
]);

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <MantineProvider>
      <RouterProvider router={router} />
    </MantineProvider>
  </StrictMode>
);
