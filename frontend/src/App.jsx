import Header from "./components/Header";
import Persons from "./components/Persons";
import AddPerson from "./components/AddPerson";
import DetailPage from "./components/DetailPage";

import { UserProgressContextProvider } from "./components/store/ModalContext";
import Cart from "./components/UI/Cart";
import Card from "./components/UI/Card";
import Layout from "./components/UI/Layout";

import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { useSelector } from "react-redux";

import "./App.css";

function App() {
  const showCart = useSelector((state) => state.ui.cardVisable);

  const router = createBrowserRouter([
    {
      path: "/",
      element: (
        <UserProgressContextProvider>
          <Header />
          <Cart />
        </UserProgressContextProvider>
      ),
      children: [
        {
          path: "api",
          element: (
            <Layout>
              <Persons />
              {showCart && <Card />}
            </Layout>
          ),
        },
        {
          path: "details/:id",
          element: <DetailPage />,
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

  return <RouterProvider router={router} />;
}

export default App;
