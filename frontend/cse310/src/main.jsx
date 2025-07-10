import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import ItemPage from "./pages/ItemPage.jsx";

// MANTINE IMPORTS
import { MantineProvider } from "@mantine/core";
import { Notifications } from '@mantine/notifications';

import Landing from "./pages/Landing/Landing.tsx";
import LandingLayout from "./layouts/LandingLayout/LandingLayout.tsx";
import UserLayout from "./layouts/UserLayout/UserLayout.tsx";
import Upload from "./pages/Upload/Upload.tsx";

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
      <Notifications />
      <RouterProvider router={router} />
    </MantineProvider>
  </StrictMode>
);
