# High-Level Design (HLD)

This document outlines the high-level architecture and data flow of the CoYatra application.

## 1. Client Layer

**React Frontend (Vite, TypeScript)**
*   Provides the interactive user interface.
*   Handles client-side routing and state management.
*   Communicates securely with the backend via REST API over HTTPS.

## 2. Authentication Flow

**Clerk Authentication System**
*   The frontend uses Clerk components to authenticate the user and retrieve session tokens.
*   The backend validates these tokens using Clerk Express Middlewares to secure all API endpoints.
*   Clerk sends webhooks (e.g., `user.created`) to the backend to keep the local MongoDB user records synchronized with the Clerk authentication state.

## 3. Application API Layer

**Express Backend (Node.js, TypeScript)**
*   Serves as the central orchestration layer.
*   Receives requests from the frontend, validates payloads using Zod, and executes business logic.
*   Performs all database operations (CRUD) against the MongoDB database.
*   Interacts with the AWS SDK to generate presigned URLs for media handling.

## 4. Data Storage Layer

**MongoDB Atlas**
*   Stores all application state, including Users, Trips, Trip Members, Activities, Checklists, and Expenses.
*   Interacted with via the Mongoose ODM.

## 5. Media Storage Layer

**AWS S3 Bucket**
*   Stores all binary media (images, PDFs, documents) uploaded by users.
*   The backend generates secure presigned URLs for uploading and downloading.
*   The frontend uses these URLs to directly upload to or download from S3, bypassing the Node.js server to improve performance and reduce bandwidth costs.
