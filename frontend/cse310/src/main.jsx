import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import {
  createBrowserRouter,
  RouterProvider,
  redirect,
  Outlet,
  useLoaderData,
} from "react-router-dom";

// MANTINE IMPORTS
import { MantineProvider } from "@mantine/core";
import { Notifications } from "@mantine/notifications";
import { ModalsProvider } from "@mantine/modals";

// PAGES & LAYOUTS IMPORT
import ItemPage from "./pages/ItemPage.jsx";
import UserLayout from "./layouts/UserLayout.jsx";
import LandingLayout from "./layouts/LandingLayout.jsx";
import Landing from "./pages/Landing.jsx";
import HomePage from "./pages/HomePage.jsx";
import SearchResultsPage from "./pages/SearchResultsPage.jsx";
import CartPage from "./pages/CartPage.jsx";
import PurchasedPage from "./pages/PurchasedPage.jsx";
import SetFileName from "./pages/SetFileName.jsx";

const checkAuth = () => {
  try {
    const userStorage = localStorage.getItem("user-storage");
    if (!userStorage) {
      return false;
    }
    const { state } = JSON.parse(userStorage);
    return !!state.userData;
  } catch (error) {
    console.error("Error validating authentication status:", error);
    return false;
  }
};

const RootElement = () => {
  const { isAuthenticated } = useLoaderData();

  return isAuthenticated ? (
    <UserLayout>
      <HomePage />
    </UserLayout>
  ) : (
    <LandingLayout>
      <Landing />
    </LandingLayout>
  );
};

const router = createBrowserRouter([
  {
    path: "/",

    loader: () => {
      return { isAuthenticated: checkAuth() };
    },
    element: <RootElement />,
  },
  {
    // layout for all protected routes
    element: (
      <UserLayout>
        <Outlet /> {/* outlet is the children */}
      </UserLayout>
    ),
    // protect all children
    loader: () => {
      // if not authenticated, go to home
      if (!checkAuth()) {
        return redirect("/");
      }
      return null;
    },
    // For Luu and Tuoi: ADD ALL PROTECTED ROUTES HERE!!!!!!!
    children: [
      {
        path: "/purchased",
        element: <PurchasedPage />,
      },
      {
        path: "/cart",
        element: <CartPage />,
      },
      {
        path: "/item/:id",
        element: <ItemPage />,
      },
      {
        path: "/search",
        element: <SearchResultsPage />,
      },
      {
        path: "/set-file-name",
        element: <SetFileName />,
      },
    ],
  },
]);

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <MantineProvider>
      <ModalsProvider>
        <Notifications />
        <RouterProvider router={router} />
      </ModalsProvider>
    </MantineProvider>
  </StrictMode>
);
