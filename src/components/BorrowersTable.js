// BorrowersBoard.js
import React, { useState, useEffect } from "react";

const API_URL = process.env.REACT_APP_API_URL;

function BorrowersBoard() {
  const [borrowers, setBorrowers] = useState([]);
  const [filterBy, setFilterBy] = useState("name");
  const [searchInput, setSearchInput] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [selected, setSelected] = useState(null);
  const [comment, setComment] = useState("");

  // ✅ Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [perPage, setPerPage] = useState(5);

  useEffect(() => {
    fetch(`${API_URL}/api/borrowers/risk`)
      .then((res) => res.json())
      .then((data) => setBorrowers(Array.isArray(data) ? data : []))
      .catch((err) => console.error(err));
  }, []);

  const filteredBorrowers = Array.isArray(borrowers)
    ? borrowers.filter((b) => {
        if (!searchQuery) return true;
        if (filterBy === "name") {
          return b.name.toLowerCase().includes(searchQuery.toLowerCase());
        } else if (filterBy === "status") {
          return b.status?.toLowerCase().includes(searchQuery.toLowerCase());
        }
        return true;
      })
    : [];

  //  Pagination logic
  const totalPages = Math.ceil(filteredBorrowers.length / perPage);
  const indexOfLast = currentPage * perPage;
  const indexOfFirst = indexOfLast - perPage;
  const currentBorrowers = filteredBorrowers.slice(indexOfFirst, indexOfLast);

  return (
    <div className="borrowers-board">
      {/* EXPANDED DETAILS AT TOP */}
      {selected && (
        <div className="expanded-card">
          <button onClick={() => setSelected(null)}>Close</button>
          <h3>{selected.name}</h3>
          <p><strong>Phone:</strong> {selected.phone}</p>
          <p><strong>Email:</strong> {selected.email}</p>
          <p><strong>DOB:</strong> {new Date(selected.dob).toLocaleDateString()}</p>
          <p><strong>Balance:</strong> KES {selected.balance}</p>
          <p><strong>Status:</strong> {selected.status}</p>

          <textarea
            placeholder="Add a comment..."
            value={comment}
            onChange={(e) => setComment(e.target.value)}
          />

          <button
            onClick={() => {
              alert(`Comment saved for ${selected.name}: ${comment}`);
              setComment("");
            }}
          >
            Save
          </button>
        </div>
      )}

      {/* Header & Filters */}
      <div className="header">
        <h2>Risk Customers</h2>
        <div className="filters">
          <select
            value={filterBy}
            onChange={(e) => setFilterBy(e.target.value)}
          >
            <option value="name">Name</option>
            <option value="status">Status</option>
          </select>

          <input
            type="text"
            placeholder={`Search by ${filterBy}`}
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
          />

          <button onClick={() => setSearchQuery(searchInput)}>
            Search
          </button>
        </div>
      </div>

      {/* Table Headers */}
      <div className="borrowers-headers">
        <div className="col name">Name</div>
        <div className="col phone">Phone</div>
        <div className="col amount">Amount</div>
        <div className="col status">Status</div>
        <div className="col action">Action</div>
      </div>

      {/* Borrower Rows */}
      <div className="borrowers-list">
        {currentBorrowers.map((b) => (
          <div className="borrower-row" key={b._id}>
            <div className="col name">{b.name}</div>
            <div className="col phone">{b.phone}</div>
            <div className="col amount">
              KES{" "}
              {b.amount}
            </div>
            <div className={`col status ${b.status?.toLowerCase()}`}>
              {b.status}
            </div>
            <div className="col action">
              <button onClick={() => setSelected(b)}>View</button>
            </div>
          </div>
        ))}
      </div>

      {/* PAGINATION */}
      <div className="pagination">
        {/* Prev */}
        <button onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}>
          ◀
        </button>

        {/* Numbers */}
        {[...Array(totalPages)].map((_, i) => {
          const page = i + 1;
          return (
            <button
              key={page}
              className={currentPage === page ? "active" : ""}
              onClick={() => setCurrentPage(page)}
            >
              {page}
            </button>
          );
        })}

        {/* Next */}
        <button
          onClick={() =>
            setCurrentPage((p) => Math.min(p + 1, totalPages))
          }
        >
          ▶
        </button>

        {/* Per Page Dropdown */}
        <select
          value={perPage}
          onChange={(e) => {
            setPerPage(Number(e.target.value));
            setCurrentPage(1);
          }}
        >
          <option value={5}>5 / page</option>
          <option value={10}>10 / page</option>
          <option value={20}>20 / page</option>
        </select>
      </div>
    </div>
  );
}

export default BorrowersBoard;