# Stage 1: Base Stage for Dependencies
FROM node:18-alpine AS base

# Install pnpm globally
RUN npm install -g pnpm

# Set the working directory
WORKDIR /app

# Copy the monorepo configuration files
COPY pnpm-workspace.yaml package.json ./

# Copy the backend project's package.json
COPY backend/package.json ./backend/

# Install dependencies for the backend workspace
# pnpm install will use pnpm-workspace.yaml to resolve dependencies
RUN pnpm install

# Stage 2: Development Stage
FROM base AS development

# --- FIX IS HERE ---
# Copy the .env file from the root context (which is ".")
# and place it in the backend directory inside the container (/app/backend/.env)
COPY .env ./backend/.env

# Copy the rest of the backend source code
COPY backend/tsconfig.json ./backend/
COPY backend/src ./backend/src

# Set working directory to the backend folder
WORKDIR /app/backend

# The command is defined in docker-compose for dev mode (pnpm dev)

# Stage 3: Production Build Stage
FROM base AS build

# Copy the rest of the backend source code
COPY backend/tsconfig.json ./backend/
COPY backend/src ./backend/src

# Set working directory to the backend folder
WORKDIR /app/backend

# Build the TypeScript code
RUN pnpm run build

# Stage 4: Production Runtime Stage
FROM node:18-alpine AS production

WORKDIR /app/backend

# Copy only the necessary files for runtime (dist, package.json)
COPY --from=build /app/backend/dist ./dist
COPY --from=build /app/backend/package.json ./package.json
# --- Add .env to Production Stage as well for safety, pulling it from the root build context
COPY .env ./backend/.env


# Re-run install for production dependencies only
RUN npm install -g pnpm
RUN pnpm install --prod

# Entrypoint
CMD [ "pnpm", "start" ]