import React from "react";
import logo from "../assets/logo.png";
import { NavLink } from "react-router-dom";

function Sidebar() {
  return (
    <div className="sidebar">
      <h2 className="logo">
        <a href="/" className="logo-link">
          <img src={logo} alt="FinLoan logo" className="logo-img" />
          <span>FinLoan</span>
        </a>
      </h2>

      <ul className="menu">
        <li>
          <NavLink to="/">Dashboard</NavLink>
        </li>
        <li>
          <NavLink to="/ActiveLoans">Active Loans</NavLink>
        </li>

        <li>
          <NavLink to="/due">Due Loans</NavLink>
        </li>

        {/* <li>
          <NavLink to="/loan-applications">Loan Applications</NavLink>
        </li> */}

        <li>
          <NavLink to="/OverDue">Overdue Loans</NavLink>
        </li>
        {/* <li>
          <NavLink to="/">Repayments</NavLink>
        </li> */}

        <li>
          <NavLink to="/AdminAnalytics">Reports</NavLink>
        </li>
      </ul>
    </div>
  );
}

export default Sidebar;
