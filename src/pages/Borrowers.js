import React, { useEffect, useState, useCallback, useMemo } from "react";
import axios from "axios";
import "../index.css";
import {
  FaPhoneAlt,
  FaArrowLeft,
  FaCheckCircle,
  FaTimesCircle,
  FaCopy
} from "react-icons/fa";
import Sidebar from "../components/SideBar";

function Borrowers() {
  const [borrowers, setBorrowers] = useState([]);
  const [expandedId, setExpandedId] = useState(null);
  const [borrowerStatus, setBorrowerStatus] = useState({});
  const [borrowerComments, setBorrowerComments] = useState({});

  const token = localStorage.getItem("token");

  const axiosConfig = useMemo(() => ({
    headers: {
      Authorization: token ? `Bearer ${token}` : ""
    }
  }), [token]);

  // ✅ Using environment variable
  const BORROWERS_API = `${process.env.REACT_APP_API_URL}/api/borrowers`;

  const fetchBorrowers = useCallback(async () => {
    try {
      const res = await axios.get(BORROWERS_API, axiosConfig);
      setBorrowers(res.data);

      const statusMap = {};
      const commentsMap = {};

      res.data.forEach(b => {
        statusMap[b._id] = b.status || null;
        commentsMap[b._id] = b.notes || "";
      });

      setBorrowerStatus(statusMap);
      setBorrowerComments(commentsMap);
    } catch (err) {
      console.error(err);
      alert("Failed to fetch borrowers. Check your token or API URL.");
    }
  }, [BORROWERS_API, axiosConfig]);

  useEffect(() => {
    fetchBorrowers();
  }, [fetchBorrowers]);

  const toggleDetails = id =>
    setExpandedId(expandedId === id ? null : id);

  const markStatus = async (id, status) => {
    try {
      await axios.put(
        `${BORROWERS_API}/${id}`,
        { status, notes: borrowerComments[id] || "" },
        axiosConfig
      );

      setBorrowerStatus(prev => ({ ...prev, [id]: status }));
    } catch (err) {
      console.error(err);
      alert("Failed to update status");
    }
  };

  const handleCommentChange = (id, text) => {
    setBorrowerComments(prev => ({ ...prev, [id]: text }));
  };

  const saveComment = async id => {
    try {
      await axios.put(
        `${BORROWERS_API}/${id}`,
        {
          notes: borrowerComments[id],
          status: borrowerStatus[id] || null
        },
        axiosConfig
      );

      alert("Comment saved!");
    } catch (err) {
      console.error(err);
      alert("Failed to save comment");
    }
  };

  const copyPhone = phone => {
    navigator.clipboard.writeText(phone);
    alert(`Copied: ${phone}`);
  };

  return (
    <div className="borrowers-page">
      <div className="container">
        <Sidebar />

        <div className="table-container">
          <h2>Due Customers</h2>

          <table className="borrowers-table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Phone</th>
                <th>DOB</th>
                <th>Amount</th>
                <th>Referee Contact</th>
                <th>Comments</th>
                <th>Status</th>
              </tr>
            </thead>

            <tbody>
              {borrowers.map(b => (
                <React.Fragment key={b._id}>
                  <tr className={borrowerStatus[b._id] === "Called" ? "called-row" : ""}>
                    <td>
                      <span className="clickable-name" onClick={() => toggleDetails(b._id)}>
                        {b.name}
                      </span>
                    </td>

                    <td className="phone-cell">
                      <span>{b.phone}</span>
                      <FaCopy className="copy-icon" onClick={() => copyPhone(b.phone)} />
                      <a href={`tel:${b.phone}`} className="call-link">
                        <FaPhoneAlt className="phone-icon" />
                      </a>
                    </td>

                    <td>{b.dob ? new Date(b.dob).toLocaleDateString() : "-"}</td>

                    <td>
                      {b.borrowHistory && b.borrowHistory.length > 0
                        ? b.borrowHistory[b.borrowHistory.length - 1].amount
                        : 0}
                    </td>

                    <td className="phone-cell">
                      {b.refereePhone ? (
                        <>
                          <span>{b.refereePhone}</span>
                          <FaCopy className="copy-icon" onClick={() => copyPhone(b.refereePhone)} />
                          <a href={`tel:${b.refereePhone}`} className="call-link">
                            <FaPhoneAlt className="phone-icon" />
                          </a>
                        </>
                      ) : (
                        "-"
                      )}
                    </td>

                    <td>
                      <input
                        type="text"
                        className="comment-input"
                        value={borrowerComments[b._id] || ""}
                        onChange={e => handleCommentChange(b._id, e.target.value)}
                        placeholder="Add comment..."
                      />
                      <button className="save-comment-btn" onClick={() => saveComment(b._id)}>
                        Save
                      </button>
                    </td>

                    <td className="status-column">
                      <FaCheckCircle
                        className={`status-button called-btn ${
                          borrowerStatus[b._id] === "Called" ? "active" : ""
                        }`}
                        onClick={() => markStatus(b._id, "Called")}
                        title="Mark as Called"
                      />
                      <FaTimesCircle
                        className={`status-button unreachable-btn ${
                          borrowerStatus[b._id] === "Unreachable" ? "active" : ""
                        }`}
                        onClick={() => markStatus(b._id, "Unreachable")}
                        title="Mark as Unreachable"
                      />
                    </td>
                  </tr>

                  {expandedId === b._id && (
                    <tr className="expanded-row">
                      <td colSpan="7">
                        <div className="expanded-header">
                          <FaArrowLeft className="back-icon" onClick={() => setExpandedId(null)} />
                          <span>Account Details</span>
                        </div>
                        <div className="expanded-content">
                          <p><strong>Email:</strong> {b.email || "-"}</p>
                          <p><strong>Referee Name:</strong> {b.refereeName || "-"}</p>
                        </div>
                      </td>
                    </tr>
                  )}
                </React.Fragment>
              ))}
            </tbody>
          </table>

        </div>
      </div>
    </div>
  );
}

export default Borrowers;