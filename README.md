# IslandPower Configurator

IslandPower Configurator is an interactive tool for configuring and optimizing off-grid systems. It allows users to easily select and set up components like appliances, batteries, solar panels, controllers, and inverters to meet their energy needs.

---

## Available Scripts

In the project directory, you can run:

### `npm start`

Runs the app in development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in your browser.

### `npm run build`

Builds the app for production to the build folder. It optimizes the build for the best performance.

---

## Environment Configuration

In `config.js`, set the API endpoint:

```javascript
// For local development:
const BASE_URL = 'http://localhost:8082'; // Local server

// For production:
const BASE_URL = 'https://api.fve.firmisimo.eu:443'; // Public server
```

## User Manual

Access the user manual for detailed guidance on using the IslandPower Configurator:

[User Manual (Czech)](https://fve.firmisimo.eu/user-manual-cs.pdf)
