import {createBrowserRouter} from "react-router-dom";
import {Account, Home, Login, Redirect, QrReader, NotFound} from "../../pages";
import {RouterGuard} from "../hoc/router-guard";

export const GuardedAccount = () => {
    return <RouterGuard children={<Account/>}/>;
};

const router = createBrowserRouter([
    {
        path: "*",
        Component: NotFound,
    },
    {
        path: "/account",
        Component: GuardedAccount,
    },
    {
        path: "/login",
        Component: Login,
    },
    {
        path: "/redirect",
        Component: Redirect,
    },
    {
        path: "/",
        Component: QrReader,
    },
    {
        path: "/restaurant/:restaurant/table/:table",
        Component: Home,
    },
]);

export default router;
