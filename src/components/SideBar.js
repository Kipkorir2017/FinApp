import React from "react";
import { NavLink } from "react-router-dom";

function Sidebar() {
  return (
    <div className="sidebar">
      <h2 className="logo">FinLoan</h2>

      <ul className="menu">
        <li>
          <NavLink to="/">Dashboard</NavLink>
        </li>
        <li>
          <NavLink to="/">Active Loans</NavLink>
        </li>

        <li>
          <NavLink to="/borrowers">Due Loans</NavLink>
        </li>

        {/* <li>
          <NavLink to="/loan-applications">Loan Applications</NavLink>
        </li> */}

        <li>
          <NavLink to="/OverDue">Overdue Loans</NavLink>
        </li>
        <li>
          <NavLink to="/">Repayments</NavLink>
        </li>

        <li>
          <NavLink to="/AdminAnalytics">Reports</NavLink>
        </li>
      </ul>
    </div>
  );
}

export default Sidebar;
