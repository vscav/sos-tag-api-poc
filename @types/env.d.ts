declare namespace NodeJS {
  interface ProcessEnv {
    PORT: string;
    DB_PASSWORD: string;
    ACCESS_TOKEN_SECRET: string;
    REFRESH_TOKEN_SECRET: string;
    SMTP_SERVICE: string;
    GOOGLE_OAUTH_CLIENT_USER: string;
    GOOGLE_OAUTH_CLIENT_ID: string;
    GOOGLE_OAUTH_CLIENT_SECRET: string;
    GOOGLE_OAUTH_CLIENT_REFRESH_TOKEN: string;
  }
}