# Local Development Setup Guide

Follow this guide to get CoYatra running on your local machine in minutes. Use our professional "One-Click" setup script to handle all infrastructure and dependencies.

## Prerequisites

1.  **Docker**: [Download and Install](https://www.docker.com/get-docker)
    - Once installed, make sure Docker is **running**.
2.  **Clerk Account**: [Sign up for free](https://clerk.com/)
    - Create a new project named "CoYatra".
    - Go to **API Keys** in the Clerk Dashboard and copy your **Publishable Key** and **Secret Key**.

---

## Professional Management Utility

We provide a comprehensive script to manage your local architecture.

1.  **Open your terminal** in the project root directory.
2.  **Run the setup script**:
    ```bash
    chmod +x scripts/local_setup.sh
    
    # Start all services
    ./scripts/local_setup.sh up
    
    # Stop services
    ./scripts/local_setup.sh stop
    
    # Wipe data and reset
    ./scripts/local_setup.sh clean-data
    ```
3.  **Enter your Clerk Keys** (only needed on first run or if `.env` is missing).

---

## Accessing the Application

Once the script finishes, you can access the application at the ports you chose (default 80 and 3000):

- **Frontend**: `http://localhost:<FRONTEND_PORT>`
- **Backend API (Proxy)**: `http://localhost:<FRONTEND_PORT>/api`
- **Backend API (Direct)**: `http://localhost:<BACKEND_PORT>`
- **Database**: `mongodb://localhost:27017/coyatra`

---

## Troubleshooting

### Docker Errors
- **"Docker daemon is not running"**: Open Docker and wait for it to show the "running" status.
- **Port Conflicts**: Ensure no other application is using ports `80`, `3000`, `4566`, or `27017`.

### LocalStack/S3 Issues
The setup script automatically creates a bucket named `coyatra-local` inside LocalStack. If images aren't uploading:
1. Ensure `localstack` container is running (`docker ps`).
2. Check logs: `docker logs coyatra-localstack`.

---

## Manual Environment Configuration

If you prefer not to use the script, you can manually copy `.env.example` to `.env` and fill in the values:

```env
CLERK_PUBLISHABLE_KEY=pk_test_...
CLERK_SECRET_KEY=sk_test_...

# Standard Local Defaults
DATA_PATH=./data
MONGO_URI=mongodb://mongodb:27017/coyatra
AWS_ENDPOINT=http://localstack:4566
```

Then run:
```bash
docker-compose up -d --build
```
