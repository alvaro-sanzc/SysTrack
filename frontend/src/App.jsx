import { useEffect, useState } from "react";

function App() {
  const [incidents, setIncidents] = useState([]);

  const [form, setForm] = useState({
    user_name: "",
    title: "",
    description: "",
    severity: "low"
  });

  const [editingId, setEditingId] = useState(null);
  const [editData, setEditData] = useState({});
  const [search, setSearch] = useState("");

  const fetchIncidents = async () => {
    const res = await fetch("http://localhost:3000/incidents");
    const data = await res.json();
    setIncidents(data);
  };

  useEffect(() => {
    fetchIncidents();
  }, []);

  const createIncident = async (e) => {
    e.preventDefault();

    await fetch("http://localhost:3000/incidents", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(form)
    });

    setForm({
      user_name: "",
      title: "",
      description: "",
      severity: "low"
    });

    fetchIncidents();
  };

  const deleteIncident = async (id) => {
    await fetch(`http://localhost:3000/incidents/${id}`, {
      method: "DELETE"
    });

    fetchIncidents();
  };

  const updateIncidentStatus = async (id, status) => {
    await fetch(`http://localhost:3000/incidents/${id}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ status })
    });

    fetchIncidents();
  };

  const updateIncident = async (id, inc) => {
    const updatedData = {
      title: editData.title ?? inc.title,
      description: editData.description ?? inc.description,
      user_name: editData.user_name ?? inc.user_name,
      severity: editData.severity ?? inc.severity,
      status: editData.status ?? inc.status
    };

    await fetch(`http://localhost:3000/incidents/${id}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(updatedData)
    });

    setEditingId(null);
    setEditData({});
    fetchIncidents();
  };

  const sortedIncidents = [...incidents].sort((a, b) => {
    const order = { critical: 1, high: 2, medium: 3, low: 4, info: 5 };
    return order[a.severity] - order[b.severity];
  });

  const filteredIncidents = sortedIncidents.filter((inc) =>
    inc.title.toLowerCase().includes(search.toLowerCase()) ||
    inc.description.toLowerCase().includes(search.toLowerCase()) ||
    inc.user_name.toLowerCase().includes(search.toLowerCase())
  );

  const buttonStyle = {
    padding: "5px 10px",
    borderRadius: "6px",
    border: "none",
    cursor: "pointer",
    fontSize: "12px"
  };

  return (
    <div style={{
      padding: "30px",
      fontFamily: "Arial",
      color: "white",
      maxWidth: "1200px",
      margin: "0 auto"
    }}>

      <h1 style={{ textAlign: "center", marginBottom: "5px" }}>
        IT Operations Incident Dashboard
      </h1>
      <h3 style={{ textAlign: "center", color: "#aaa", marginBottom: "20px" }}>
        Real-time monitoring and management of incidents
      </h3>

      <p style={{ textAlign: "center" }}>
        Total incidents: {incidents.length}
      </p>

      <input
        placeholder="🔍 Search by title, user or description..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        style={{
          width: "100%",
          padding: "12px",
          borderRadius: "8px",
          border: "1px solid #444",
          background: "#1a1a1a",
          color: "white",
          marginBottom: "20px"
        }}
      />

      <table style={{
        width: "100%",
        borderCollapse: "separate",
        borderSpacing: "0 10px"
      }}>
        <thead>
          <tr style={{ color: "#aaa" }}>
            <th>Title</th>
            <th>Description</th>
            <th>User</th>
            <th>Severity</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>

        <tbody>
          {filteredIncidents.map((inc) => (
            <tr key={inc.id} style={{ background: "#1a1a1a", borderRadius: "10px", textAlign: "center" }}>

              <td>{inc.title}</td>
              <td>{inc.description}</td>
              <td>{inc.user_name}</td>

              <td>
                <span style={{
                  padding: "4px 8px",
                  borderRadius: "6px",
                  background:
                    inc.severity === "critical" ? "#7f1d1d" :
                    inc.severity === "high" ? "#7c2d12" :
                    inc.severity === "medium" ? "#78350f" :
                    "#14532d"
                }}>
                  {inc.severity}
                </span>
              </td>

              <td>
                <span style={{
                  padding: "4px 8px",
                  borderRadius: "6px",
                  background:
                    inc.status === "resolved" ? "#14532d" :
                    inc.status === "in_progress" ? "#78350f" :
                    "#374151"
                }}>
                  {inc.status}
                </span>
              </td>

              <td style={{ display: "flex", gap: "5px", justifyContent: "center" }}>
                <button
                  style={{ ...buttonStyle, background: "#444" }}
                  onClick={() => {
                    setEditingId(inc.id);
                    setEditData(inc);
                  }}
                >
                  Edit
                </button>

                <button
                  style={{ ...buttonStyle, background: "#f59e0b" }}
                  onClick={() => updateIncidentStatus(inc.id, "in_progress")}
                >
                  In Progress
                </button>

                <button
                  style={{ ...buttonStyle, background: "#22c55e" }}
                  onClick={() => updateIncidentStatus(inc.id, "resolved")}
                >
                  Resolve
                </button>

                <button
                  style={{ ...buttonStyle, background: "#ef4444" }}
                  onClick={() => deleteIncident(inc.id)}
                >
                  Delete
                </button>
              </td>

            </tr>
          ))}
        </tbody>
      </table>

      <h2 style={{ textAlign: "center", marginTop: "30px" }}>
        Add Incident
      </h2>

      <form onSubmit={createIncident} style={{ textAlign: "center" }}>
        <input
          placeholder="User"
          value={form.user_name}
          onChange={(e) =>
            setForm((prev) => ({ ...prev, user_name: e.target.value }))
          }
        />
        <input
          placeholder="Title"
          value={form.title}
          onChange={(e) =>
            setForm((prev) => ({ ...prev, title: e.target.value }))
          }
        />
        <input
          placeholder="Description"
          value={form.description}
          onChange={(e) =>
            setForm((prev) => ({ ...prev, description: e.target.value }))
          }
        />
        <select
          value={form.severity}
          onChange={(e) =>
            setForm((prev) => ({ ...prev, severity: e.target.value }))
          }
        >
          <option value="low">low</option>
          <option value="medium">medium</option>
          <option value="high">high</option>
          <option value="critical">critical</option>
          <option value="info">info</option>
        </select>

        <button type="submit">Create</button>
      </form>
    </div>
  );
}

export default App;