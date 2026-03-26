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

  return (
    <div style={{ padding: "20px", fontFamily: "Arial", color: "white" }}>
      <h1 style={{ textAlign: "center" }}>
         IT Operations Incident Dashboard
      </h1>

      <p style={{ textAlign: "center" }}>
        Total incidents: {incidents.length}
      </p>

      <form onSubmit={createIncident} style={{ marginBottom: "20px" }}>
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

      <table style={{ width: "100%", borderCollapse: "collapse" }}>
        <thead>
          <tr style={{ background: "#222" }}>
            <th>Title</th>
            <th>Description </th>
            <th>User</th>
            <th>Severity</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>

        <tbody>
          {incidents.map((inc) => (
            <tr
              key={inc.id}
              style={{ borderBottom: "1px solid #444", textAlign: "center" }}
            >

              <td>
                {editingId === inc.id ? (
                  <input
                    defaultValue={inc.title}
                    onChange={(e) =>
                      setEditData((prev) => ({
                        ...prev,
                        title: e.target.value
                      }))
                    }
                  />
                ) : (
                  inc.title
                )}
              </td>
              <td>
                {editingId === inc.description ? (
                  <input
                    defaultValue={inc.description}
                    onChange={(e) =>
                      setEditData((prev) => ({
                        ...prev,
                        description: e.target.value
                      }))
                    }
                  />
                ) : (
                  inc.description
                )}
              </td>

              <td>
                {editingId === inc.id ? (
                  <input
                    defaultValue={inc.user_name}
                    onChange={(e) =>
                      setEditData((prev) => ({
                        ...prev,
                        user_name: e.target.value
                      }))
                    }
                  />
                ) : (
                  inc.user_name
                )}
              </td>

              <td>
                {editingId === inc.id ? (
                  <select
                    defaultValue={inc.severity}
                    onChange={(e) =>
                      setEditData((prev) => ({
                        ...prev,
                        severity: e.target.value
                      }))
                    }
                  >
                    <option value="low">low</option>
                    <option value="medium">medium</option>
                    <option value="high">high</option>
                    <option value="critical">critical</option>
                    <option value="info">info</option>
                  </select>
                ) : (
                  <span
                    style={{
                      color:
                        inc.severity === "critical"
                          ? "red"
                          : inc.severity === "high"
                          ? "orange"
                          : inc.severity === "medium"
                          ? "yellow"
                          : "lightgreen"
                    }}
                  >
                    {inc.severity}
                  </span>
                )}
              </td>

              <td>
                {editingId === inc.id ? (
                  <select
                    defaultValue={inc.status}
                    onChange={(e) =>
                      setEditData((prev) => ({
                        ...prev,
                        status: e.target.value
                      }))
                    }
                  >
                    <option value="open">open</option>
                    <option value="in_progress">in progress</option>
                    <option value="resolved">resolved</option>
                  </select>
                ) : (
                  <span
                    style={{
                      color:
                        inc.status === "resolved"
                          ? "lightgreen"
                          : inc.status === "in_progress"
                          ? "orange"
                          : "white"
                    }}
                  >
                    {inc.status}
                  </span>
                )}
              </td>

              <td>
                {editingId === inc.id ? (
                  <button onClick={() => updateIncident(inc.id, inc)}>
                    Save
                  </button>
                ) : (
                  <button
                    onClick={() => {
                      setEditingId(inc.id);
                      setEditData(inc);
                    }}
                  >
                    Edit
                  </button>
                )}

                <button
                  onClick={() =>
                    updateIncidentStatus(inc.id, "in_progress")
                  }
                >
                  In Progress
                </button>

                <button
                  onClick={() => updateIncidentStatus(inc.id, "resolved")}
                >
                  Resolve
                </button>

                <button onClick={() => deleteIncident(inc.id)}>
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

export default App;