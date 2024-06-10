import { Link, Outlet } from "react-router-dom";

function Header() {
  return (
    <div>
      <nav className="navbar navbar-expand-lg bg-body-tertiary" id="con">
        <ul>
          <Link to={"add"} className="navbar-brand">
            Add Personal Data
          </Link>
          <Link to={"api"} className="navbar-brand">
            Persons
          </Link>
        </ul>
      </nav>
      <Outlet />
    </div>
  );
}

export default Header;
