import React, { useEffect, useState } from "react";
import Sidebar from "../components/SideBar";
import "../index.css";
import { FaPhoneAlt, FaCopy } from "react-icons/fa";
import axios from "axios";

function ActiveLoansTablePage() {
  const [loans, setLoans] = useState([]);
  const [expanded, setExpanded] = useState(null);

  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchLoans = async () => {
      try {
        const res = await axios.get(
          `${process.env.REACT_APP_API_URL}/api/borrowers/loans/active`,
          {
            headers: { Authorization: token ? `Bearer ${token}` : "" },
          }
        );

        setLoans(res.data);
      } catch (err) {
        console.error("Failed to fetch active loans:", err);
        alert("Failed to fetch active loans");
      }
    };

    fetchLoans();
  }, [token]); // ✅ runs only when token changes

  const toggle = (id) => {
    setExpanded(expanded === id ? null : id);
  };

  const copyPhone = (phone) => {
    navigator.clipboard.writeText(phone);
    alert(`Copied: ${phone}`);
  };

  return (
    <div className="page-layout">
      <Sidebar />

      <div className="main-content">
        <h1 className="title">Active Loans</h1>

        <table className="borrowers-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Phone</th>
              <th>Amount</th>
              <th>Due Date</th>
            </tr>
          </thead>

          <tbody>
            {loans.length === 0 ? (
              <tr>
                <td colSpan="4" style={{ textAlign: "center" }}>
                  No active loans found
                </td>
              </tr>
            ) : (
              loans.map((loan, index) => (
                <React.Fragment
                  key={`${loan.borrowerId}-${loan.dueDate}-${index}`} // ✅ fixed key issue
                >
                  <tr>
                    {/* CLICKABLE NAME */}
                    <td
                      className="click-name"
                      onClick={() => toggle(loan.borrowerId)}
                    >
                      {loan.name}
                    </td>

                    {/* PHONE CELL */}
                    <td className="phone-cell">
                      <span>{loan.phone}</span>

                      <FaCopy
                        className="copy-icon"
                        onClick={() => copyPhone(loan.phone)}
                      />

                      <a href={`tel:${loan.phone}`}>
                        <FaPhoneAlt className="call-icon" />
                      </a>
                    </td>

                    <td>KES {loan.amount?.toLocaleString()}</td>

                    <td>
                      {loan.dueDate
                        ? new Date(loan.dueDate).toLocaleDateString()
                        : "-"}
                    </td>
                  </tr>

                  {/* EXPANDED DETAILS */}
                  {expanded === loan.borrowerId && (
                    <tr className="details">
                      <td colSpan="4">
                        <div className="details-box">
                          <p>
                            <strong>Name:</strong> {loan.name || "-"}
                          </p>
                          <p>
                            <strong>Phone Number:</strong>{" "}
                            {loan.phone || "-"}
                          </p>
                          <p>
                            <strong>Email:</strong> {loan.email || "-"}
                          </p>
                          <p>
                            <strong>Referrer Name:</strong>{" "}
                            {loan.refereeName || "-"}
                          </p>
                          <p>
                            <strong>Referrer Phone:</strong>{" "}
                            {loan.refereePhone || "-"}
                          </p>
                        </div>
                      </td>
                    </tr>
                  )}
                </React.Fragment>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default ActiveLoansTablePage;