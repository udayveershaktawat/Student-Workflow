import React, { useEffect, useState } from 'react';
import { api } from '../api';

const td = { padding: '8px 10px', borderBottom: '1px solid #eee', textAlign: 'left' };
const btn = { background: '#1a7f37', color: '#fff', border: 'none', borderRadius: 6, padding: '6px 12px', cursor: 'pointer' };

export default function AdminView() {
  const [pending, setPending] = useState([]);
  const [error, setError] = useState(null);

  const load = async () => {
    setError(null);
    try {
      setPending(await api.getPending());
    } catch (e) {
      setError(e.message);
    }
  };

  useEffect(() => { load(); }, []);

  const approve = async (id) => {
    try {
      await api.approve(id);
      await load();
    } catch (e) {
      setError(e.message);
    }
  };

  return (
    <section>
      <h2>Pending approvals</h2>
      <p style={{ color: '#666' }}>Approving runs the Camunda task and flips status to <strong>ACTIVE</strong>.</p>

      {pending.length === 0 ? (
        <p>Nothing pending. 🎉</p>
      ) : (
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr>
              <th style={td}>ID</th><th style={td}>Name</th><th style={td}>Email</th>
              <th style={td}>Course</th><th style={td}>Created by</th><th style={td}></th>
            </tr>
          </thead>
          <tbody>
            {pending.map((s) => (
              <tr key={s.id}>
                <td style={td}>{s.id}</td>
                <td style={td}>{s.name}</td>
                <td style={td}>{s.email}</td>
                <td style={td}>{s.course}</td>
                <td style={td}>{s.createdBy}</td>
                <td style={td}><button style={btn} onClick={() => approve(s.id)}>Approve</button></td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
      <button style={{ marginTop: 16 }} onClick={load}>Refresh</button>
      {error && <p style={{ color: 'crimson' }}>{error}</p>}
    </section>
  );
}
