# Merchant Frontend
This is the frontend application for the Cypher Pay merchant platform. Here the merchants can manage their Accounts, manage their ApiKeys and view their Invoices.

Currently, this application also has the Documentation for the Cypher Pay API integrated within it.

## Setup 
### Prerequisites
- Node.js installed. Follow instructions [here](https://nodejs.org/en/download/)
- Bun installed. Follow instructions [here](https://bun.sh/)

### Steps to run the React App locally
1. Clone the repository: 
    ```bash
    git clone https://github.com/cypher-pay/merchant-fe.git

    cd merchant-fe
    ```
2. Install dependencies:
    ```bash
    bun install
    ```
3. Setting up environment variables:
  - Copy the `.env.example` file to `.env`:
    ```bash
    cp .env.example .env
    ```
  - Check the "Environment Variables" section below for required variables.

4. Start the development server:
    ```bash
    bun run dev
    ```

### Environment Variables
- `VITE_BACKEND_URL`: The base URL for the backend API (cypher-pay-backend-url). (Mandatory)
- `VITE_AUTH_TOKEN_KEY`: Key to store the auth token in localStorage. (Mandatory)
- `VITE_APP_TITLE`: The title of the application. (Optional)