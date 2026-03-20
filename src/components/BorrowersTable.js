import React, { useState } from "react";

const dummyBorrowers = [
  {
    _id: "1",
    name: "John Mwangi",
    phone: "0712345678",
    email: "john@example.com",
    dob: "1990-01-01",
    balance: 15000,
    status: "Overdue",
    notes: "Has promised to pay next week",
    refereeName: "Peter Kimani",
    refereePhone: "0722000000",
    borrowHistory: [{ amount: 10000 }, { amount: 15000 }],
  },
  {
    _id: "2",
    name: "Mary Wanjiku",
    phone: "0723456789",
    email: "mary@example.com",
    dob: "1992-05-10",
    balance: 8000,
    status: "Pending",
    notes: "Has promised to pay next week",
    refereeName: "Jane Njeri",
    refereePhone: "0733000000",
    borrowHistory: [{ amount: 8000 }],
  },
  {
    _id: "3",
    name: "David Otieno",
    phone: "0798765432",
    email: "david@example.com",
    dob: "1988-09-20",
    balance: 20000,
    status: "Overdue",
    notes: "Not answering calls",
    refereeName: "Samuel Ochieng",
    refereePhone: "0700111222",
    borrowHistory: [{ amount: 20000 }],
  },
  {
    _id: "3",
    name: "Chris Wamwenje",
    phone: "0754765432",
    email: "chris@example.com",
    dob: "1958-09-20",
    balance: 23000,
    status: "Unreachable",
    notes: "Not answering calls",
    refereeName: "Samuel Ochieng",
    refereePhone: "0700111222",
    borrowHistory: [{ amount: 20000 }],
  },
  {
    _id: "3",
    name: "Danniel Ruto",
    phone: "0794765432",
    email: "daniel@example.com",
    dob: "1981-09-20",
    balance: 30000,
    status: "Unreachable",
    notes: "Not answering calls",
    refereeName: "Samuel Kirui",
    refereePhone: "0723111252",
    borrowHistory: [{ amount: 20000 }],
  },
];

function BorrowersTable() {
  const [borrowers] = useState(dummyBorrowers);
  const [selected, setSelected] = useState(null);

  const isHighRisk = (b) => {
    const overdue = b.status === "Unreachable" || b.status === "Overdue";
    const highBalance = b.balance > 10000;
    return overdue || highBalance;
  };

  const highRiskBorrowers = borrowers.filter(isHighRisk);

  return (
    <div className="table-section">
      <h2>Risk Accounts</h2>

      <table>
        <thead>
          <tr>
            <th>Name</th>
            <th>Phone</th>
            <th>Balance</th>
            <th>Status</th>
            <th>Action</th>
          </tr>
        </thead>

        <tbody>
          {highRiskBorrowers.map((b) => (
            <tr key={b._id}>
              <td>{b.name}</td>
              <td>{b.phone}</td>
              <td>KES {b.balance}</td>
              <td className={b.status?.toLowerCase()}>
                {b.status}
              </td>
              <td>
                <button onClick={() => setSelected(b)}>View</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* DETAILS MODAL */}
      {selected && (
        <div className="details-modal">
          <div className="details-content">
            <button onClick={() => setSelected(null)}>Close</button>

            <h3>Borrower Details</h3>

            <p><strong>Name:</strong> {selected.name}</p>
            <p><strong>Phone:</strong> {selected.phone}</p>
            <p><strong>Email:</strong> {selected.email}</p>
            <p><strong>DOB:</strong> {new Date(selected.dob).toLocaleDateString()}</p>

            <hr />

            <h4>Loan Information</h4>
            <p><strong>Balance:</strong> KES {selected.balance}</p>

            {selected.borrowHistory?.length > 0 && (
              <p>
                <strong>Last Loan:</strong> KES{" "}
                {
                  selected.borrowHistory[
                    selected.borrowHistory.length - 1
                  ].amount
                }
              </p>
            )}

            <hr />

            <h4>Referee Details</h4>
            <p><strong>Name:</strong> {selected.refereeName}</p>
            <p><strong>Phone:</strong> {selected.refereePhone}</p>

            <hr />

            <h4>Notes</h4>
            <p>{selected.notes || "No notes"}</p>
          </div>
        </div>
      )}
    </div>
  );
}

export default BorrowersTable;