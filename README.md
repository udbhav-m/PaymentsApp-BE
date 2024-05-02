# Express Backend for Payments App

This repository contains an Express backend for a Payments application. The backend provides APIs for user authentication, user management, and account-related functionalities.

# API Documentation

## Endpoints

### User Routes (`/api/v1/user`)

- `GET /me`: Retrieve user details for the authenticated user.
- `POST /signup`: Register a new user.
- `POST /login`: Authenticate a user and generate a JWT token.
- `PUT /update`: Update user details.
- `GET /search`: Search for other users based on a filter.

### Account Routes (`/api/v1/account`)

- `GET /balance`: Retrieve account balance for the authenticated user.
- `POST /transfer`: Transfer funds between accounts.

## Project Structure

- **Routes**: Contains route handlers for user and account-related APIs.
- **DB**: Includes database connection setup and schema definitions using Mongoose.
- **Authentication**: Provides authentication utilities such as token generation and verification.
- **common**: Contains schema validations using Zod.

## Usage

### User Signup

- **Endpoint**: `POST /api/v1/user/signup`
- Register a new user by providing first name, last name, email, and password.

### User Login

- **Endpoint**: `POST /api/v1/user/login`
- Authenticate a user with email and password to receive a JWT token.

### User Profile

- **Endpoint**: `GET /api/v1/user/me`
- Retrieve details of the authenticated user.

### Update User Details

- **Endpoint**: `PUT /api/v1/user/update`
- Update user details (requires authentication).

### Search Users

- **Endpoint**: `GET /api/v1/user/search?filter=<search-term>`
- Search for other users based on a filter.

### Check Account Balance

- **Endpoint**: `GET /api/v1/account/balance`
- Retrieve the account balance for the authenticated user.

### Transfer Funds

- **Endpoint**: `POST /api/v1/account/transfer`
- Transfer funds from one account to another.

## Technologies Used

- **Express.js**: Backend framework for handling HTTP requests.
- **MongoDB**: Database management system used with Mongoose ODM.
- **JWT**: Token-based authentication for securing APIs.
- **Zod**: Schema validation library for validating request bodies.
