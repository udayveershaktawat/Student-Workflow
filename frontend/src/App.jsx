import React from 'react';
import keycloak from './keycloak';
import AssistantView from './components/AssistantView';
import AdminView from './components/AdminView';

const styles = {
  page: { fontFamily: 'system-ui, sans-serif', maxWidth: 820, margin: '0 auto', padding: 24, color: '#1a1a1a' },
  header: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #e2e2e2', paddingBottom: 12, marginBottom: 24 },
  badge: { background: '#eef', borderRadius: 6, padding: '2px 8px', fontSize: 12, marginLeft: 6 },
  btn: { background: '#1a1a1a', color: '#fff', border: 'none', borderRadius: 6, padding: '6px 12px', cursor: 'pointer' },
};



export default function App() {
  const username = keycloak.tokenParsed?.preferred_username;
  const isAssistant = keycloak.hasRealmRole('assistant');
  const isAdmin = keycloak.hasRealmRole('admin');

  return (
    <div style={styles.page}>
      <div style={styles.header}>
        <div>
          <strong>Student Workflow</strong>
          {isAssistant && <span style={styles.badge}>assistant</span>}
          {isAdmin && <span style={styles.badge}>admin</span>}
        </div>
        <div>
          <span style={{ marginRight: 12 }}>{username}</span>
          <button style={styles.btn} onClick={() => keycloak.logout()}>Logout</button>
        </div>
      </div>

      {isAssistant && <AssistantView />}
      {isAdmin && <AdminView />}
      {!isAssistant && !isAdmin && (
        <p>Your account has no <code>assistant</code> or <code>admin</code> role assigned.</p>
      )}
    </div>
  );
}
