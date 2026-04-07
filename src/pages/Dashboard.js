// Dashboard.js
import React, { useEffect, useState } from "react";
import Sidebar from "../components/SideBar";
import Header from "../components/Header";
import StatsCard from "../components/StatsCard";
import BorrowersTable from "../components/BorrowersTable";
// import AdminAnalytics from "../components/AdminAnalytics";
// import AgentLeaderboard from "../components/AgentLeaderboard";

const API_URL = process.env.REACT_APP_API_URL;

function Dashboard() {
  const [role, setRole] = useState("");
  const [stats, setStats] = useState({
    totalBorrowers: 0,
    activeLoans: 0,
    totalDisbursed: 0,
    overdueLoans: 0,
  });

  useEffect(() => {
    const r = localStorage.getItem("role");
    if (r) setRole(r.toLowerCase());
  }, []);

  useEffect(() => {
    if (role) {
      fetchStats();
    }
  }, [role]);

  const fetchStats = async () => {
    try {
      // Fetch all borrowers
      const borrowersRes = await fetch(`${API_URL}/api/borrowers`);
      const borrowersData = await borrowersRes.json();

      // Count total borrowers
      const totalBorrowers = borrowersData.length;

      // Count active loans and total disbursed
      let activeLoans = 0;
      let totalDisbursed = 0;
      let overdueLoans = 0;

      borrowersData.forEach((b) => {
        const latestLoan = b.borrowHistory?.[b.borrowHistory.length - 1];
        if (latestLoan) {
          totalDisbursed += latestLoan.amount || 0;
          if (latestLoan.status === "Active") activeLoans += 1;
          if (latestLoan.status === "Overdue") overdueLoans += 1;
        }
      });

      setStats({
        totalBorrowers,
        activeLoans,
        totalDisbursed,
        overdueLoans,
      });
    } catch (err) {
      console.error("Error fetching stats:", err);
    }
  };

  return (
    <div className="container">
      <Sidebar />

      <div className="main">
        <Header />

        {(role === "admin" || role === "teamleader") && (
          <div className="cards">
            {role === "admin" && (
              <>
                <StatsCard
                  title="Total Borrowers"
                  value={stats.totalBorrowers.toLocaleString()}
                />
                <StatsCard
                  title="Active Loans"
                  value={stats.activeLoans.toLocaleString()}
                />
                <StatsCard
                  title="Total Disbursed"
                  value={`KES ${stats.totalDisbursed.toLocaleString()}`}
                />
              </>
            )}
            <StatsCard
              title="Overdue Loans"
              value={stats.overdueLoans.toLocaleString()}
            />
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