# React + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Babel](https://babeljs.io/) (or [oxc](https://oxc.rs) when used in [rolldown-vite](https://vite.dev/guide/rolldown)) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the ESLint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and [`typescript-eslint`](https://typescript-eslint.io) in your project.

## Firebase Google Auth Setup

- Create a Firebase project and add a Web app.
- Enable Authentication → Sign-in method → Google.
- In Project Settings → General → Your apps → Web, copy the config and paste values into [fitness-tracker-app/.env.local](fitness-tracker-app/.env.local):
	- `apiKey` → `VITE_FIREBASE_API_KEY`
	- `authDomain` → `VITE_FIREBASE_AUTH_DOMAIN`
	- `projectId` → `VITE_FIREBASE_PROJECT_ID`
	- `appId` → `VITE_FIREBASE_APP_ID`
	- `storageBucket` → `VITE_FIREBASE_STORAGE_BUCKET`
	- `messagingSenderId` → `VITE_FIREBASE_MESSAGING_SENDER_ID`
- In Authentication → Settings → Authorized domains, ensure `localhost` is present.
- Restart the dev server.

On the Auth page, if the Google button is disabled, it will list any missing keys to help you complete configuration.
