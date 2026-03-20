import React, { useState } from "react";
import "../index.css";

function Header() {

  const [open,setOpen] = useState(false);

  const name = localStorage.getItem("name");
  const role = localStorage.getItem("role");

  const logout = () => {

    localStorage.removeItem("token");
    localStorage.removeItem("role");
    localStorage.removeItem("name");

    window.location.href="/login";

  };

  return (

    <header className="header">

      <div className="logo">
        {/* FinLoan */}
      </div>

      <div className="profile">

        <div
          className="profile-info"
          onClick={()=>setOpen(!open)}
        >

          <div className="avatar">
            {name ? name.charAt(0).toUpperCase() : "U"}
          </div>

          <div className="user-text">

            <span className="username">{name}</span>
            <span className="userrole">{role}</span>

          </div>

        </div>

        {open && (

          <div className="dropdown">

            <button className="logout-btn" onClick={logout}>
              Logout
            </button>

          </div>

        )}

      </div>

    </header>

  );

}

export default Header;