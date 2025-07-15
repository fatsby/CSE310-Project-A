import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import { createBrowserRouter, RouterProvider } from "react-router-dom";

// MANTINE IMPORTS
import { MantineProvider } from "@mantine/core";
import { Notifications } from "@mantine/notifications";

// PAGES IMPORT
import ItemPage from "./pages/ItemPage.jsx";
import UserLayout from "./layouts/UserLayout.jsx";
import Upload from "./pages/Upload.jsx";
import LandingLayout from "./layouts/LandingLayout.jsx";
import Landing from "./pages/Landing.jsx";
<<<<<<< Updated upstream
import HomePage from "./pages/HomePage.jsx"

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
    path: "/testupload",
    element: (
      <UserLayout>
        <Landing />
      </UserLayout>
    ),
  },
  {
    path: "/item/:id",
    element: (
      <UserLayout>
        <ItemPage/>
      </UserLayout>
    ),
  },
  {
    path: "/home",
    element: (
      <UserLayout>
        <HomePage/>
      </UserLayout>
    ),
  },
=======
import RegisterPage from "./pages/RegisterPage.jsx";

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
        path: "/register",
        element: <RegisterPage></RegisterPage>,
    },
    {
        path: "/testupload",
        element: (
            <UserLayout>
                <Landing />
            </UserLayout>
        ),
    },
    {
        path: "/item/:id",
        element: (
            <UserLayout>
                <ItemPage />
            </UserLayout>
        ),
    },
>>>>>>> Stashed changes
]);

createRoot(document.getElementById("root")).render(
    <StrictMode>
        <MantineProvider>
            <Notifications />
            <RouterProvider router={router} />
        </MantineProvider>
    </StrictMode>
);
