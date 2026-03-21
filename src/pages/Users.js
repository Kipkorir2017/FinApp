import React, { useEffect, useState, useCallback, useMemo } from "react";
import axios from "axios";
import "../index.css";
import Header from "../components/Header";

function Users() {
  const [users, setUsers] = useState([]);
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    role: "agent",
  });

  const token = localStorage.getItem("token");
  const role = localStorage.getItem("role");

  
  const axiosConfig = useMemo(() => ({
    headers: {
      Authorization: token ? `Bearer ${token}` : ""
    }
  }), [token]);

  
  const USERS_API = `${process.env.REACT_APP_API_URL}/api/users`;

  
  const fetchUsers = useCallback(async () => {
    try {
      const res = await axios.get(`${USERS_API}/all`, axiosConfig);
      setUsers(res.data);
    } catch (err) {
      console.error("Fetch users error:", err);
      alert(err.response?.data?.message || "Failed to fetch users.");
    }
  }, [USERS_API, axiosConfig]);

  
  useEffect(() => {
    if (role === "admin") {
      fetchUsers();
    }
  }, [role, fetchUsers]);

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const createUser = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post(
        `${USERS_API}/create`,
        form,
        axiosConfig
      );
      alert(res.data.message || "User created successfully!");
      fetchUsers();
      setForm({ name: "", email: "", password: "", role: "agent" });
    } catch (err) {
      console.error("Create user error:", err);
      alert(err.response?.data?.message || "Failed to create user.");
    }
  };

  const deleteUser = async (id) => {
    if (!window.confirm("Are you sure you want to delete this user?")) return;

    try {
      const res = await axios.delete(
        `${USERS_API}/${id}`,
        axiosConfig
      );
      alert(res.data.message || "User deleted successfully!");
      fetchUsers();
    } catch (err) {
      console.error("Delete user error:", err);
      alert(err.response?.data?.message || "Failed to delete user.");
    }
  };

  const changeRole = async (id, newRole) => {
    try {
      const res = await axios.put(
        `${USERS_API}/${id}`,
        { role: newRole },
        axiosConfig
      );
      alert(res.data.message || "Role updated successfully!");
      fetchUsers();
    } catch (err) {
      console.error("Change role error:", err);
      alert(err.response?.data?.message || "Failed to update role.");
    }
  };

  if (role !== "admin") return <p>Access denied. Admins only.</p>;

  return (
    <div className="users-page">
      <div className="main">
        <Header />
      </div>

      <h2>User Management</h2>

      {/* CREATE USER FORM */}
      <div className="create-user-card">
        <h3>Create New User</h3>
        <form onSubmit={createUser}>
          <input
            type="text"
            name="name"
            placeholder="Full Name"
            value={form.name}
            onChange={handleChange}
            required
          />
          <input
            type="email"
            name="email"
            placeholder="Email"
            value={form.email}
            onChange={handleChange}
            required
          />
          <input
            type="password"
            name="password"
            placeholder="Temporary Password"
            value={form.password}
            onChange={handleChange}
            required
          />
          <select name="role" value={form.role} onChange={handleChange}>
            <option value="agent">Agent</option>
            <option value="teamleader">Team Leader</option>
            <option value="admin">Admin</option>
          </select>
          <button type="submit" className="btn-submit">
            Create User
          </button>
        </form>
      </div>

      {/* USERS LIST */}
      <table className="users-table">
        <thead>
          <tr>
            <th>Name</th>
            <th>Email</th>
            <th>Role</th>
            <th>Actions</th>
          </tr>
        </thead>

        <tbody>
          {users.map((user) => (
            <tr key={user._id}>
              <td>{user.name}</td>
              <td>{user.email}</td>
              <td>
                <select
                  value={user.role}
                  onChange={(e) => changeRole(user._id, e.target.value)}
                >
                  <option value="agent">Agent</option>
                  <option value="teamleader">Team Leader</option>
                  <option value="admin">Admin</option>
                </select>
              </td>
              <td>
                <button
                  className="delete-btn"
                  onClick={() => deleteUser(user._id)}
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default Users;