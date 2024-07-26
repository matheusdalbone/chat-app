import React from "react";
import { createBrowserRouter } from "react-router-dom";
import Home from "../../pages/Home";
import Room from "../../pages/Room";

const Routes = createBrowserRouter([
  {
    path: "/",
    element: <Home />,
  },
  {
    path: `/room/:roomID`,
    element: <Room />,
  },
]);

export default Routes;