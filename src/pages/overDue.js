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
  const userName = localStorage.getItem("username") || "System"; // logged-in user

  const axiosConfig = useMemo(() => ({
    headers: { Authorization: token ? `Bearer ${token}` : "" },
  }), [token]);

  const API = `${process.env.REACT_APP_API_URL}/api/borrowers/loans/overdue`;

  // Fetch overdue loans
  const fetchBorrowers = useCallback(async () => {
    try {
      const res = await axios.get(API, axiosConfig);
      setBorrowers(res.data);

      const statusMap = {};
      const commentInit = {};
      res.data.forEach((loan) => {
        statusMap[loan.borrowerId] = loan.contactStatus || null;
        commentInit[loan.borrowerId] = "";
      });

      setContactStatusMap(statusMap);
      setCommentsMap(commentInit);
    } catch (err) {
      console.error(err);
      alert("Failed to fetch overdue borrowers");
    }
  }, [API, axiosConfig]);

  useEffect(() => { fetchBorrowers(); }, [fetchBorrowers]);

  const toggle = (key) => setExpanded(expanded === key ? null : key);

  // Mark contact status
  const markStatus = async (borrowerId, status) => {
    try {
      await axios.put(
        `${process.env.REACT_APP_API_URL}/api/borrowers/${borrowerId}/contact-status`,
        { status },
        axiosConfig
      );
      setContactStatusMap(prev => ({ ...prev, [borrowerId]: status }));
    } catch (err) {
      console.error(err);
      alert("Failed to update status");
    }
  };

  // Handle comment typing
  const handleCommentChange = (id, text) => {
    setCommentsMap(prev => ({ ...prev, [id]: text }));
  };

  // Save comment
  const saveComment = async (id) => {
    const commentText = commentsMap[id]?.trim();
    if (!commentText) return alert("Cannot save empty comment");

    try {
      // Send agent (username) along with note
      await axios.put(
        `${process.env.REACT_APP_API_URL}/api/borrowers/${id}/contact-status`,
        { 
          status: contactStatusMap[id] || null, 
          note: { text: commentText, agent: userName } 
        },
        axiosConfig
      );

      // Update local state
      const updatedBorrowers = borrowers.map((loan) =>
        loan.borrowerId === id
          ? { 
              ...loan, 
              notes: [...(loan.notes || []), { text: commentText, date: new Date(), agent: userName }],
              contactStatus: contactStatusMap[id] || loan.contactStatus
            }
          : loan
      );

      setBorrowers(updatedBorrowers);
      setCommentsMap(prev => ({ ...prev, [id]: "" }));
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

  const filterRecentNotes = (notes) => {
    const twoWeeksAgo = new Date(Date.now() - 14*24*60*60*1000);
    return (notes || []).filter(note => new Date(note.date) >= twoWeeksAgo);
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
              <th>Contact Status</th>
            </tr>
          </thead>
          <tbody>
            {borrowers.map((loan) => {
              const status = contactStatusMap[loan.borrowerId];
              const key = `${loan.borrowerId}-${loan.dueDate}`;
              return (
                <React.Fragment key={key}>
                  <tr>
                    <td className="click-name" onClick={() => toggle(key)} style={{ cursor: 'pointer' }}>
                      {loan.name}
                    </td>
                    <td className="phone-cell">
                      <span>{loan.phone}</span>
                      <FaCopy className="copy-icon" onClick={() => copyPhone(loan.phone)} />
                      <a href={`tel:${loan.phone}`}><FaPhoneAlt className="call-icon" /></a>
                    </td>
                    <td>{loan.amount}</td>
                    <td>{loan.dueDate ? new Date(loan.dueDate).toLocaleDateString() : "-"}</td>
                    <td>
                      {status ? (
                        <span className={`status-label ${status.toLowerCase()}`}>{status}</span>
                      ) : (
                        <div className="status-buttons">
                          <FaCheckCircle className="status-icon called-icon" title="Mark as Called" onClick={() => markStatus(loan.borrowerId, "Called")} />
                          <FaTimesCircle className="status-icon unreachable-icon" title="Mark as Unreachable" onClick={() => markStatus(loan.borrowerId, "Unreachable")} />
                        </div>
                      )}
                    </td>
                  </tr>

                  {expanded === key && (
                    <tr className="details">
                      <td colSpan="5">
                        <div className="details-box">
                          <p><strong>Name:</strong> {loan.name}</p>
                          <p><strong>Phone:</strong> {loan.phone}</p>
                          <p><strong>Referee Name:</strong> {loan.refereeName || "-"}</p>
                          <p><strong>Referee Phone:</strong> {loan.refereePhone || "-"}</p>

                          <div style={{ marginTop: "15px" }}>
                            <textarea
                              placeholder="Enter call comment..."
                              value={commentsMap[loan.borrowerId] || ""}
                              onChange={(e) => handleCommentChange(loan.borrowerId, e.target.value)}
                              style={{ width:"100%", padding:"10px", borderRadius:"6px", border:"1px solid #ccc" }}
                            />
                            <button
                              className="called"
                              style={{ marginTop:"10px", padding:"8px 16px", borderRadius:"6px", cursor: "pointer" }}
                              onClick={() => saveComment(loan.borrowerId)}
                              disabled={!commentsMap[loan.borrowerId]?.trim()}
                            >
                              Save
                            </button>
                          </div>

                          <div style={{ marginTop: "20px" }}>
                            <h4>Call History</h4>
                            {filterRecentNotes(loan.notes).length > 0 ? (
                              filterRecentNotes(loan.notes)
                                .slice().reverse()
                                .map((note, idx) => (
                                  <div key={idx} style={{ background:"#f1f5f9", padding:"10px", borderRadius:"6px", marginBottom:"10px" }}>
                                    <p style={{ margin:0 }}>{note.text}</p>
                                    <small style={{ color:"#555" }}>
                                      {new Date(note.date).toLocaleString()} - {note.agent}
                                    </small>
                                  </div>
                                ))
                            ) : <p>No previous comments</p>}
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