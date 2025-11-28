import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import "@mantine/core/styles.css";
import "@mantine/carousel/styles.css";
import "@mantine/notifications/styles.css";
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
import DataPage from "./pages/DataPage.jsx";
import ProfileController from "./pages/ProfileController.jsx";
import EditItemPage from "./pages/EditItemPage.jsx";
import AdminDashboard from "./pages/AdminDashboard.jsx";
import DepositPage from "./pages/DepositPage.jsx";
import WithdrawPage from "./pages/WithdrawPage.jsx";

import { checkAuth } from "../utils/auth.js";

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
            const isAuth = checkAuth();
            return { isAuthenticated: isAuth };
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
                path: "/data/:id",
                element: <DataPage />,
            },
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
                path: "/deposit",
                element: <DepositPage />,
            },
            {
                path: "/withdraw",
                element: <WithdrawPage />,
            },
            {
                path: "/search",
                element: <SearchResultsPage />,
            },
            {
                path: "/set-file-name",
                element: <SetFileName />,
            },
            {
                path: "/profile/:id",
                element: <ProfileController />,
            },
            {
                path: "/item/:id/edit",
                element: <EditItemPage />,
            },
            {
                path: "/admin/dashboard",
                element: <AdminDashboard />,
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
