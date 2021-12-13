declare namespace NodeJS {
  interface ProcessEnv {
    PORT: string;
    DB_PASSWORD: string;
    ACCESS_TOKEN_SECRET: string;
    REFRESH_TOKEN_SECRET: string;
  }
}
