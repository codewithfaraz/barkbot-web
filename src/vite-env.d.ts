/// <reference types="vite/client" />
interface ImportMetaEnv {
  readonly VITE_GEMINI_API_KEY: string;
  readonly VITE_APPWRITE_BASE_URL: string;
  readonly VITE_APPWRITE_PROJECT_ID: string;
  // add other env vars here if needed
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
