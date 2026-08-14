/// <reference types="vite/client" />

interface ImportMetaEnv {
  /** Base URL of the backend API. Unset locally (falls back to the '/api'
   *  proxy in vite.config.ts); set to the deployed backend's URL in
   *  production, e.g. https://taskflow-backend-027e.onrender.com/api */
  readonly VITE_API_URL?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
