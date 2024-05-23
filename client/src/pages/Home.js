import React from "react";
import HomeLayout from "../components/shared/Layout/HomeLayout";
import { Link } from "react-router-dom";

const Home = () => {
  return (
    <HomeLayout>
      <div className="container-fluid py-5">
        <div className="container">
          <div className="row">
            <div className="col-md-6 d-flex align-items-center">
              <div>
                <h1 className="display-4 mb-4">Blood Bank Management System</h1>
                <p className="lead" style={{ textAlign: "justify" }}>
                  This application helps you to manage your organisation blood
                  inventory more easily and efficiently.
                </p>
                <p className="lead" style={{ textAlign: "justify" }}>
                  With our intuitive interface and features, you can navigate
                  through the application and manage blood inventory and users .
                </p>
                <Link to="/login" className="btn btn-primary mt-3">
                  Get Started
                </Link>
              </div>
            </div>
            <div className="col-md-6">
              <img
                src="./assets/images/home-page.jpg"
                alt="Illustration"
                className="img-fluid"
              />
            </div>
          </div>
        </div>
      </div>
    </HomeLayout>
  );
};

export default Home;
