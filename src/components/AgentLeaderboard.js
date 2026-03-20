// src/components/AgentLeaderboard.js
import React from "react";

const leaderboardData = [
  { name: "Alice Johnson", dealsClosed: 25 },
  { name: "Bob Smith", dealsClosed: 20 },
  { name: "Charlie Brown", dealsClosed: 18 },
  { name: "Diana Prince", dealsClosed: 15 },
  { name: "Ethan Hunt", dealsClosed: 12 },
];

function AgentLeaderboard() {
  return (
    <div className="leaderboard-container">
      <h2>Agent Leaderboard</h2>
      <table className="leaderboard-table">
        <thead>
          <tr>
            <th>Rank</th>
            <th>Agent Name</th>
            <th>Deals Closed</th>
          </tr>
        </thead>
        <tbody>
          {leaderboardData.map((agent, index) => (
            <tr key={agent.name}>
              <td>{index + 1}</td>
              <td>{agent.name}</td>
              <td>{agent.dealsClosed}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default AgentLeaderboard;