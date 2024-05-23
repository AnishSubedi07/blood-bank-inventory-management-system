import React from "react";
import HomeHeader from "./HomeHeader";

const HomeLayout = ({ children }) => {
  return (
    <>
      <div className="header">
        <HomeHeader />
      </div>
      <div className="row g-0">
        <div className="children">{children}</div>
      </div>
    </>
  );
};

export default HomeLayout;
