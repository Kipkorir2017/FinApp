import React, { useEffect, useState, useCallback, useMemo } from "react";
import axios from "axios";
import "../index.css";
import Sidebar from "../components/SideBar";
import {
  FaPhoneAlt,
  FaCheckCircle,
  FaTimesCircle,
  FaCopy,
} from "react-icons/fa";

function Borrowers() {
  const [borrowers, setBorrowers] = useState([]);
  const [expanded, setExpanded] = useState(null);
  const [borrowerStatus, setBorrowerStatus] = useState({});
  const [borrowerComments, setBorrowerComments] = useState({});

  const token = localStorage.getItem("token");

  const axiosConfig = useMemo(
    () => ({
      headers: {
        Authorization: token ? `Bearer ${token}` : "",
      },
    }),
    [token],
  );

  const API = `${process.env.REACT_APP_API_URL}/api/borrowers/loans/due`;

  const fetchBorrowers = useCallback(async () => {
    try {
      const res = await axios.get(API, axiosConfig);
      setBorrowers(res.data);

      const statusMap = {};
      const commentsMap = {};

      res.data.forEach((b) => {
        statusMap[b._id] = b.status || null;
        commentsMap[b._id] = b.notes || "";
      });

      setBorrowerStatus(statusMap);
      setBorrowerComments(commentsMap);
    } catch (err) {
      console.error(err);
      alert("Failed to fetch borrowers");
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
        `${API}/${id}`,
        { status, notes: borrowerComments[id] || "" },
        axiosConfig,
      );

      setBorrowerStatus((prev) => ({ ...prev, [id]: status }));
    } catch (err) {
      console.error(err);
      alert("Failed to update status");
    }
  };

  const handleCommentChange = (id, text) => {
    setBorrowerComments((prev) => ({ ...prev, [id]: text }));
  };

  const saveComment = async (id) => {
    try {
      await axios.put(
        `${API}/${id}`,
        {
          notes: borrowerComments[id],
          status: borrowerStatus[id] || null,
        },
        axiosConfig,
      );

      alert("Comment saved!");
    } catch (err) {
      console.error(err);
      alert("Failed to save comment");
    }
  };

  const copyPhone = (phone) => {
    navigator.clipboard.writeText(phone);
    alert(`Copied: ${phone}`);
  };

  return (
    <div className="due-page-layout">
      <Sidebar />

      <div className="due-main-content">
        <h1 className="due-title">Due Customers</h1>

        <table className="due-table">
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
                    <td
                      className="due-click-name"
                      onClick={() => toggle(b._id)}
                    >
                      {b.name}
                    </td>

                    {/* PHONE */}
                    <td className="due-phone-cell">
                      <span>{b.phone}</span>

                      <FaCopy
                        className="due-copy-icon"
                        onClick={() => copyPhone(b.phone)}
                      />

                      <a href={`tel:${b.phone}`}>
                        <FaPhoneAlt className="due-call-icon" />
                      </a>
                    </td>

                    <td>KES {latestLoan?.amount || 0}</td>

                    {/* Instead of overdue → show due date */}
                    <td>
                      {latestLoan?.dueDate
                        ? new Date(latestLoan.dueDate).toLocaleDateString()
                        : "-"}
                    </td>

                    {/* STATUS */}
                    <td>
                      {borrowerStatus[b._id] ? (
                        <span
                          className={`due-status-label ${borrowerStatus[b._id]?.toLowerCase()}`}
                        >
                          {borrowerStatus[b._id]}
                        </span>
                      ) : (
                        <div className="due-status-buttons">
                          <FaCheckCircle
                            className="due-status-icon called"
                            onClick={() => markStatus(b._id, "Called")}
                          />

                          <FaTimesCircle
                            className="due-status-icon unreachable"
                            onClick={() => markStatus(b._id, "Unreachable")}
                          />
                        </div>
                      )}
                    </td>
                  </tr>

                  {/* EXPANDED DETAILS */}
                  {expanded === b._id && (
                    <tr className="due-details-row">
                      <td colSpan="5">
                        <div className="due-details-box">
                          {/* CONTACTS */}
                          <p>
                            <strong>Customer Phone:</strong> {b.phone}
                          </p>

                          <p>
                            <strong>Email:</strong> {b.email || "-"}
                          </p>

                          <p>
                            <strong>Referee Name:</strong>{" "}
                            {b.refereeName || "-"}
                          </p>
                           <p>
                            <strong>Referee Phone:</strong>{" "}
                            {b.refereePhone || "-"}
                            <span className="Doncall">-Do not call !</span>
                          </p>

                          {/* COMMENT (NOW INSIDE DETAILS ONLY) */}
                          <div style={{ marginTop: "15px" }}>
                            <textarea
                              placeholder="Enter call comment..."
                              value={borrowerComments[b._id] || ""}
                              onChange={(e) =>
                                handleCommentChange(b._id, e.target.value)
                              }
                              style={{
                                width: "100%",
                                padding: "10px",
                                borderRadius: "6px",
                                border: "1px solid #ccc",
                              }}
                            />

                            <button
                              className="called"
                              style={{ marginTop: "10px" }}
                              onClick={() => saveComment(b._id)}
                            >
                              Save Comment
                            </button>
                          </div>
                          <div style={{ marginTop: "20px" }}>
                            <h4>Call History</h4>

                            {b.notes && b.notes.length > 0 ? (
                              b.notes
                                .slice()
                                .reverse()
                                .map((note, index) => (
                                  <div
                                    key={index}
                                    style={{
                                      background: "#f1f5f9",
                                      padding: "10px",
                                      borderRadius: "6px",
                                      marginBottom: "10px",
                                    }}
                                  >
                                    <p style={{ margin: 0 }}>{note.text}</p>
                                    <small style={{ color: "#555" }}>
                                      {new Date(note.date).toLocaleString()} -{" "}
                                      {note.agent}
                                    </small>
                                  </div>
                                ))
                            ) : (
                              <p>No previous comments</p>
                            )}
                          </div>
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
