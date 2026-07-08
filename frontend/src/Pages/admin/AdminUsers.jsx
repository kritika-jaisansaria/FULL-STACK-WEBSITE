import React, { useEffect, useState } from "react";

const AdminUsers = () => {
  const [users, setUsers] = useState([]);
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState("");
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    total: 0,
    admins: 0,
    users: 0,
  });

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const userInfo = JSON.parse(localStorage.getItem("userInfo"));

      const res = await fetch(
        `http://localhost:8080/api/users?q=${search}&role=${roleFilter}`,
        {
          headers: {
            Authorization: `Bearer ${userInfo?.token}`,
          },
        }
      );

      const data = await res.json();
      const fetchedUsers = data.users || [];

      setUsers(fetchedUsers);
      setStats({
        total: data.totalUsers ?? fetchedUsers.length,
        admins: fetchedUsers.filter((u) => u.role === "admin").length,
        users: fetchedUsers.filter((u) => u.role === "user").length,
      });
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [search, roleFilter]);

  const deleteUser = async (id) => {
    if (!window.confirm("Delete this user?")) return;

    try {
      const userInfo = JSON.parse(localStorage.getItem("userInfo"));

      await fetch(`http://localhost:8080/api/users/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${userInfo?.token}`,
        },
      });

      fetchUsers();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div style={container}>
      <h1 style={{ margin: 0 }}>Manage Users</h1>

      {/* Stat Cards */}
      <div style={statGridStyle}>
        <StatCard title="Total Users" value={stats.total} />
        <StatCard title="Admins" value={stats.admins} />
        <StatCard title="Users" value={stats.users} />
      </div>

      {/* Filters */}
      <div style={filtersBarStyle}>
        <input
          placeholder="Search users..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          style={searchInputStyle}
        />

        <select
          value={roleFilter}
          onChange={(e) => setRoleFilter(e.target.value)}
          style={selectStyle}
        >
          <option value="">All Roles</option>
          <option value="admin">Admin</option>
          <option value="user">User</option>
        </select>
      </div>

      {/* Content */}
      {loading ? (
        <div style={stateBoxStyle}>
          <p>Loading users...</p>
        </div>
      ) : users.length === 0 ? (
        <div style={stateBoxStyle}>
          <div style={{ fontSize: 40, opacity: 0.4 }}>👤</div>
          <p>No users found.</p>
        </div>
      ) : (
        <>
          {/* Desktop table view */}
          <div className="users-table-view" style={tableWrapperStyle}>
            <table style={table}>
              <thead>
                <tr>
                  <th style={th}>Name</th>
                  <th style={th}>Email</th>
                  <th style={th}>Role</th>
                  <th style={th}>Joined</th>
                  <th style={th}>Action</th>
                </tr>
              </thead>

              <tbody>
                {users.map((user) => (
                  <tr key={user._id}>
                    <td style={td}>{user.name}</td>
                    <td style={td}>{user.email}</td>

                    <td style={td}>
                      <span
                        style={{
                          background:
                            user.role === "admin" ? "#7b2424" : "#1976d2",
                          color: "#fff",
                          padding: "4px 10px",
                          borderRadius: "20px",
                          fontSize: "12px",
                          whiteSpace: "nowrap",
                        }}
                      >
                        {user.role}
                      </span>
                    </td>

                    <td style={td}>
                      {new Date(user.createdAt).toLocaleDateString()}
                    </td>

                    <td style={td}>
                      <button
                        onClick={() => deleteUser(user._id)}
                        style={deleteBtn}
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Mobile card view */}
          <div className="users-card-view" style={cardListStyle}>
            {users.map((user) => (
              <div key={user._id} style={cardStyle}>
                <div style={cardTopRowStyle}>
                  <div style={{ fontWeight: 700, wordBreak: "break-word" }}>
                    {user.name}
                  </div>
                  <span
                    style={{
                      background: user.role === "admin" ? "#7b2424" : "#1976d2",
                      color: "#fff",
                      padding: "4px 10px",
                      borderRadius: "20px",
                      fontSize: "12px",
                      whiteSpace: "nowrap",
                    }}
                  >
                    {user.role}
                  </span>
                </div>

                <div style={{ fontSize: 13, color: "#666", wordBreak: "break-word" }}>
                  {user.email}
                </div>

                <div style={{ fontSize: 12, color: "#999" }}>
                  Joined: {new Date(user.createdAt).toLocaleDateString()}
                </div>

                <button
                  onClick={() => deleteUser(user._id)}
                  style={{ ...deleteBtn, width: "100%" }}
                >
                  Delete
                </button>
              </div>
            ))}
          </div>
        </>
      )}

      <style>{`
        .users-card-view {
          display: none;
        }

        @media (max-width: 700px) {
          .users-table-view {
            display: none !important;
          }
          .users-card-view {
            display: flex !important;
          }
        }
      `}</style>
    </div>
  );
};

const container = {
  flex: 1,
  padding: "30px",
  boxSizing: "border-box",
  width: "100%",
  overflowX: "hidden",
};

const statGridStyle = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))",
  gap: "20px",
  margin: "25px 0",
};

const filtersBarStyle = {
  display: "flex",
  flexWrap: "wrap",
  gap: "15px",
  marginBottom: "25px",
};

const searchInputStyle = {
  flex: 1,
  minWidth: "220px",
  padding: "12px",
  borderRadius: "8px",
  border: "1px solid #ccc",
  outline: "none",
  boxSizing: "border-box",
};

const selectStyle = {
  padding: "12px",
  borderRadius: "8px",
  border: "1px solid #ccc",
  boxSizing: "border-box",
};

const stateBoxStyle = {
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  justifyContent: "center",
  padding: "60px 20px",
  color: "#777",
  gap: 8,
  textAlign: "center",
};

const tableWrapperStyle = {
  width: "100%",
  overflowX: "auto",
  WebkitOverflowScrolling: "touch",
  borderRadius: 10,
  border: "1px solid #eee",
  boxShadow: "0 2px 8px rgba(0,0,0,.05)",
};

const table = {
  width: "100%",
  borderCollapse: "collapse",
  background: "#fff",
  minWidth: 650,
};

const th = {
  textAlign: "left",
  padding: "12px",
  borderBottom: "2px solid #ddd",
  whiteSpace: "nowrap",
};

const td = {
  padding: "12px",
  borderBottom: "1px solid #eee",
};

const deleteBtn = {
  background: "#c62828",
  color: "#fff",
  border: "none",
  padding: "8px 14px",
  borderRadius: "6px",
  cursor: "pointer",
};

const cardListStyle = {
  flexDirection: "column",
  gap: 12,
};

const cardStyle = {
  background: "#fff",
  border: "1px solid #eee",
  borderRadius: 12,
  padding: 16,
  boxShadow: "0 2px 8px rgba(0,0,0,.04)",
  display: "flex",
  flexDirection: "column",
  gap: 8,
  boxSizing: "border-box",
};

const cardTopRowStyle = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  gap: 8,
};

const StatCard = ({ title, value }) => (
  <div
    style={{
      background: "#fff",
      padding: "22px",
      borderRadius: "12px",
      boxShadow: "0 2px 8px rgba(0,0,0,.08)",
      boxSizing: "border-box",
    }}
  >
    <div
      style={{
        color: "#666",
        fontSize: "14px",
      }}
    >
      {title}
    </div>

    <h2
      style={{
        marginTop: "10px",
        color: "#7b2424",
      }}
    >
      {value}
    </h2>
  </div>
);

export default AdminUsers;