// REMOVED: unused OwnerDashboard import — replaced by Owner_viewpage in router
// REMOVED: unused Search import from lucide-react
import React from "react";
import ReactDOM from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { Provider } from "react-redux";
import store from "./store/store";
import "./index.css";
import App from "./App";
import RoleSelect from "./pages/RoleSelect";
import GetstartPage from "./pages/GetstartPage";
import CreatOwner from "./pages/CreateOwner";
import CreateCreator from "./pages/CreaterSection";
import CreatorDashboard from "./pages/CreaterDashboard";
import Owner_viewpage from "./owner_pages/Owner_viewpage";
import { Community, Resources, Messages, SearchTo } from "./owner_pages";
import { Fashion, Comedy, Lifestyle, Tech, Beauty, Gaming } from "./owner_pages/OwnerHeading";

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      { path: "/",               element: <RoleSelect /> },
      { path: "/getstarted",     element: <GetstartPage /> },
      { path: "/owner",          element: <CreatOwner /> },
      { path: "/creator",        element: <CreateCreator /> },
      { path: "/creator-dashboard", element: <CreatorDashboard /> },

      {
        path: "/owner-dashboard",
        element: <Owner_viewpage />,
        children: [
          { path: "search",    element: <SearchTo /> },
          { path: "massage",   element: <Messages /> },
          { path: "community", element: <Community /> },
          { path: "resources", element: <Resources /> },
          // Niche pages
          { path: "fashion",   element: <Fashion /> },
          { path: "comedy",    element: <Comedy /> },
          { path: "lifestyle", element: <Lifestyle /> },
          { path: "tech",      element: <Tech /> },
          { path: "beauty",    element: <Beauty /> },
          { path: "gaming",    element: <Gaming /> },
        ],
      },
    ],
  },
]);

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <Provider store={store}>
      <RouterProvider router={router} />
    </Provider>
  </React.StrictMode>
);