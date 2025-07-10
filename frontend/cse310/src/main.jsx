import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import ItemPage from "./pages/ItemPage.jsx";

// MANTINE IMPORTS
import { MantineProvider } from "@mantine/core";
import { Notifications } from "@mantine/notifications";
import UserLayout from "./layouts/UserLayout.jsx";
import Upload from "./pages/Upload.jsx";
import LandingLayout from "./layouts/LandingLayout.jsx";
import Landing from "./pages/Landing.jsx";

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
