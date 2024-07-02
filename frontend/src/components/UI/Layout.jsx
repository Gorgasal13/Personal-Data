import { Fragment } from "react";

function Layout({ children }) {
  return (
    <Fragment>
      <main>{children}</main>
    </Fragment>
  );
}

export default Layout;
