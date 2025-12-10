import React from "react";

const Footer = () => {
  return (
    <footer
      style={{
        height: "40px",
        borderTop: "1px solid #e5e7eb",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontSize: "0.75rem",
        color: "#6b7280",
        background: "#ffffff",
      }}
    >
      © {new Date().getFullYear()} HRMS+AI Platform. All rights reserved.
    </footer>
  );
};

export default Footer;
