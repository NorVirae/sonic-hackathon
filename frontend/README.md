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

### 4. Install Dependencies

```sh
yarn install
```

### 5. Start the Development Server

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

## Conclusion

You now have a React project set up with Vite using Yarn. You can start building your application efficiently with fast HMR (Hot Module Replacement) and optimized performance.

