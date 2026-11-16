/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_USE_MOCKS?: string;
  readonly VITE_CUSTOMERS_API_URL?: string;
  readonly VITE_PURCHASES_API_URL?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
