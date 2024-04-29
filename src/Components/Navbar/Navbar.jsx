import React, { useEffect } from "react";
import "./Navbar.css";
import { Link, useLocation } from "react-router-dom";
import $ from "jquery";
import { useSelector } from "react-redux";
import axios from "axios";
import { baseURL } from "../../index.js";

export default function Navbar({ profile, setProfile }) {
  async function clrUser() {
    try {
      const { data } = await axios.get(`${baseURL}/user/logout`, {
        headers: {
          authorization: `test__${localStorage.getItem("token")}`,
        },
      });
      if (data.message == "Done") {
        localStorage.removeItem("token");
        setProfile(null);
      }
    } catch (error) {
      console.log(error)
    }
  }

  const { pathname } = useLocation();

  return (
    <>
      <nav className="navbar navbar-expand-lg navbar-light bg-light">
        <div className="container">
          <div className="logo">
            <Link
              to="/home"
              className="navbar-brand fw-bold header-caption"
              href="#"
            >
              {" "}
              <i className="fa-solid fa-plug pe-2"></i>{" "}
              Tech Store
            </Link>
            <button
              className="navbar-toggler"
              type="button"
              data-bs-toggle="collapse"
              data-bs-target="#navbarSupportedContent"
              aria-controls="navbarSupportedContent"
              aria-expanded="false"
              aria-label="Toggle navigation"
            >
              <span className="navbar-toggler-icon"></span>
            </button>
          </div>
          <div className="collapse navbar-collapse" id="navbarSupportedContent">
            <ul className="navbar-nav ms-auto mb-2 mb-lg-0">
              {localStorage.getItem("token") ? (
                <>
                  <li className="nav-item">
                    <p className="nav-link mb-0 fw-bold">
                      <i className="fa-solid fa-user pe-1"></i>{" "}
                      {profile?.firstName} {profile?.lastName}
                    </p>
                  </li>
                  {profile?.admin >= 1 ? (
                    <>
                      {pathname == "/admin" ? (
                        <li className="nav-item">
                          <Link
                            to="/home"
                            className="nav-link mb-0 fw-bold page-icon"
                          >
                            <i className="fa-solid fa-arrow-right-to-bracket pe-2"></i>{" "}
                            Go to Home Page{" "}
                          </Link>
                        </li>
                      ) : (
                        <li className="nav-item">
                          <Link
                            to="/admin"
                            className="nav-link mb-0 fw-bold page-icon"
                          >
                            <i className="fa-solid fa-arrow-right-to-bracket pe-2"></i>{" "}
                            Go to Admin Page{" "}
                          </Link>
                        </li>
                      )}
                    </>
                  ) : (
                    <li
                      className="nav-item"
                      data-bs-toggle="offcanvas"
                      data-bs-target="#offcanvasRight"
                      aria-controls="offcanvasRight"
                    >
                      <a href="#" className="nav-link fw-bold page-icon">
                        <i className="fa-solid fa-bag-shopping pe-2"></i>
                        Cart: {JSON.parse(localStorage.getItem("cart")).length}
                      </a>
                    </li>
                  )}
                  
                </>
              ) : (
                ""
              )}

              <li className="nav-item">
                {localStorage.getItem("token") ? (
                  <Link
                    to="/login"
                    className="nav-link"
                    href="#"
                    onClick={clrUser}
                  >
                    Logout
                  </Link>
                ) : pathname == "/login" ? (
                  <Link to="/signup" className="nav-link" href="#">
                    Signup
                  </Link>
                ) : (
                  <Link to="/login" className="nav-link" href="#">
                    Login
                  </Link>
                )}
              </li>
            </ul>
          </div>
        </div>
      </nav>
    </>
  );
}
