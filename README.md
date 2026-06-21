# Enterprise Attendance Management System

This is a complete attendance declaration and approval system built with HTML5, CSS3, vanilla JavaScript, Google Apps Script, Google Sheets, and Vercel static hosting.

The application is not a check-in/check-out system. Employees declare the shift or shift combination they worked, and admins approve or reject those declarations.

## Files

- `Login.html` - Role-based login page.
- `Admin.html` - Admin console with dashboard, employee management, attendance management, approvals, reports, configuration, and audit logs.
- `Employee.html` - Employee dashboard for attendance submission and personal history.
- `Code.gs` - Google Apps Script backend/API and Google Sheets data layer.
- `appsscript.json` - Apps Script manifest.
- `README.md` - Setup, deployment, and testing instructions.

## Project Analysis

The workspace did not contain an existing attendance project, so this deliverable was created from scratch. The implementation follows the requested stack and keeps the frontend deployable as static files on Vercel while using Apps Script as the backend and Google Sheets as the database.

Core flows implemented:

- User login from Google Sheets.
- Role-based redirect to Admin Console or Employee Dashboard.
- Inactive user blocking.
- Client and server session handling with timeout.
- Route protection on Admin and Employee pages.
- Employee attendance declaration with authorized shift filtering.
- Duplicate attendance prevention for the same employee and date.
- Pending status on submission with automatic timestamp.
- Admin approval/rejection with remarks and immediate sheet updates.
- Employee, attendance, report, configuration, and audit modules.
- CSV and Excel-compatible export from dashboards.

## Identified Issues Addressed

Because there was no existing codebase, the main implementation risks were architectural rather than bugs in existing files:

- Static Vercel pages cannot use `google.script.run`, so the frontend uses an Apps Script Web App API.
- Cross-origin Apps Script fetch behavior can be inconsistent for static sites, so the pages use JSONP-compatible GET requests to read API responses reliably.
- A static frontend cannot be trusted for role protection, so every protected Apps Script action validates the server-side session and role.
- Google Sheets rows need stable update references, so attendance records include an internal `_rowNumber` only in API responses.
- Plain text passwords are unsafe, so new and successfully migrated credentials are stored as SHA-256 hashes in the existing `Password` column.

## Recommended Improvements

- Replace the default seeded admin password immediately after setup.
- For stricter production security, place a small Vercel serverless proxy between the frontend and Apps Script so credentials and tokens are sent by POST instead of JSONP URLs.
- Add periodic cleanup for expired session rows if the sheet grows heavily.
- Add organization-specific validation rules for departments, designations, and allowed shift policies.
- Add a backup/export process for Google Sheets data.

## Google Sheets Setup

1. Create a new Google Sheet.
2. Open `Extensions > Apps Script`.
3. Add `Code.gs` and paste the contents of this project's `Code.gs`.
4. Add the manifest:
   - In Apps Script, open Project Settings.
   - Enable "Show appsscript.json manifest file in editor".
   - Open `appsscript.json` and paste the contents of this project's `appsscript.json`.
5. Run `setupDatabase` from Apps Script once.
6. Authorize the script when prompted.

The script creates these sheets automatically:

- `Users`
- `Attendance`
- `AuditLogs`
- `Configuration`
- `Sessions`

Default admin login after setup:

- User ID: `admin`
- Password: `admin123`

Change this immediately from the Admin Console using "Reset PIN".

## Sheet Structure

### Users

`UserID | Name | Password | Role | Department | Designation | AllowedShifts | Active | CreatedDate`

### Attendance

`Timestamp | AttendanceDate | EmployeeID | EmployeeName | Department | ShiftWorked | Comments | Status | AdminRemarks | ApprovedBy | ApprovedDate`

### AuditLogs

`Timestamp | UserID | UserName | Action | Details`

### Configuration

`ConfigType | ConfigName | ConfigValue`

### Sessions

`Token | UserID | Role | ExpiresAt | LastSeen | Active`

## Apps Script Deployment

1. In Apps Script, click `Deploy > New deployment`.
2. Select type `Web app`.
3. Set `Execute as` to `Me`.
4. Set `Who has access` to `Anyone`.
5. Deploy and copy the Web App URL ending in `/exec`.

The app itself performs authentication, authorization, session validation, and active-user checks.

## Frontend Configuration

Open these files and replace:

`PASTE_YOUR_GOOGLE_APPS_SCRIPT_WEB_APP_URL_HERE`

with your Apps Script Web App URL:

- `Login.html`
- `Admin.html`
- `Employee.html`

Alternative for quick testing:

Open `Login.html?apiUrl=YOUR_WEB_APP_URL`. The URL is saved in browser local storage and reused by the other pages.

## Vercel Deployment

1. Create a new Vercel project.
2. Upload or commit these static files:
   - `Login.html`
   - `Admin.html`
   - `Employee.html`
3. Set the project output as static files with no build command.
4. Use `Login.html` as the entry page.

If your hosting path needs `index.html`, duplicate `Login.html` as `index.html` or configure a redirect to `/Login.html`.

## Admin Console Features

- Dashboard summary cards:
  - Total Employees
  - Active Employees
  - Inactive Employees
  - Total Attendance Records
  - Pending Approvals
  - Approved Records
  - Rejected Records
- Analytics:
  - Daily Attendance Trend
  - Monthly Attendance Trend
  - Shift Summary
  - Department Summary
  - Status Summary
- Employee Management:
  - Create, edit, activate, deactivate, reset PIN, search, filter, export.
- Attendance Management:
  - View details, search, sort, filter, export.
- Approvals:
  - Approve, reject, add remarks.
- Reports:
  - Employee, department, shift, daily/monthly/status views through filters and exports.
- Configuration:
  - Shift names, descriptions, availability.
- Audit Logs:
  - Login, logout, employee changes, attendance submissions, approvals, rejections, and configuration changes.

## Employee Dashboard Features

- Total submissions, pending, approved, and rejected cards.
- Attendance declaration form:
  - Date
  - Authorized shift options only
  - Comments
- Recent attendance history.
- Search, shift/status/date filters.
- CSV and Excel-compatible export.

## Supported Shift Combinations

- `A`
- `B`
- `C`
- `A+B`
- `A+C`
- `B+C`
- `A+B+C`

The employee can submit a shift or combination only when that exact option is assigned to the employee and every base shift in that option is active in configuration.

## File-by-File Code Changes

- `Code.gs`
  - Added database setup, sheet creation, default configuration, default admin user, password hashing, API router, sessions, RBAC, attendance submission, duplicate prevention, approvals, employee management, configuration management, audit logging, and summary helpers.
- `appsscript.json`
  - Added V8 runtime, web app settings, and Asia/Kolkata timezone.
- `Login.html`
  - Added responsive role-based login page, session storage, timeout handling, Apps Script API client, validation messages, and redirects.
- `Admin.html`
  - Added full admin console with sidebar modules, dashboard analytics, employee management, attendance management, approvals, reports, configuration, audit logs, filters, pagination, modals, and exports.
- `Employee.html`
  - Added employee dashboard, authorized shift submission, personal attendance history, filters, pagination, exports, session handling, and logout.
- `README.md`
  - Added setup, deployment, testing, and operational instructions.

## Testing Checklist

### Backend

- Run `setupDatabase` and confirm all sheets are created.
- Confirm default admin row exists in `Users`.
- Deploy Apps Script as Web App and copy the `/exec` URL.
- Test `Login.html?apiUrl=WEB_APP_URL` with `admin/admin123`.
- Confirm login creates a row in `Sessions`.
- Confirm login writes an audit log.

### Admin

- Create an employee with role `Employee`, active status, and allowed shifts.
- Edit employee details and verify the `Users` sheet updates.
- Reset employee PIN and log in as that employee.
- Deactivate employee and confirm login is denied.
- Reactivate employee and confirm login works.
- Update shift configuration and verify available employee options change.
- Use attendance filters by ID, name, shift, status, and date range.
- Export employee, attendance, report, and audit data.

### Employee

- Log in as an active employee.
- Confirm only authorized shifts appear.
- Submit attendance for a date and verify status is `Pending`.
- Confirm timestamp is captured automatically.
- Try submitting the same date again and confirm it is blocked.
- Search and filter personal history.
- Export personal history.

### Approval

- Open Admin Console approvals.
- Add remarks and approve a pending record.
- Confirm `Status`, `AdminRemarks`, `ApprovedBy`, and `ApprovedDate` update in Google Sheets.
- Repeat with a rejection.
- Confirm audit logs are created for approval and rejection.

### Route Protection

- Open `Admin.html` while logged out and confirm redirect to login.
- Open `Employee.html` while logged out and confirm redirect to login.
- Log in as employee and try opening `Admin.html`; confirm redirect.
- Wait past the session timeout and confirm access expires.

## Deployment Checklist

- Replace all placeholder Apps Script URLs in frontend files.
- Run `setupDatabase`.
- Deploy Apps Script Web App.
- Upload static HTML files to Vercel.
- Confirm Vercel opens `Login.html`.
- Log in as admin and change the default password.
- Create real admin and employee users.
- Disable or change any temporary test accounts.
- Verify exports from Admin and Employee dashboards.
- Confirm mobile layout on a phone-size viewport.
