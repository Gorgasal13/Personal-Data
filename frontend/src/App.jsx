import Header from "./components/Header";
import Persons from "./components/Persons";
import AddPerson from "./components/AddPerson";

import { createBrowserRouter, RouterProvider } from "react-router-dom";

import "./App.css";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Header />,
    children: [
      {
        path: "api",
        element: <Persons />,
      },
      {
        path: "add",
        element: <AddPerson />,
      },
      {
        path: "update/:id",
        element: <AddPerson />,
      },
    ],
  },
]);

function App() {
  return <RouterProvider router={router}></RouterProvider>;
}

export default App;
