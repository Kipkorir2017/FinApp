import React, { useEffect, useState } from "react";
import Sidebar from "../components/SideBar";

const isValidActiveLoan = (loan) => {
  const today = new Date();
  const dueDate = new Date(loan.dueDate);

  today.setHours(0, 0, 0, 0);
  dueDate.setHours(0, 0, 0, 0);

  return loan.status === "active" && dueDate > today;
};

const ActiveLoansTablePage = () => {
  const [filteredLoans, setFilteredLoans] = useState([]);

  useEffect(() => {
    
    const dummyLoans = [
      {
        id: 1,
        customerName: "John Mwangi",
        contact: "+254712345678",
        amount: 15000,
        dueDate: "2026-04-10",
        status: "active",
      },
      {
        id: 2,
        customerName: "Amina Hassan",
        contact: "+254798765432",
        amount: 8000,
        dueDate: "2026-03-24", // today (excluded)
        status: "active",
      },
      {
        id: 3,
        customerName: "Peter Otieno",
        contact: "+254701112233",
        amount: 20000,
        dueDate: "2026-03-20", // overdue (excluded)
        status: "active",
      },
      {
        id: 4,
        customerName: "Grace Wanjiku",
        contact: "+254722334455",
        amount: 12000,
        dueDate: "2026-05-01",
        status: "active",
      },
      {
        id: 5,
        customerName: "Ali Said",
        contact: "+254733556677",
        amount: 5000,
        dueDate: "2026-04-05",
        status: "closed", // not active (excluded)
      },
    ];

    const validLoans = dummyLoans.filter(isValidActiveLoan);
    setFilteredLoans(validLoans);
  }, []);

  return (
    // <div className="container">
        
    <div style={{ padding: "20px" }}>
        
      <h2>Active Loans (Not Due & Not Overdue)</h2>

      {filteredLoans.length === 0 ? (
        <p>No customers found.</p>
      ) : (
        <table
          style={{
            width: "100%",
            borderCollapse: "collapse",
            marginTop: "20px",
          }}
        >
          <thead>
            <tr style={{ backgroundColor: "#007BFF", color: "#fff" }}>
              <th style={thStyle}>Customer Name</th>
              <th style={thStyle}>Contact</th>
              <th style={thStyle}>Amount (KES)</th>
              <th style={thStyle}>Due Date</th>
            </tr>
          </thead>
          <tbody>
            {filteredLoans.map((loan) => (
              <tr key={loan.id} style={{ borderBottom: "1px solid #ddd" }}>
                <td style={tdStyle}>{loan.customerName}</td>
                <td style={tdStyle}>{loan.contact}</td>
                <td style={tdStyle}>
                  {loan.amount.toLocaleString()}
                </td>
                <td style={tdStyle}>
                  {new Date(loan.dueDate).toLocaleDateString()}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
    // </div>
  );
};

// Styling
const thStyle = {
  padding: "12px",
  textAlign: "left",
};

const tdStyle = {
  padding: "10px",
};

export default ActiveLoansTablePage;