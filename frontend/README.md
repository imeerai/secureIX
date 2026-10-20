# Web Security Analyzer - Frontend

This is the frontend application for the Web Security Analyzer platform (project internally referenced as `nebula-deploy`). It provides a modern, high-performance, and interactive user interface to perform comprehensive web security scans, technology stack detection, and SEO audits.

## 🚀 Key Features

- **Security Scanning Interface**: Interactive UI to initiate and view detailed security vulnerability scans for target URLs.
- **Tech Stack Intelligence**: Detect and visualize the technology stack and hosting infrastructure of target websites.
- **SEO & Lighthouse Audits**: Comprehensive SEO analysis and performance auditing section.
- **Historical Trend Graphs**: Visualize scan results over time using interactive Chart.js graphs.
- **PDF Report Generation**: Export scan results, including security vulnerabilities and SEO audits, directly to PDF using jsPDF.
- **Interactive Chrome Extension Modal**: Seamless promotion and integration steps for a companion browser extension.
- **Scan History Portfolio**: Maintain and browse a history of previously scanned URLs.

## 🛠️ Technology Stack

The frontend is built using a modern React ecosystem, prioritizing speed, aesthetics, and developer experience:

- **Framework**: [React 19](https://react.dev/)
- **Build Tool**: [Vite](https://vitejs.dev/) - For lightning-fast Hot Module Replacement (HMR) and optimized builds.
- **Styling**: [Tailwind CSS 3](https://tailwindcss.com/) - Utility-first CSS framework for rapid UI development.
- **Icons**: [Lucide React](https://lucide.dev/) - Beautiful and consistent iconography.
- **Data Visualization**: [Chart.js](https://www.chartjs.org/) & `react-chartjs-2`
- **PDF Generation**: `jspdf` & `jspdf-autotable`
- **Linter**: [Oxlint](https://oxc.rs/docs/guide/usage/linter.html) - Extremely fast JavaScript/TypeScript linter.

## 📁 Project Structure

```text
frontend/
├── public/               # Static assets (images, favicons, etc.)
├── src/
│   ├── components/       # Reusable React components
│   │   ├── seo/          # SEO audit specific components
│   │   ├── Hero.jsx      # Main landing/scanning section
│   │   ├── Navbar.jsx    # Application navigation
│   │   └── ...           # Other UI components
│   ├── hooks/            # Custom React hooks (e.g., useScanner, useSeoScanner)
│   ├── utils/            # Utility functions and helpers
│   ├── App.jsx           # Main application layout and routing logic
│   ├── main.jsx          # Application entry point
│   └── index.css         # Global Tailwind directives and custom CSS
├── nginx.conf            # Nginx configuration for production serving
├── package.json          # Project metadata, scripts, and dependencies
├── tailwind.config.js    # Tailwind CSS customization
└── vite.config.js        # Vite configuration
```

## 💻 Getting Started

### Prerequisites

- **Node.js**: Ensure you have Node.js installed (v18 or higher recommended).
- **npm**: Node package manager (comes with Node.js).

### Installation

1.  Navigate to the frontend directory:
    ```bash
    cd frontend
    ```
2.  Install the dependencies:
    ```bash
    npm install
    ```

### Development Scripts

- **Start the development server**:

  ```bash
  npm run dev
  ```

  This will start the Vite dev server, usually accessible at `http://localhost:5173`.

- **Build for production**:

  ```bash
  npm run build
  ```

  Creates a production-ready optimized build in the `dist` folder.

- **Preview production build**:
  ```bash
  npm run preview
  ```
  Locally preview the production build generated in the `dist` folder.

## 🤝 Backend Integration

This frontend is designed to interact with a Node.js backend API (located in the `../backend` directory). Ensure the backend server is running and the API endpoints in the custom hooks (`src/hooks/`) are configured to point to the correct backend URL.
