import React from "react";
import { MdOutlineBloodtype } from "react-icons/md";
import { useNavigate } from "react-router-dom";

const HomeHeader = () => {
  const navigate = useNavigate();

  // logout handler
  const handleLogin = () => {
    localStorage.clear();
    navigate("/login");
  };
  return (
    <>
      <nav className="navbar">
        <div className="container-fluid">
          <div className="navbar-brand ">
            <MdOutlineBloodtype color="red" />
            Blood Bank Management System
          </div>
          <ul className="navbar-nav flex-row">
            <li className="nav-item mx-3">
              <button className="btn btn-danger" onClick={handleLogin}>
                Login
              </button>
            </li>
          </ul>
        </div>
      </nav>
    </>
  );
};

export default HomeHeader;
