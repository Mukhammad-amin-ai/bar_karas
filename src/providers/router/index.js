import { createBrowserRouter } from "react-router";
import { Account, Home, Login, Redirect,QrReader } from "../../pages";

// {
//   path: "/",
//   Component: Home,
//   children: [
//     {
//       path: "/:category",
//       Component: Home,
//     },
//   ],
// },
const router = createBrowserRouter([
  {
    path: "/Account",
    Component: Account,
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
