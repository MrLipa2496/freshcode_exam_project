# Fullstack Project Tasks Documentation

## How to Run the Docker

> To start the development environment:

```bash
./start-dev.sh
```

This will:

- Build the frontend and backend images (and DB)
- Launch all services in development mode
- Mount source code for hot reloading

## How to Run the Project

### Backend (Server)

1. Navigate to the `server` directory:

   ```bash
   cd server
   ```

2. Install the dependencies:

   ```bash
   npm install
   ```

3. Make sure to create a `.env` file in the root directory with the following environment variables:

   ```env
   PORT="<your_server_port>"
   HOST="localhost"

   NODE_ENV="development"

   DB_HOST="localhost"
   DB_PORT=5432
   DB_USER="postgres"
   DB_PASSWORD="<your_db_password>"
   DB_NAME="<your_db_name>"

   MAILING_EMAIL="<your_email>"
   MAILING_PASS="<your_email_pass>"
   ```

4. Start the server in development mode:
   ```bash
   npm start
   ```

---

> Server uses nodemon for auto-restarting on file changes.

### Frontend (Client)

1. Navigate to the `client` directory:

   ```bash
   cd client
   ```

2. Install the dependencies:

   ```bash
   npm install
   ```

3. Start the client in development mode:
   ```bash
   npm start
   ```

# Useful Scripts

## Server (backend)

> The server runs using **nodemon**, and the tests run using **Jest**.

### Main commands:

- `npm start` — start the server with `nodemon`
- `npm test` — run unit tests (Jest)

---

## Client (frontend)

> The client part has integration with **Storybook** for viewing UI components.

### Main commands:

- `npm run start` — start the dev server for the frontend
- `npm run build` — build the production version of the frontend
- `npm run preview` — local preview of the built frontend

### Storybook:

- `npm run storybook` — start Storybook to preview UI components
- `npm run build-storybook` — build Storybook static files

---

## BUG FIXES

- Bugs fixed across the app
- All libraries updated
- Docker images updated
- Class components converted to functional
- Removed unused imports and cleaned up code
- Ensured unified code style in queries, controllers, and components

---

## LAYOUT

- Created "How it Works" page
- Page is responsive (CSS Grid/Flexbox)
- Link added in user menu: `http://localhost:3000/how-it-works`

---

## DYNAMIC BRANDING

- Created "Events" page:
  - Add event name, time, notification threshold
  - Multiple timers supported
  - Events sorted chronologically
  - Active event notifications (red badge)
  - Data stored in localStorage
- Created "Button Group" page
- Link added in user menu:
  - `http://localhost:3000/events`

---

## DB NO-SQL

- Added `db-no-sql/` directory in `server/`
- Added MongoDB query to count messages containing `"паровоз"`
  - File: `query.mongodb.js`
  - Uses aggregation pipeline

---

## DB SQL

- Added `db-sql/` directory in `server/`

1. Count users by roles

   - File: `countOfUsers.sql`
   - Example output: `{ admin: 40, customer: 22, ... }`

2. Cashback logic for `customer` users

   - File: `customerCashback.sql`
   - 10% cashback for orders from Dec 25 to Jan 14

3. Payout to top creatives

   - File: `payoutWithMaxRating.sql`
   - Pay $10 to top 3 creatives by rating

4. Chat migration from NoSQL to PostgreSQL:
   - Sequelize models and migrations created
   - Relationships preserved (including user links)
   - Screenshot of DB structure: `Screenshot_UML.png`

---

## NODEJS

- Added error logger:

  - Location: `server/utils/errorLogFunction.js`
  - Format:
    ```json
    {
      "message": "Some error occurred",
      "time": 1587410256097,
      "code": 404,
      "stackTrace": {}
    }
    ```

- Scheduled daily log archiver:
  - Location: `server/utils/logBackup.js`
  - Copies logs to timestamped file
  - Clears original log file after archiving

---

## FULLSTACK

### Moderator Role Implementation and Access

- Added new user role: `Moderator`.
- To create the moderator user, **run the seeder**:
  ```bash
  npx sequelize-cli db:seed --seed 20250223140630-create-moderator.js
  ```
- This seeder inserts a moderator user into the `Users` table with the following credentials:

  | Field    | Value               |
  | -------- | ------------------- |
  | Email    | moderator@gmail.com |
  | Password | moderator           |

- **Moderator capabilities:**
  - Can view all offers.
  - Can approve/reject offers.
  - Cannot see Creative info.
- **Customer perspective:**
  - Customers see only approved offers.
- **Creative perspective:**
  - Creatives see only their own offers with statuses.
- **Notification System:**
  - Moderation decisions are emailed to the Creative.
- **Implemented Features:**
  - Moderation page with pagination.
  - Action buttons (Approve / Reject).
  - UI design consistent with the rest of the application styling.

---
