// import React, { useEffect, useState } from "react";
// import "../index.css";
// import { FaPhoneAlt, FaCheckCircle, FaTimesCircle } from "react-icons/fa";

// function Borrowers() {

//   const [borrowers, setBorrowers] = useState([]);
//   const [expanded, setExpanded] = useState(null);

//   const API = process.env.REACT_APP_API;

//   useEffect(() => {
//     fetchBorrowers();
//   }, []);

//   const fetchBorrowers = async () => {
//     const res = await fetch(`${API}/borrowers/overdue`);
//     const data = await res.json();
//     setBorrowers(data);
//   };

//   const toggle = (id) => {
//     setExpanded(expanded === id ? null : id);
//   };

//   const markStatus = async (id, status) => {

//     await fetch(`${API}/calls/log`, {
//       method: "POST",
//       headers: {
//         "Content-Type": "application/json"
//       },
//       body: JSON.stringify({
//         customerID: id,
//         status,
//         collector: "Agent1"
//       })
//     });

//     alert("Status saved");
//   };

//   return (

//     <div className="borrowers-page">

//       <h1 className="title">Overdue Loan Customers</h1>

//       <table className="borrowers-table">

//         <thead>
//           <tr>
//             <th>Name</th>
//             <th>Phone</th>
//             <th>Amount</th>
//             <th>Days Overdue</th>
//             <th>Risk</th>
//             <th>Call</th>
//           </tr>
//         </thead>

//         <tbody>

//           {borrowers.map((b) => {

//             const highRisk = b.daysOverdue > 30;

//             return (

//               <React.Fragment key={b.customerID}>

//                 <tr className={highRisk ? "high-risk" : ""}>

//                   <td
//                     className="click-name"
//                     onClick={() => toggle(b.customerID)}
//                   >
//                     {b.name}
//                   </td>

//                   <td>{b.phone}</td>

//                   <td>${b.amount}</td>

//                   <td>{b.daysOverdue}</td>

//                   <td>
//                     <span className={`risk ${b.risk}`}>
//                       {b.risk}
//                     </span>
//                   </td>

//                   <td>
//                     <a href={`tel:${b.phone}`} className="call-btn">
//                       <FaPhoneAlt />
//                     </a>
//                   </td>

//                 </tr>

//                 {expanded === b.customerID && (

//                   <tr className="details">

//                     <td colSpan="6">

//                       <div className="details-box">

//                         <p>
//                           <strong>Referee Phone:</strong> {b.refereePhone}
//                         </p>

//                         <div className="status-buttons">

//                           <button
//                             className="called"
//                             onClick={() => markStatus(b.customerID, "Called")}
//                           >
//                             <FaCheckCircle /> Called
//                           </button>

//                           <button
//                             className="unreachable"
//                             onClick={() => markStatus(b.customerID, "Unreachable")}
//                           >
//                             <FaTimesCircle /> Unreachable
//                           </button>

//                         </div>

//                       </div>

//                     </td>

//                   </tr>

//                 )}

//               </React.Fragment>

//             );

//           })}

//         </tbody>

//       </table>

//     </div>

//   );

// }

// export default Borrowers;
import React, { useState } from "react";
import Sidebar from "../components/SideBar";
import "../index.css";
import {
  FaPhoneAlt,
  FaCheckCircle,
  FaTimesCircle,
  FaCopy,
} from "react-icons/fa";

function Borrowers() {
  const [borrowers, setBorrowers] = useState([
    {
      customerID: "C001",
      name: "John Wanjala",
      phone: "0712345678",
      amount: 15000,
      daysOverdue: 25,
      risk: "Medium",
      refereePhone: "0722000000",
      status: null,
    },
    {
      customerID: "C002",
      name: "Mary Wanjiku",
      phone: "0723456789",
      amount: 8000,
      daysOverdue: 45,
      risk: "High",
      refereePhone: "0733000000",
      status: null,
    },
    {
      customerID: "C003",
      name: "David Otieno",
      phone: "0798765432",
      amount: 20000,
      daysOverdue: 60,
      risk: "High",
      refereePhone: "0700111222",
      status: null,
    },
     {
      customerID: "C004",
      name: "Dan Ruto",
      phone: "0712346678",
      amount: 25000,
      daysOverdue: 15,
      risk: "Medium",
      refereePhone: "0722000123",
      status: null,
    },
  ]);

  const [expanded, setExpanded] = useState(null);

  const toggle = (id) => {
    setExpanded(expanded === id ? null : id);
  };

  const markStatus = (id, status) => {
    setBorrowers((prev) =>
      prev.map((b) =>
        b.customerID === id ? { ...b, status } : b
      )
    );
  };

  const copyPhone = (phone) => {
    navigator.clipboard.writeText(phone);
    alert(`Copied: ${phone}`);
  };

  return (
    <div className="page-layout">
      <Sidebar />

      <div className="main-content">
        <h1 className="title">Overdue Loan Customers</h1>

        <table className="borrowers-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Phone</th>
              <th>Amount</th>
              <th>Days Overdue</th>
              <th>Risk</th>
              <th>Status</th>
            </tr>
          </thead>

          <tbody>
            {borrowers.map((b) => {
              const highRisk = b.daysOverdue > 30;

              return (
                <React.Fragment key={b.customerID}>
                  <tr className={highRisk ? "high-risk" : ""}>
                    <td
                      className="click-name"
                      onClick={() => toggle(b.customerID)}
                    >
                      {b.name}
                    </td>

                    {/* PHONE CELL */}
                    <td className="phone-cell">
                      <span>{b.phone}</span>

                      {/* Copy icon */}
                      <FaCopy
                        className="copy-icon"
                        onClick={() => copyPhone(b.phone)}
                      />

                      {/* Call icon (blue) */}
                      <a href={`tel:${b.phone}`}>
                        <FaPhoneAlt className="call-icon" />
                      </a>
                    </td>

                    <td>KES {b.amount}</td>

                    <td>{b.daysOverdue} days</td>

                    <td>
                      <span className={`risk ${b.risk?.toLowerCase()}`}>
                        {b.risk}
                      </span>
                    </td>

                    {/* STATUS */}
                    <td>
                      {b.status ? (
                        <span className={`status-label ${b.status.toLowerCase()}`}>
                          {b.status}
                        </span>
                      ) : (
                        <div className="status-buttons">
                          <FaCheckCircle
                            className="status-icon called-icon"
                            title="Mark as Called"
                            onClick={() =>
                              markStatus(b.customerID, "Called")
                            }
                          />

                          <FaTimesCircle
                            className="status-icon unreachable-icon"
                            title="Mark as Unreachable"
                            onClick={() =>
                              markStatus(b.customerID, "Unreachable")
                            }
                          />
                        </div>
                      )}
                    </td>
                  </tr>

                  {expanded === b.customerID && (
                    <tr className="details">
                      <td colSpan="6">
                        <div className="details-box">
                          <p>
                            <strong>Referee Phone:</strong>{" "}
                            {b.refereePhone}
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