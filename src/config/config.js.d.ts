interface DatabaseConfig {
  url: string;
  dialect: "postgres";
  dialectOptions: {
    ssl: {
      require: boolean;
      rejectUnauthorized: boolean;
    };
  };
}

interface Config {
  development: DatabaseConfig;
  test: DatabaseConfig;
  production: DatabaseConfig;
}

declare const config: Config;
export default config;
