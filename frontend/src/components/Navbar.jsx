import { Link, useLocation } from "react-router-dom";
import "./css/Navbar.css";

function Navbar({ dark, toggleDark }) {
  const location = useLocation();
  const isActive = (path) => location.pathname === path;

  return (
    <nav className="navbar">
      <div className="nav-left">
        <div className="brand">
          <span className="brand-dot" />
          <span className="brand-text">Munchkin</span>
        </div>
        <ul className="nav-links">
          <li>
            <Link className={isActive("/") ? "active" : ""} to="/">Dashboard</Link>
          </li>
          <li>
            <Link className={isActive("/notes") ? "active" : ""} to="/notes">Notes</Link>
          </li>
          <li>
            <Link className={isActive("/favorites") ? "active" : ""} to="/favorites">Favorites</Link>
          </li>
          <li>
            <Link className={isActive("/trash") ? "active" : ""} to="/trash">Trash</Link>
          </li>
        </ul>
      </div>
      <div className="nav-right">
        <button className="ghost-toggle" onClick={toggleDark}>{dark ? "Light" : "Dark"}</button>
        <a className="cta" href="#" onClick={(e) => e.preventDefault()}>New</a>
      </div>
    </nav>
  );
}

export default Navbar; 