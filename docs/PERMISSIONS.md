# CoYatra Permissions & Role-Based Access Control (RBAC)

This document details how CoYatra enforces permissions across the frontend and backend.

## Roles
- **OWNER**: Primary creator of the trip. Has full control over details, members, and all trip resources.
- **EDITOR**: Invited collaborator. Can update resources (activities, checklists, finances) and generate invites. Cannot delete the trip or remove the Owner.
- **VIEWER**: Invited observer. Can view all trip resources and mark their own payments as paid. Restricted from modifying trip-level settings or deleting resources they don't own/assigned to.

---

## Backend Enforcement (RBAC Middleware)

The backend uses a robust `authorize` middleware that checks the user's role in a trip before allowing access to an endpoint.

### Trip Discovery Logic
The middleware automatically identifies the `tripId` by:
1. Checking `req.params.tripId`, `req.body.tripId`, or `req.params.id`.
2. If `req.params.id` is present, it looks up the resource (Activity, Expense, etc.) in the database to find its parent `tripId`.

---

## Detailed Permissions per Feature

### Trip Management
- Create Trip: `requireAuth` (Any authenticated user).
- View Trip Details: `OWNER, EDITOR, VIEWER`.
- Update Trip Details: `OWNER`.
- Delete Trip: `OWNER`.

### Member Management
- List Members: `OWNER, EDITOR, VIEWER`.
- Update Member Role: `OWNER`.
- Remove Member: `OWNER` (Owners cannot remove themselves).
- Invite Members: `OWNER, EDITOR`.

### Finances (Budget)
- View Expenses: `OWNER, EDITOR, VIEWER`.
- Create Expense: `OWNER, EDITOR, VIEWER`.
- Update Expense Structure: `OWNER, EDITOR` (Note: Currently allows `VIEWER` at route level, but controller might have nuances).
- **Update Payment Status**: **Self-Only**. Only the payee themselves can mark their share as paid.
- Delete Expense: `OWNER, EDITOR, VIEWER` (Note: Potential gap where Viewers can delete expenses).

### Checklists
- View Items: `OWNER, EDITOR, VIEWER`.
- Create Item: `OWNER, EDITOR, VIEWER`.
- **Toggle Status (Done/Undone)**: 
    - If assigned: **Assignee Only**.
    - If unassigned: **Any Trip Member**.
- **Delete Item**: 
    - If assigned: **Assignee Only**.
    - If unassigned: **Any Trip Member**.

### Media & Attachments
- View Media: `OWNER, EDITOR, VIEWER`.
- Upload Media: `OWNER, EDITOR, VIEWER`.
- Delete Media: `OWNER, EDITOR, VIEWER`.

---

## Security Audit & Gaps
> [!NOTE]
> These are identified gaps between frontend restrictions and backend enforcement.

1. **Checklist Deletion**: The backend allows any `VIEWER` to delete an unassigned checklist item. The frontend restricts this to better UI, but a direct API call would succeed.
2. **Expense Management**: `VIEWER` roles are currently allowed on `PUT /finances/:id` and `DELETE /finances/:id` at the route level. While the UI hides these buttons from viewers, the backend could be tightened.
3. **Media Management**: Viewers can delete any attachment at the backend level, even if they didn't upload it.
