import React from "react";
import Sidebar from "./SideBar";
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer,
} from "recharts";

const loanGrowthData = [
  { month: "Jan", loans: 40 },
  { month: "Feb", loans: 55 },
  { month: "Mar", loans: 70 },
  { month: "Apr", loans: 95 },
  { month: "May", loans: 120 },
];

const repaymentData = [
  { month: "Jan", repaid: 20000 },
  { month: "Feb", repaid: 35000 },
  { month: "Mar", repaid: 42000 },
  { month: "Apr", repaid: 60000 },
  { month: "May", repaid: 75000 },
];

const profitData = [
  { month: "Jan", profit: 8000 },
  { month: "Feb", profit: 12000 },
  { month: "Mar", profit: 15000 },
  { month: "Apr", profit: 21000 },
  { month: "May", profit: 28000 },
];

function AdminAnalytics() {
  return (
    <div className="admin-analytics-page">
      {/* Sidebar */}
      <Sidebar />

      {/* Main Analytics Content */}
      <div className="analytics-container">
        <h2 className="page-title">Analytics Overview</h2>

        <div className="charts-grid">
          {/* Loan Growth */}
          <div className="chart-card">
            <h3>Loan Growth</h3>
            <ResponsiveContainer width="100%" height={250}>
              <LineChart data={loanGrowthData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Line type="monotone" dataKey="loans" stroke="#2563eb" strokeWidth={3} />
              </LineChart>
            </ResponsiveContainer>
          </div>

          {/* Repayment Trends */}
          <div className="chart-card">
            <h3>Repayment Trends</h3>
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={repaymentData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="repaid" fill="#22c55e" />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Profit Graph */}
          <div className="chart-card">
            <h3>Profit Graph</h3>
            <ResponsiveContainer width="100%" height={250}>
              <LineChart data={profitData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Line type="monotone" dataKey="profit" stroke="#f59e0b" strokeWidth={3} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AdminAnalytics;