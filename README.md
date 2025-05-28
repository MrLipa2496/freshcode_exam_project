# Fullstack Project Tasks Documentation

## Environment Variables

Make sure to create a `.env` file in the root directory with the following environment variables:

```env
PORT=3001
HOST="localhost"

NODE_ENV="development"

DB_HOST="localhost"
DB_PORT=5000
DB_USER="postgres"
DB_PASSWORD="98505"
DB_NAME="todo-dev"

MAILING_EMAIL="sasalipa216@gmail.com"
MAILING_PASS="ggac hxia krsr rgno"
```

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

- Added new user role: `Moderator`
- Moderator capabilities:
  - Can view all offers
  - Can approve/reject offers
  - Cannot see Creative info
- Customer sees only approved offers
- Creative sees only their own offers with statuses
- Moderation decision is emailed to the Creative
- Implemented:
  - Moderation page with pagination
  - Action buttons (Approve / Reject)
  - UI matches app styling
