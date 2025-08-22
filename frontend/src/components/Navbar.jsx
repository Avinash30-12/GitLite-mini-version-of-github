import React from "react";
import { Link ,useNavigate } from "react-router-dom";
import "./dashboard/dashboard.css"
import {useAuth} from "../authContext"

const Navbar = () => {
  const { setCurrentUser } = useAuth();
  return (
    <nav>
      <Link to="/">
        <div>
          <img
            src="https://www.github.com/images/modules/logos_page/GitHub-Mark.png"
            alt="GitHub Logo"
          />
          <h3>GitHub</h3>
        </div>
      </Link>
      <div>
        <Link to="/create">
          <p>Create a Repository</p>
        </Link>
        <Link to="/profile">
          <p>Profile</p>
        </Link>
        <div>
        <button
        onClick={() => {
          localStorage.removeItem("token");
          localStorage.removeItem("userId");
          setCurrentUser(null);

          window.location.href = "/login";
        }}
        id="logout"
      >
        Logout
      </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;