import Keycloak from 'keycloak-js';

// Public client configured in the imported realm.
const keycloak = new Keycloak({
  url: 'http://localhost:8081',
  realm: 'student-realm',
  clientId: 'student-frontend',
});

export default keycloak;
