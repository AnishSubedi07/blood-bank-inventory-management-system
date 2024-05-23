import React from "react";
// import { userMenu } from "./Menus/userMenu";
import { Link, useLocation } from "react-router-dom";
import { useSelector } from "react-redux";
import "../../../styles/Layout.css";

const Sidebar = () => {
  //get user state
  const { user } = useSelector((state) => state.auth);
  const location = useLocation();

  return (
    <div>
      <div className="sidebar">
        <div className="menu">
          {user?.role === "admin" && (
            <>
              <div
                className={`menu-item ${
                  location.pathname === "/org-list" && "active"
                }`}
              >
                <i className="fa-solid fa-warehouse"></i>
                <Link to="/org-list">Organisation List</Link>
              </div>
              <div
                className={`menu-item ${
                  location.pathname === "/donor-list" && "active"
                }`}
              >
                <i className="fa-solid fa-hand-holding-medical"></i>
                <Link to="/donor-list">Donor List</Link>
              </div>
              <div
                className={`menu-item ${
                  location.pathname === "/hospital-list" && "active"
                }`}
              >
                <i className="fa-regular fa-hospital"></i>
                <Link to="/hospital-list">Hospital List</Link>
              </div>
            </>
          )}
          {user?.role === "organisation" && (
            <>
              <div
                className={`menu-item ${location.pathname === "/" && "active"}`}
              >
                <i className="fa-solid fa-warehouse"></i>
                <Link to="/">Inventory</Link>
              </div>
              <div
                className={`menu-item ${
                  location.pathname === "/donor" && "active"
                }`}
              >
                <i className="fa-solid fa-hand-holding-medical"></i>
                <Link to="/donor">Donor</Link>
              </div>
              <div
                className={`menu-item ${
                  location.pathname === "/hospital" && "active"
                }`}
              >
                <i className="fa-regular fa-hospital"></i>
                <Link to="/hospital">Hospital/Consumer</Link>
              </div>
            </>
          )}

          {(user?.role === "donor" || user?.role === "hospital") && (
            <div
              className={`menu-item ${
                location.pathname === "/organisation" && "active"
              }`}
            >
              <i className="fa-solid fa-building-ngo"></i>
              <Link to="/organisation">Organisation</Link>
            </div>
          )}

          {user?.role === "hospital" && (
            <div
              className={`menu-item ${
                location.pathname === "/consumer" && "active"
              }`}
            >
              <i className="fa-solid fa-building-ngo"></i>
              <Link to="/consumer">Blood Consumed</Link>
            </div>
          )}

          {user?.role === "donor" && (
            <div
              className={`menu-item ${
                location.pathname === "/donation" && "active"
              }`}
            >
              <i className="fa-solid fa-hand-holding-medical"></i>
              <Link to="/donation">Donation</Link>
            </div>
          )}

          {/* <div className={`menu-item ${location.pathname === "/" && "active"}`}>
            <i className="fa-solid fa-warehouse"></i>
            <Link to="/">Inventory</Link>
          </div>
          <div
            className={`menu-item ${
              location.pathname === "/donor" && "active"
            }`}
          >
            <i className="fa-solid fa-hand-holding-medical"></i>
            <Link to="/donor">donor</Link>
          </div>
          <div
            className={`menu-item ${
              location.pathname === "/hospital" && "active"
            }`}
          >
            <i className="fa-regular fa-hospital"></i>
            <Link to="/hospital">Hospital</Link>
          </div>
          <div
            className={`menu-item ${
              location.pathname === "/organisation" && "active"
            }`}
          >
            <i className="fa-solid fa-building-ngo"></i>
            <Link to="/organisation">Organisation</Link>
          </div> */}

          {/* {userMenu.map((menu) => {
            const isActive = location.pathname === menu.path;
            return (
              <div
                className={`menu-item ${isActive && "active"}`}
                key={menu.name}
              >
                <i className={menu.icon}></i>
                <Link to={menu.path}>{menu.name}</Link>
              </div>
            );
          })} */}
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
