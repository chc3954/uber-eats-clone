# Uber Eats Clone Server

This is the server-side codebase for the Uber Eats Clone application. It is built using NestJS, TypeORM, and GraphQL.

## Project Structure

- **src**: Contains the main source code for the application.
  - **auth**: Authentication and authorization related code.
  - **common**: Common utilities and constants.
  - **jwt**: JWT authentication module.
  - **mail**: Mail sending module.
  - **orders**: Order management module.
  - **payments**: Payment processing module.
  - **restaurants**: Restaurant management module.
  - **users**: User management module.
- **test**: Contains test files.

## Setup

### Prerequisites

- Node.js
- PostgreSQL

### Installation

1. Clone the repository:

   ```bash
   git clone https://github.com/chc3954/uber-eats-clone.git
   cd uber-eats-clone/server
   ```

2. Install dependencies:

   ```bash
   npm install
   ```

3. Set up environment variables:
   Create a `.env.dev` file in the root directory and add the following variables:

   ```env
   NODE_ENV=dev
   DB_HOST=your_db_host
   DB_PORT=your_db_port
   DB_USER=your_db_user
   DB_PASS=your_db_password
   DB_NAME=your_db_name
   SECRET_KEY=your_secret_key
   MAILGUN_API_KEY=your_mailgun_api_key
   MAILGUN_DOMAIN=your_mailgun_domain
   MAILGUN_FROM_EMAIL=your_mailgun_from_email
   ```

4. Run the application:
   ```bash
   npm run start:dev
   ```

## GraphQL Playground

You can access the GraphQL Playground at `http://localhost:3000/graphql` to interact with the API.
