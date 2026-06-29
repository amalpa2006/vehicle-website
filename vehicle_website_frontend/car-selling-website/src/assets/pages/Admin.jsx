import "./Admin.css";
import Header from "../../components/Header/Header";
import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";

const API_BASE = "http://127.0.0.1:8000";

function Admin() {
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState("vehicles");
  const [vehicles, setVehicles] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [message, setMessage] = useState("");

  // Fetch helper with auth
  const authFetch = useCallback(
    async (url, options = {}) => {
      const token = localStorage.getItem("accessToken");
      if (!token) {
        navigate("/login");
        return null;
      }

      const res = await fetch(url, {
        ...options,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
          ...options.headers,
        },
      });

      if (res.status === 401) {
        localStorage.removeItem("accessToken");
        navigate("/login");
        return null;
      }

      return res;
    },
    [navigate]
  );

  const fetchData = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      if (activeTab === "vehicles") {
        const res = await authFetch(`${API_BASE}/api/admin/vehicles`);
        if (res) {
          const data = await res.json();
          setVehicles(Array.isArray(data) ? data : data.vehicles || []);
        }
      } else {
        const res = await authFetch(`${API_BASE}/api/admin/users`);
        if (res) {
          const data = await res.json();
          setUsers(data.users || []);
        }
      }
    } catch (err) {
      setError("Failed to load data. Please try again.");
    } finally {
      setLoading(false);
    }
  }, [activeTab, authFetch]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // Clear success message on tab switch
  useEffect(() => {
    setMessage("");
  }, [activeTab]);

  // --- Vehicle actions ---
  const handleDeleteVehicle = async (carId) => {
    if (!window.confirm("Delete this vehicle permanently?")) return;
    try {
      const res = await authFetch(`${API_BASE}/api/admin/vehicles/${carId}`, {
        method: "DELETE",
      });
      if (res && res.ok) {
        setMessage("Vehicle deleted successfully");
        setVehicles((prev) => prev.filter((v) => v.id !== carId));
        setTimeout(() => setMessage(""), 3000);
      }
    } catch {
      setError("Failed to delete vehicle");
    }
  };

  // --- User actions ---
  const handleDeleteUser = async (userId) => {
    if (!window.confirm("Delete this user permanently?")) return;
    try {
      const res = await authFetch(`${API_BASE}/api/admin/users/${userId}`, {
        method: "DELETE",
      });
      if (res && res.ok) {
        setMessage("User deleted successfully");
        setUsers((prev) => prev.filter((u) => u.id !== userId));
        setTimeout(() => setMessage(""), 3000);
      }
    } catch {
      setError("Failed to delete user");
    }
  };

  const handleToggleAdmin = async (userId, currentIsAdmin) => {
    try {
      const res = await authFetch(
        `${API_BASE}/api/admin/users/${userId}`,
        {
          method: "PUT",
          body: JSON.stringify({ isAdmin: !currentIsAdmin }),
        }
      );
      if (res && res.ok) {
        const updated = await res.json();
        setUsers((prev) =>
          prev.map((u) => (u.id === userId ? { ...u, isAdmin: updated.isAdmin } : u))
        );
        setMessage(
          `User ${updated.isAdmin ? "promoted to" : "demoted from"} admin`
        );
        setTimeout(() => setMessage(""), 3000);
      }
    } catch {
      setError("Failed to update user");
    }
  };

  return (
    <>
      <Header />
      <main className="admin-page">
        <div className="admin-container">
          <h1 className="admin-title">Admin Dashboard</h1>

          {/* Tabs */}
          <div className="admin-tabs">
            <button
              className={`tab-btn ${activeTab === "vehicles" ? "active" : ""}`}
              onClick={() => setActiveTab("vehicles")}
            >
              Vehicles ({vehicles.length})
            </button>
            <button
              className={`tab-btn ${activeTab === "users" ? "active" : ""}`}
              onClick={() => setActiveTab("users")}
            >
              Users ({users.length})
            </button>
          </div>

          {/* Message */}
          {message && <div className="admin-message success">{message}</div>}
          {error && <div className="admin-message error">{error}</div>}

          {/* Loading */}
          {loading && (
            <div className="admin-loading">
              <div className="spinner" />
              <p>Loading data...</p>
            </div>
          )}

          {/* Vehicles Tab */}
          {!loading && activeTab === "vehicles" && (
            <div className="admin-section">
              <div className="section-header">
                <h2>All Vehicles</h2>
                <span className="record-count">{vehicles.length} records</span>
              </div>

              {vehicles.length === 0 ? (
                <div className="empty-state">
                  <p>No vehicles found in the database.</p>
                </div>
              ) : (
                <div className="table-wrapper">
                  <table className="admin-table">
                    <thead>
                      <tr>
                        <th>ID</th>
                        <th>Name</th>
                        <th>Brand</th>
                        <th>Model</th>
                        <th>Price</th>
                        <th>Type</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {vehicles.map((car) => (
                        <tr key={car.id}>
                          <td className="cell-id" title={car.id}>
                            {car.id?.slice(0, 8)}...
                          </td>
                          <td className="cell-name">{car.name}</td>
                          <td>{car.brand || "—"}</td>
                          <td>{car.model || "—"}</td>
                          <td className="cell-price">{car.price}</td>
                          <td>{car.car_type || "—"}</td>
                          <td className="cell-actions">
                            <button
                              className="action-btn delete"
                              onClick={() => handleDeleteVehicle(car.id)}
                              title="Delete vehicle"
                            >
                              Delete
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}

          {/* Users Tab */}
          {!loading && activeTab === "users" && (
            <div className="admin-section">
              <div className="section-header">
                <h2>All Users</h2>
                <span className="record-count">{users.length} records</span>
              </div>

              {users.length === 0 ? (
                <div className="empty-state">
                  <p>No users found in the database.</p>
                </div>
              ) : (
                <div className="table-wrapper">
                  <table className="admin-table">
                    <thead>
                      <tr>
                        <th>ID</th>
                        <th>Name</th>
                        <th>Email</th>
                        <th>Gender</th>
                        <th>DOB</th>
                        <th>Admin</th>
                        <th>Created</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {users.map((user) => (
                        <tr key={user.id}>
                          <td className="cell-id" title={user.id}>
                            {user.id?.slice(0, 8)}...
                          </td>
                          <td className="cell-name">
                            {user.firstName} {user.secondName}
                          </td>
                          <td>{user.email}</td>
                          <td>{user.gender}</td>
                          <td>{user.dateOfBirth}</td>
                          <td>
                            <span
                              className={`badge ${user.isAdmin ? "admin-badge" : "user-badge"}`}
                            >
                              {user.isAdmin ? "Admin" : "User"}
                            </span>
                          </td>
                          <td className="cell-date">
                            {user.createdAt
                              ? new Date(user.createdAt).toLocaleDateString()
                              : "—"}
                          </td>
                          <td className="cell-actions">
                            <button
                              className={`action-btn ${user.isAdmin ? "demote" : "promote"}`}
                              onClick={() =>
                                handleToggleAdmin(user.id, user.isAdmin)
                              }
                              title={
                                user.isAdmin
                                  ? "Remove admin privileges"
                                  : "Promote to admin"
                              }
                            >
                              {user.isAdmin ? "Demote" : "Promote"}
                            </button>
                            <button
                              className="action-btn delete"
                              onClick={() => handleDeleteUser(user.id)}
                              title="Delete user"
                            >
                              Delete
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}
        </div>
      </main>
    </>
  );
}

export default Admin;
