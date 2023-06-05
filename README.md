# Project Description:

The project is an authentication API that provides endpoints for user registration, email verification, password management, and user authentication. It allows users to register, verify their email addresses, log in, reset forgotten passwords, and access protected routes.

The API supports various HTTP methods, including POST and GET, and utilizes the JSON format for request bodies. The endpoints are organized under the `/api/v0/auth` route.

To register a new user, a POST request is made to the `/api/v0/auth/register` endpoint with the user's username, email, and password provided in the JSON request body.

After registration, users need to verify their email addresses. A GET request is sent to `/api/v0/auth/register/verify-email/<YOUR_TOKEN_HERE>` endpoint, where `<YOUR_TOKEN_HERE>` is the verification token received via email.

If a user needs to request email verification again, a POST request is made to `/api/v0/auth/register/verify-again` endpoint, providing the user's email in the JSON request body.

For password-related functionalities, users can initiate the forgot password process by sending a POST request to `/api/v0/auth/forgot-password/send-email`, providing their email address in the JSON request body.

To reset the password, a POST request is made to `/api/v0/auth/forgot-password/reset-password/<YOUR_TOKEN_HERE>` endpoint, with `<YOUR_TOKEN_HERE>` replaced by the JWT token received via email. The new password is included in the JSON request body.

To authenticate, users can log in by sending a POST request to `/api/v0/auth/login` endpoint, providing their username/email and password in the JSON request body.

To refresh the access token, a POST request is sent to `/api/v0/auth/login/refresh-token` with the valid refresh token provided in the JSON request body.

Accessing protected routes requires sending a GET request to `/api/v0/auth/protected` endpoint with the access token included in the Authorization header as a bearer token.

Overall, this project provides essential authentication functionalities through a RESTful API, enabling user registration, email verification, password management, and user authentication.

# Installation

Clone the repository:

```bash
git clone <repository-url>
```

Navigate to the project directory:

```bash
cd nodejs-auth-system
```

Install the dependencies:

```bash
npm install
```

Set up environment variables:

- Create a new file named .env in the project root directory.

- Open the .env file and add the following variables:

```plaintext
PORT=3000
DB_URI=<YOUR_MONGODB_URI_HERE>
JWT_EMAIL_SECRET=<YOUR_JWT_EMAIL_SECRET_HERE>
JWT_ACCESS_SECRET=<YOUR_JWT_ACCESS_SECRET_HERE>
JWT_REFRESH_TOKEN=<YOUR_JWT_REFRESH_TOKEN_HERE>
EMAIL_USER=<YOUR_EMAIL_HERE>
EMAIL_PASSWORD=<YOUR_EMAIL_PASSWORD_HERE>
NODE_ENV=development
```

Replace `<YOUR_MONGODB_URI_HERE>` with your MongoDB connection string.
You can use https://www.mongodb.com/atlas to setup a cloud database in minutes.

# Usage

To run the authentication API, follow these steps:
Start the server:

```bash
npm run dev
```

The API will be available at http://localhost:3000.

## Endpoints

The following API endpoints are available:

- Register: `POST` `/api/v0/auth/register`
- Verify Email: `GET` `/api/v0/auth/register/verify-email/<YOUR_TOKEN_HERE>`
- Verify Email Again: `POST` `/api/v0/auth/register/verify-again`
- Forgot Password: `POST` `/api/v0/auth/forgot-password/send-email`
- Reset Password: `POST` `/api/v0/auth/forgot-password/reset-password/<YOUR_TOKEN_HERE>`
- Login: `POST` `/api/v0/auth/login`
- Refresh Access Token: `POST` `/api/v0/auth/login/refresh-token`
- Protected Route: `GET` `/api/v0/auth/protected`

Refer to the API documentation below for detailed information on each endpoint and their usage.

## Register

This endpoint is used to register a new user.

- HTTP method: `POST`
- Endpoint: `/api/v0/auth/register`
- Content-Type: `application/json`

Request Body:

```json
{
  "username": "<YOUR_USERNAME_HERE>",
  "email": "<YOUR_EMAIL_HERE>",
  "password": "<YOUR_PASSWORD_HERE>"
}
```

## Verify email

This endpoint is used to verify the user's email address after registration.

- HTTP method: `GET`
- Endpoint: `/api/v0/auth/register/verify-email/<YOUR_TOKEN_HERE>`
- Content-Type: `application/json`
  Replace `<YOUR_TOKEN_HERE>` with the verification token received via email.

## Verify Again

This endpoint is used to request email verification again for a registered user.

- HTTP method: `POST`
- Endpoint: `/api/v0/auth/register/verify-again`
- Content-Type: `application/json`

Request Body:

```json
{
  "email": "<YOUR_EMAIL_HERE>"
}
```

## Forgot Password

This endpoint is used to initiate the password reset process.

- HTTP method: `POST`
- Endpoint: `/api/v0/auth/forgot-password/send-email`
- Content-Type: `application/json`

Request Body:

```json
{
  "email": "<YOUR_EMAIL_HERE>"
}
```

## Reset Password

This endpoint is used to reset the user's password after the forgot password process.

- HTTP method: `POST`
- Endpoint: `/api/v0/auth/forgot-password/reset-password/<YOUR_TOKEN_HERE>`
- Content-Type: `application/json`
  Replace `<YOUR_TOKEN_HERE>` with the password reset token received via email.

Request Body:

```json
{
  "newPassword": "<YOUR_NEW_PASSWORD_HERE>"
}
```

## Login

This endpoint is used to authenticate a user and obtain an access token.

- HTTP method: `POST`
- Endpoint: `/api/v0/auth/login`
- Content-Type: `application/json`

Request Body:

```json
{
  "username": "<YOUR_EMAIL_HERE>",
  "password": "<YOUR_PASSWORD_HERE>"
}
```

## Refresh Access Token

This endpoint is used to refresh the access token using a refresh token.

- HTTP method: `POST`
- Endpoint: `/api/v0/auth/login/refresh-token`
- Content-Type: `application/json`

Request Body:

```json
{
  "refreshToken": "<YOUR_REFRESH_TOKEN_HERE>"
}
```

Replace `<YOUR_REFRESH_TOKEN_HERE>` with the valid refresh token.

## Protected Route

This endpoint is a protected route that requires an access token to access.

- HTTP method: `GET`
- Endpoint: `/api/v0/auth/protected`
- Content-Type: `application/json`
- Authorization: `Bearer <YOUR_ACCESS_TOKEN_HERE>`

Replace `<YOUR_ACCESS_TOKEN_HERE>` with a valid access token obtained during the login process.
