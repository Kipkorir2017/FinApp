

import React, { useEffect, useState } from "react";
import Sidebar from "../components/SideBar";
import Header from "../components/Header";
import StatsCard from "../components/StatsCard";
import BorrowersTable from "../components/BorrowersTable";
import AdminAnalytics from "../components/AdminAnalytics";
import AgentLeaderboard from "../components/AgentLeaderboard"

function Dashboard() {
  const [role, setRole] = useState("");

  useEffect(() => {
    const r = localStorage.getItem("role");
    if (r) setRole(r.toLowerCase());
  }, []);

  return (
    <div className="container">
      <Sidebar />

      <div className="main">
        <Header />

        {(role === "admin" || role === "teamleader") && (
          <div className="cards">
            {role === "admin" && (
              <>
                <StatsCard title="Total Borrowers" value="1,245" />
                <StatsCard title="Active Loans" value="534" />
                <StatsCard title="Total Disbursed" value="KES 12M" />
              </>
            )}
            <StatsCard title="Overdue Loans" value="42" />
          </div>
        )}

        {role === "admin" && (
          <div style={{ width: "100%", marginTop: "2rem" }}>
            <div style={{ marginBottom: "2rem" }}>
              {/* <AdminAnalytics /> */}
            </div>

            <div style={{ marginBottom: "2rem" }}>
              {/* <AgentLeaderboard /> */}
            </div>
          </div>
        )}

        <BorrowersTable />
      </div>
    </div>
  );
}

export default Dashboard;