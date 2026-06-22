# Student Approval Workflow

A small full-stack app matching the assignment:

> An **Assistant** creates a new student → record is in status **CREATE**.
> An **Admin** approves it → status becomes **ACTIVE**.

**Two frameworks, as required:**
- **Keycloak** → login / authentication + roles (`assistant`, `admin`)
- **Camunda 7** (embedded in Spring Boot) → the approval *process*

**Stack:** React (frontend) · Java / Spring Boot on Tomcat (backend) · PostgreSQL (relational DB).

---

## How it works

```
Assistant ──create──▶ Spring Boot ──save (CREATE)──▶ PostgreSQL
                          │
                          └─ start Camunda process "student-approval"
                                     │
                                     ▼
                          [User Task: Admin approval]   ◀── waits here
                                     │
                  Admin clicks Approve → complete task
                                     │
                          [Service Task: activateStudentDelegate]
                                     │
                          set status = ACTIVE  ──▶ PostgreSQL
```

BPMN: `backend/src/main/resources/processes/student-approval.bpmn`
(Start → *Admin approval* user task → *Set status ACTIVE* service task → End.)

Every API call carries a Keycloak JWT. Spring validates it and maps Keycloak
realm roles to Spring authorities, so `POST /api/students` requires role
`assistant` and approval requires role `admin`.

---

## Prerequisites
- Docker + Docker Compose
- Java 17, Maven
- Node.js 18+

## 1. Start infrastructure (Postgres + Keycloak)
```bash
docker compose up -d
```
- Keycloak: http://localhost:8081  (admin console: `admin` / `admin`)
- Realm `student-realm` is auto-imported with two users:
  - `assistant1` / `assistant1` (role: assistant)
  - `admin1` / `admin1` (role: admin)

## 2. Run the backend
```bash
cd backend
mvn spring-boot:run
```
- API: http://localhost:8080/api
- Camunda Cockpit: http://localhost:8080/camunda  (`admin` / `admin`)

## 3. Run the frontend
```bash
cd frontend
npm install
npm run dev
```
- App: http://localhost:5173

## 4. Try the flow
1. Open the app, log in as **assistant1** → fill the form → **Create student**
   (status shows CREATE).
2. Log out, log in as **admin1** → **Pending approvals** → **Approve**.
3. The student flips to **ACTIVE**. Watch the instance complete in Camunda Cockpit.

---

## Notes / design choices
- **Camunda 7 embedded** (not Camunda 8/Zeebe) — runs inside the Spring Boot
  process, nothing extra to deploy. Fastest path for this assignment.
- Backend & frontend run locally (only Postgres + Keycloak are containerised) so
  the JWT `issuer-uri` (`localhost:8081`) matches what the browser receives —
  avoids the usual Docker-network issuer mismatch.
- DB is relational (Postgres), as the instructor asked. Swap to MySQL by changing
  the driver + URL in `application.yml` and the `mysql-connector-j` dependency.
- `ddl-auto: update` auto-creates the `students` table; Camunda auto-creates its
  own `ACT_*` tables in the same database.

## Likely "modification" follow-ups (instructor hinted at these)
- Add an edit/reject path (a gateway in the BPMN sending it back to the assistant).
- Add a second approval step (extend the process — the point of using Camunda).
- Add fields/validation to the student form.
