#!/bin/bash

# CoYatra - Professional Infrastructure Management Utility
# Version: 1.1.0

set -e

# Colors for professional output
RED='\033[0;31m'
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
NC='\033[0m'

COMMAND=$1
BUCKET_NAME="coyatra-local"
DATA_DIR="./data"

show_usage() {
    echo -e "${BLUE}CoYatra Local Setup Utility${NC}"
    echo -e "Usage: $0 {up|stop|down|clean|clean-data|setup-s3}"
    echo -e ""
    echo -e "  ${GREEN}up${NC}         Start all services (checks Docker, sets env, inits S3)"
    echo -e "  ${YELLOW}stop${NC}       Stop running containers"
    echo -e "  ${YELLOW}down${NC}       Stop and remove containers"
    echo -e "  ${RED}clean${NC}      Remove containers and images"
    echo -e "  ${RED}clean-data${NC} Remove containers and WIPE persistent data volumes"
    echo -e "  ${BLUE}setup-s3${NC}   Manual trigger to initialize S3 bucket & CORS"
}

check_docker() {
    if ! command -v docker &> /dev/null; then
        echo -e "${RED}ERROR: Docker is not installed.${NC}"
        exit 1
    fi
    if ! docker info &> /dev/null; then
        echo -e "${RED}ERROR: Docker is NOT running.${NC}"
        exit 1
    fi
}

case $COMMAND in
    "up")
        check_docker
        # Environment Setup
        if [ ! -f .env ]; then
            echo -e "${YELLOW}No .env file found. Creating from template...${NC}"
            cp .env.example .env
            echo -e "${BLUE}Please enter your Clerk credentials (dashboard.clerk.com):${NC}"
            read -p "Clerk Publishable Key: " pk
            read -sp "Clerk Secret Key: " sk
            echo ""
            read -p "Frontend Port [default: 80]: " fe_port
            fe_port=${fe_port:-80}
            read -p "Backend Port [default: 3000]: " be_port
            be_port=${be_port:-3000}

            # Determine CORS origins with variations for default ports
            fe_origins="http://localhost:$fe_port"
            if [ "$fe_port" = "80" ]; then fe_origins="http://localhost:80,http://localhost"; fi
            
            be_origins="http://localhost:$be_port"
            if [ "$be_port" = "3000" ]; then be_origins="http://localhost:3000"; fi

            # Mac-compatible sed
            sed -i '' "s|CLERK_PUBLISHABLE_KEY=.*|CLERK_PUBLISHABLE_KEY=$pk|" .env
            sed -i '' "s|CLERK_SECRET_KEY=.*|CLERK_SECRET_KEY=$sk|" .env
            sed -i '' "s|FRONTEND_PORT=.*|FRONTEND_PORT=$fe_port|" .env
            sed -i '' "s|BACKEND_PORT=.*|BACKEND_PORT=$be_port|" .env
            sed -i '' "s|CLIENT_URL=.*|CLIENT_URL=http://localhost:$fe_port|" .env
            sed -i '' "s|CORS_ORIGINS=.*|CORS_ORIGINS=$fe_origins,$be_origins|" .env
            sed -i '' "s|AWS_S3_PUBLIC_ENDPOINT=.*|AWS_S3_PUBLIC_ENDPOINT=http://localhost:4566|" .env
            echo -e "${GREEN}.env file successfully configured!${NC}"
        fi

        echo -e "${BLUE}Starting services...${NC}"
        docker-compose up -d --build
        
        echo -e "${YELLOW}Waiting for LocalStack (10s)...${NC}"
        sleep 10
        $0 setup-s3
        
        # Determine URLs for display
        source .env
        echo -e "${GREEN}SUCCESS! CoYatra is running:${NC}"
        echo -e "- Frontend: ${BLUE}http://localhost:${FRONTEND_PORT}${NC}"
        echo -e "- API Direct: ${BLUE}http://localhost:${BACKEND_PORT}${NC}"
        echo -e "- API Proxy:  ${BLUE}http://localhost:${FRONTEND_PORT}/api${NC}"
        ;;

    "stop")
        check_docker
        echo -e "${YELLOW}Stopping containers...${NC}"
        docker-compose stop
        ;;

    "down")
        check_docker
        echo -e "${YELLOW}Removing containers...${NC}"
        docker-compose down
        ;;

    "clean")
        check_docker
        echo -e "${RED}Deep cleaning containers and images...${NC}"
        docker-compose down --rmi all --volumes --remove-orphans
        ;;

    "clean-data")
        check_docker
        echo -e "${RED}WARNING: Wiping all persistent data, removing .env, and stopping services...${NC}"
        docker-compose down -v
        rm -rf "$DATA_DIR"
        rm -f .env
        echo -e "${GREEN}Data and environment configuration wiped.${NC}"
        ;;

    "setup-s3")
        check_docker
        echo -e "${BLUE}Initializing S3 bucket: $BUCKET_NAME...${NC}"
        if docker exec coyatra-localstack awslocal s3 mb "s3://$BUCKET_NAME" > /dev/null 2>&1 || true; then
            docker exec coyatra-localstack sh -c "echo '{\"CORSRules\": [{\"AllowedHeaders\": [\"*\"], \"AllowedMethods\": [\"GET\", \"PUT\", \"POST\", \"DELETE\", \"HEAD\"], \"AllowedOrigins\": [\"*\"], \"ExposeHeaders\": [\"ETag\"]}]}' > /tmp/cors-config.json"
            docker exec coyatra-localstack awslocal s3api put-bucket-cors --bucket "$BUCKET_NAME" --cors-configuration file:///tmp/cors-config.json
            echo -e "${GREEN}S3 Bucket & CORS initialised.${NC}"
        fi
        ;;

    *)
        show_usage
        exit 1
        ;;
esac
