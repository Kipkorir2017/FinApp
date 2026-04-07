import React, { useEffect, useState, useCallback, useMemo } from "react";
import Sidebar from "../components/SideBar";
import "../index.css";
import { FaPhoneAlt, FaCheckCircle, FaTimesCircle, FaCopy } from "react-icons/fa";
import axios from "axios";

function Borrowers() {
  const [borrowers, setBorrowers] = useState([]);
  const [expanded, setExpanded] = useState(null);
  const [contactStatusMap, setContactStatusMap] = useState({});
  const [commentsMap, setCommentsMap] = useState({});

  const token = localStorage.getItem("token");

  const axiosConfig = useMemo(
    () => ({
      headers: { Authorization: token ? `Bearer ${token}` : "" },
    }),
    [token]
  );

  // ✅ DUE API
  const API = `${process.env.REACT_APP_API_URL}/api/borrowers/loans/due`;

  const fetchBorrowers = useCallback(async () => {
    try {
      const res = await axios.get(API, axiosConfig);
      setBorrowers(res.data);

      const statusMap = {};
      const commentInit = {};

      res.data.forEach((b) => {
        statusMap[b.borrowerId] = b.contactStatus || null;
        commentInit[b.borrowerId] = "";
      });

      setContactStatusMap(statusMap);
      setCommentsMap(commentInit);
    } catch (err) {
      console.error(err);
      alert("Failed to fetch due borrowers");
    }
  }, [API, axiosConfig]);

  useEffect(() => {
    fetchBorrowers();
  }, [fetchBorrowers]);

  const toggle = (id) => setExpanded(expanded === id ? null : id);

  const markStatus = async (borrowerId, status) => {
    try {
      await axios.put(
        `${process.env.REACT_APP_API_URL}/api/borrowers/${borrowerId}/contact-status`,
        { status },
        axiosConfig
      );

      setContactStatusMap((prev) => ({
        ...prev,
        [borrowerId]: status,
      }));
    } catch (err) {
      console.error(err);
      alert("Failed to update status");
    }
  };

  const handleCommentChange = (id, text) => {
    setCommentsMap((prev) => ({
      ...prev,
      [id]: text,
    }));
  };

  const saveComment = async (id) => {
    const commentText = commentsMap[id]?.trim();
    if (!commentText) {
      alert("Cannot save empty comment");
      return;
    }

    try {
      await axios.put(
        `${process.env.REACT_APP_API_URL}/api/borrowers/${id}/contact-status`,
        {
          notes: commentText,
          status: contactStatusMap[id] || null,
        },
        axiosConfig
      );

      const updatedBorrowers = borrowers.map((b) =>
        b.borrowerId === id
          ? {
              ...b,
              notes: [
                ...(b.notes || []),
                { text: commentText, date: new Date(), agent: "You" },
              ],
            }
          : b
      );

      setBorrowers(updatedBorrowers);
      setCommentsMap((prev) => ({ ...prev, [id]: "" }));

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
    <div className="page-layout">
      <Sidebar />
      <div className="main-content">
        <h1 className="title">Due Customers</h1>

        <table className="borrowers-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Phone</th>
              <th>Amount</th>
              <th>Due Date</th>
              <th>Contact Status</th>
            </tr>
          </thead>

          <tbody>
            {borrowers.map((b) => {
              const status = contactStatusMap[b.borrowerId];

              return (
                <React.Fragment key={`${b.borrowerId}-${b.dueDate}`}>
                  <tr>
                    <td
                      className="click-name"
                      onClick={() => toggle(b.borrowerId)}
                    >
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

                    {/* ✅ DIRECT FROM API */}
                    <td>KES {b.amount || 0}</td>

                    <td>
                      {b.dueDate
                        ? new Date(b.dueDate).toLocaleDateString()
                        : "-"}
                    </td>

                    <td>
                      {status ? (
                        <span className={`status-label ${status.toLowerCase()}`}>
                          {status}
                        </span>
                      ) : (
                        <div className="status-buttons">
                          <FaCheckCircle
                            className="status-icon called-icon"
                            onClick={() =>
                              markStatus(b.borrowerId, "Called")
                            }
                          />
                          <FaTimesCircle
                            className="status-icon unreachable-icon"
                            onClick={() =>
                              markStatus(b.borrowerId, "Unreachable")
                            }
                          />
                        </div>
                      )}
                    </td>
                  </tr>

                  {expanded === b.borrowerId && (
                    <tr className="details">
                      <td colSpan="5">
                        <div className="details-box">
                          <p><strong>Name:</strong> {b.name}</p>
                          <p><strong>Phone:</strong> {b.phone}</p>
                          <p><strong>Referee Name:</strong> {b.refereeName || "-"}</p>
                          <p><strong>Referee Phone:</strong> {b.refereePhone || "-"}</p>

                          <div className="comment-box">
                            <textarea
                              placeholder="Enter call comment..."
                              value={commentsMap[b.borrowerId] || ""}
                              onChange={(e) =>
                                handleCommentChange(b.borrowerId, e.target.value)
                              }
                            />
                            <button
                              className="called"
                              onClick={() => saveComment(b.borrowerId)}
                            >
                              Save
                            </button>
                          </div>

                          <div style={{ marginTop: "20px" }}>
                            <h4>Call History</h4>

                            {b.notes?.length > 0 ? (
                              b.notes
                                .slice()
                                .reverse()
                                .map((note, index) => (
                                  <div key={index}>
                                    <p>{note.text}</p>
                                    <small>
                                      {new Date(note.date).toLocaleString()} - {note.agent}
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