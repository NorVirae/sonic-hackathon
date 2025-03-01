# Vite + React with Yarn

This guide provides instructions on how to set up and run a React project using Vite and Yarn.

## Prerequisites

Ensure you have the following installed:

- [Node.js](https://nodejs.org/) (Latest LTS version recommended)
- [Yarn](https://yarnpkg.com/) (If not installed, see the installation step below)

## Installation

### 1. Install Yarn (if not already installed)

To check if Yarn is installed, run:

```sh
yarn --version
```

If Yarn is not installed, install it globally using npm:

```sh
npm install -g yarn
```

### 2. Create a New Vite Project

Run the following command to create a new React project using Vite:

```sh
yarn create vite my-app --template react
```

Replace `my-app` with your preferred project name.

### 3. Navigate to the Project Directory

```sh
cd frontend
```

### 4. Create .env file and update with ENV VARS on /env.example

```sh
VITE_API_URL=<BACKEND-AGENT-API-URL>
```

### 5. Install Dependencies

```sh
yarn install
```

### 6. Start the Development Server

```sh
yarn dev
```

This will start the Vite development server. Open your browser and go to `http://localhost:5173/` to see your React app running.

## Additional Commands

### Build for Production

```sh
yarn build
```

This command generates an optimized production build in the `dist` folder.

### Preview Production Build

```sh
yarn preview
```

Serves the production build locally for testing.

### Linting (Optional)

If you want to lint your code, install ESLint:

```sh
yarn add eslint --dev
```

Then, run:

```sh
yarn lint
```

### Page Routes
/atm 
/create-qr

### To Create QR code 

visit the ```/frontend/src/pages/CreateQRCode.jsx```
under the QRCode Component

```<QRCode
        size={256}
        style={{ height: "100%", maxWidth: "100%", width: "100%" }}
        value={"/atm"} <== (The value contains the link to where the AI Agent is located)
        viewBox={`0 0 1256 1256`}
    />
```

now visit the link: http://<your-ip>:port/create-qr to get qr code



## Conclusion

You now have a React project set up with Vite using Yarn. You can start building your application efficiently with fast HMR (Hot Module Replacement) and optimized performance.

