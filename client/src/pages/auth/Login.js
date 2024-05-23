import React from "react";
import Form from "../../components/shared/Form/Form";
import { useSelector } from "react-redux";
import Spinner from "./../../components/shared/Spinner";
import { MdOutlineBloodtype } from "react-icons/md";

const Login = () => {
  const { loading, error } = useSelector((state) => state.auth);
  // document.body.style.overflow = "hidden";
  return (
    <>
      {error && <span>{alert(error)}</span>}
      {loading ? (
        <Spinner />
      ) : (
        <div className="row g-0">
          <nav className="navbar">
            <div className="container-fluid">
              <div className="navbar-brand ">
                <MdOutlineBloodtype color="red" />
                Blood Bank Management System
              </div>
            </div>
          </nav>
          <div className="col-md-8 form-banner">
            <img src="./assets/images/banner1.jpg" alt="loginImage" />
          </div>
          <div className="col-md-4 form-container">
            <Form
              formTitle={"Login Page"}
              submitBtn={"Submit"}
              formType={"login"}
            />
          </div>
        </div>
      )}
    </>
  );
};

export default Login;
