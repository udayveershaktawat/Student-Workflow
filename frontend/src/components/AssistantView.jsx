import React, { useState } from 'react';
import { api } from '../api';

const input = { display: 'block', width: '100%', padding: 8, margin: '4px 0 12px', borderRadius: 6, border: '1px solid #ccc', boxSizing: 'border-box' };
const btn = { background: '#1a1a1a', color: '#fff', border: 'none', borderRadius: 6, padding: '8px 16px', cursor: 'pointer' };

export default function AssistantView() {
  const [form, setForm] = useState({ name: '', email: '', course: '' });
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);

  const submit = async () => {
    setError(null);
    setResult(null);
    try {
      const created = await api.createStudent(form);
      setResult(created);
      setForm({ name: '', email: '', course: '' });
    } catch (e) {
      setError(e.message);
    }
  };

  const update = (k) => (e) => setForm({ ...form, [k]: e.target.value });

  return (
    <section>
      <h2>Create a student</h2>
      <p style={{ color: '#666' }}>New students start in <strong>CREATE</strong> and await admin approval.</p>

      <label>Name</label>
      <input style={input} value={form.name} onChange={update('name')} />
      <label>Email</label>
      <input style={input} value={form.email} onChange={update('email')} />
      <label>Course</label>
      <input style={input} value={form.course} onChange={update('course')} />

      <button style={btn} onClick={submit}>Create student</button>




      

      {result && (
        <p style={{ color: 'green', marginTop: 16 }}>
          Created #{result.id} — status {result.status} (process {result.processInstanceId?.slice(0, 8)}…)
        </p>
      )}
      {error && <p style={{ color: 'crimson', marginTop: 16 }}>{error}</p>}
    </section>
  );
}
