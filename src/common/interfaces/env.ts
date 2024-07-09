export interface ENV {
  HOST: string | undefined;
  PORT: number | undefined;
  CONTEXT_PATH: string | undefined;
  DB_URI: string | undefined;
  JWT_SECRET: string | undefined;
  RABBIT_URI: string | undefined;
  CLIENT_URI: string | undefined;
}
