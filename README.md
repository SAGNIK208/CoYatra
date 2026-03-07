# 🏔️ CoYatra

**CoYatra** (meaning *Co-Travel*) is a modern, collaborative trip planning and expense management application. It helps groups manage their itineraries, checklists, and shared finances with ease and transparency.

---

## 🚀 Getting Started

To get the application up and running on your local machine, please follow our setup guide:

👉 **[Local Setup Guide](file:///docs/LOCAL_SETUP.md)**

---

## 📖 Documentation

All project documentation is located in the `docs/` folder. Below are the key references:

### 🛠️ Developer Resources
- **[API Collection](file:///docs/API_COLLECTION.json)**: Import this JSON into Postman to test all v1 endpoints.
- **[Database Schemas](file:///docs/SCHEMAS.md)**: Detailed breakdown of Mongoose models and data relationships.
- **[High-Level Design](file:///docs/HLD.md)**: Architectural overview and data flow.
- **[Permissions Manual](file:///docs/PERMISSIONS.md)**: Explanation of the Role-Based Access Control (RBAC) system.
- **[Seeding Guide](file:///docs/SEEDING_GUIDE.md)**: How to quickly populate a trip with demo data for testing.

### 🍱 Product Resources
- **[User Flow](file:///docs/USER_FLOW.md)**: Comprehensive map of the intended user journey and feature capabilities.

---

## 🏗️ Technology Stack

**Frontend (Client)**
- **Framework**: React.js with Vite
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Icons & UI**: Lucide React

**Backend (API)**
- **Runtime**: Node.js
- **Framework**: Express.js
- **Language**: TypeScript
- **Validation**: Zod (for request payload validation)

**Infrastructure & Services**
- **Database**: MongoDB (via Mongoose ODM)
- **Authentication**: Clerk (with Clerk Express Middlewares backing)
- **Object Storage**: AWS S3 (for media files & presigned URLs)
- **Local Dev Mocking**: LocalStack (for local S3 offline development)

## 🔐 License

This project is licensed under the ISC License.
