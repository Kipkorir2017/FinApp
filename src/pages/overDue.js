import React, { useEffect, useState, useCallback, useMemo } from "react";
import Sidebar from "../components/SideBar";
import "../index.css";
import { FaPhoneAlt, FaCheckCircle, FaTimesCircle, FaCopy } from "react-icons/fa";
import axios from "axios";

function Borrowers() {
  const [borrowers, setBorrowers] = useState([]);
  const [expanded, setExpanded] = useState(null);
  const [borrowerStatus, setBorrowerStatus] = useState({});

  const token = localStorage.getItem("token");

  const axiosConfig = useMemo(
    () => ({
      headers: { Authorization: token ? `Bearer ${token}` : "" },
    }),
    [token]
  );

  const API = `${process.env.REACT_APP_API_URL}/api/borrowers/loans/overdue`;

  const fetchBorrowers = useCallback(async () => {
    try {
      const res = await axios.get(API, axiosConfig);
      setBorrowers(res.data);

      // Initialize status mapping
      const statusMap = {};
      res.data.forEach((b) => {
        statusMap[b._id] = b.status || null;
      });
      setBorrowerStatus(statusMap);
    } catch (err) {
      console.error(err);
      alert("Failed to fetch overdue borrowers");
    }
  }, [API, axiosConfig]);

  useEffect(() => {
    fetchBorrowers();
  }, [fetchBorrowers]);

  const toggle = (id) => {
    setExpanded(expanded === id ? null : id);
  };

  const markStatus = async (id, status) => {
    try {
      await axios.put(
        `${process.env.REACT_APP_API_URL}/api/borrowers/${id}`,
        { status },
        axiosConfig
      );
      setBorrowerStatus((prev) => ({ ...prev, [id]: status }));
    } catch (err) {
      console.error(err);
      alert("Failed to update status");
    }
  };

  const copyPhone = (phone) => {
    navigator.clipboard.writeText(phone);
    alert(`Copied: ${phone}`);
  };

  return (
    <div className="page-layout">
      <Sidebar />

      <div className="main-content">
        <h1 className="title">Overdue Customers</h1>

        <table className="borrowers-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Phone</th>
              <th>Amount</th>
              <th>Due Date</th>
              <th>Status</th>
            </tr>
          </thead>

          <tbody>
            {borrowers.map((b) => {
              const latestLoan = b.borrowHistory?.[b.borrowHistory.length - 1];

              return (
                <React.Fragment key={b._id}>
                  <tr>
                    <td className="click-name" onClick={() => toggle(b._id)}>
                      {b.name}
                    </td>

                    <td className="phone-cell">
                      <span>{b.phone}</span>
                      <FaCopy
                        className="copy-icon"
                        onClick={() => copyPhone(b.phone)}
                      />
                      <a href={`tel:${b.phone}`}>
                        <FaPhoneAlt className="call-icon" />
                      </a>
                    </td>

                    <td>KES {latestLoan?.amount || 0}</td>

                    <td>
                      {latestLoan?.dueDate
                        ? new Date(latestLoan.dueDate).toLocaleDateString()
                        : "-"}
                    </td>

                    <td>
                      {borrowerStatus[b._id] ? (
                        <span className={`status-label ${borrowerStatus[b._id]?.toLowerCase()}`}>
                          {borrowerStatus[b._id]}
                        </span>
                      ) : (
                        <div className="status-buttons">
                          <FaCheckCircle
                            className="status-icon called-icon"
                            title="Mark as Called"
                            onClick={() => markStatus(b._id, "Called")}
                          />
                          <FaTimesCircle
                            className="status-icon unreachable-icon"
                            title="Mark as Unreachable"
                            onClick={() => markStatus(b._id, "Unreachable")}
                          />
                        </div>
                      )}
                    </td>
                  </tr>

                  {expanded === b._id && (
                    <tr className="details">
                      <td colSpan="5">
                        <div className="details-box">
                          <p>
                            <strong>Referee Phone:</strong> {b.refereePhone || "-"}
                          </p>
                        </div>
                      </td>
                    </tr>
                  )}
                </React.Fragment>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default Borrowers;