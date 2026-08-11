# AWS Docker Compose Users CRUD API

A REST API built with Node.js, Express and PostgreSQL.
The application is containerized using Docker and deployed using Docker Compose.

## Architecture

Internet
    |
    v
Nginx
    |
    v
Node.js + Express API
    |
    v
PostgreSQL

## Technologies

- Node.js
- Express.js
- PostgreSQL
- Docker
- Docker Compose
- Nginx
- AWS EC2

## API Endpoints

### Health

GET /health

### Create User

POST /users

Request:

{
  "name": "John",
  "email": "john@example.com"
}

### Get All Users

GET /users

### Get User

GET /users/:id

### Update User

PUT /users/:id

Request:

{
  "name": "John Updated",
  "email": "john.updated@example.com"
}

### Delete User

DELETE /users/:id

## Run Locally

Create .env:

POSTGRES_DB=usersdb
POSTGRES_USER=usersadmin
POSTGRES_PASSWORD=YourStrongPassword

Run:

docker compose build

docker compose up -d

Check:

docker compose ps

Application:

http://localhost

Health:

http://localhost/health

## Stop

docker compose down

## Stop and Remove Database Volume

docker compose down -v