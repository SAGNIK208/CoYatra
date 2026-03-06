User Flow


# User Flow: Collaborative Trip Planning Product (MVP v3 - Invite Link Only)

==================================================================
A. FIRST-TIME USER FLOW (Owner Creating a Trip)
==================================================================

1. User lands on app.
2. User signs up or logs in.
3. User lands on Dashboard.
   - If no trips → Empty state with "Create Trip"
   - If trips exist → List of Owned + Shared trips

4. User clicks "Create Trip".
5. User enters:
   - Trip Title
   - Start Date
   - End Date
   - Travelers (optional)
6. User clicks "Create".
7. Trip created.
8. User automatically assigned role: Owner.
9. Redirect to Trip Overview Page.


==================================================================
B. INVITE FLOW (OWNER PERSPECTIVE - LINK ONLY)
==================================================================

1. Owner opens Trip.
2. Owner clicks "Members" or "Invite".

Invite Modal shows:

[ Copy Invite Link ]  (Primary CTA)

Settings:
- Role for link:
    • Editor
    • Viewer
- Optional expiry date (null = no expiry)

3. System generates a secure invite URL containing:
   - trip_id
   - role
   - invite_token (stored as TripInvite with status: PENDING)

4. Owner copies and shares link externally (WhatsApp, iMessage, etc.).
   Note: Email-based invites are OUT OF SCOPE for MVP.

5. Members screen displays:
   - Current members and their roles
   - Active invite link status (PENDING / ACCEPTED / DISABLED)
   - Option to regenerate link  →  old token marked DISABLED, new one created
   - Option to disable link     →  current token marked DISABLED


==================================================================
C. INVITED USER FLOW (Via Link)
==================================================================

1. User clicks invite link.

--------------------------------------------------

IF user is NOT logged in:

2. Redirect to Sign Up / Log In page.
3. After authentication:
   - Validate invite token.
   - Create TripMember record.
   - Assign default role.
4. Redirect to Trip Overview Page.

--------------------------------------------------

IF user IS logged in:

2. Validate invite token.
3. Create TripMember record.
4. Redirect to Trip Overview Page.

--------------------------------------------------

IF invite link is DISABLED or token not found:

2. Show error screen:
   - "This invite link has been disabled by the trip owner."
   - Option to request a new link from the owner.

--------------------------------------------------

IF invite link is EXPIRED (expiresAt < now):

2. Show error screen:
   - "This invite link has expired."
   - Option to request a new link from the owner.


==================================================================
D. GLOBAL INVITATION DETECTION (Dashboard Level)
==================================================================

If a logged-out user clicks an invite link and signs up:

After signup:
- System automatically attaches trip to their account.
- On first login, dashboard shows:
   "You joined: [Trip Name]"

No separate pending invitation screen in MVP.


==================================================================
E. OWNER TRIP MANAGEMENT FLOW
==================================================================

Inside Trip → Members Section:

Owner can:
- View all members
- View roles
- Change member role (Editor ↔ Viewer)
- Remove member
- Regenerate invite link
- Disable invite link
- Delete trip

Owner cannot remove themselves.


==================================================================
F. EDITOR FLOW
==================================================================

Editor can:
- Add/edit/reorder itinerary days.
- Add/Update activity cards.
- Add checklist items and assign them.
- Mark assigned or unassigned checklist items as Done.
- Add budget entries (expenses).
- **Update individual payment status** for themselves in any expense.
- View detailed contributions for any member.
- Upload files and link them to tasks/activities.
- Comment on activities or days.

Editor cannot:
- Delete the trip.
- Change member roles.
- Remove members.

==================================================================
G. VIEWER FLOW
==================================================================

Viewer can:
- View itinerary, checklist, and budget summary.
- **Toggle Status (Done/Undone)** for checklist items they are assigned to (or unassigned items).
- **Update individual payment status** for **themselves** only.
- View detailed contributions for any member.
- Upload files.
- Comment on activities or days.

Viewer cannot:
- Add or delete itinerary activities.
- Create new expenses or checklist items.
- Modify the structure of existing expenses.
- Change roles or remove members.
- Delete the trip.

==================================================================
H. MEMBER CONTRIBUTIONS VIEW
==================================================================

1. Any member (Owner/Editor/Viewer) can click on a member's avatar in the workspace.
2. A "Contributions Modal" opens showing:
   - **Tasks**: List of all items assigned to that member.
   - **Expenses**: List of their specific financial shares and payment statuses.
3. This view provides a transparent snapshot of who is doing/paying what.


==================================================================
H. RETURNING USER FLOW
==================================================================

1. User logs in.
2. Dashboard displays:
   - Owned Trips
   - Shared Trips
3. User selects trip.
4. Lands on last visited tab (Itinerary / Budget / Checklist).

