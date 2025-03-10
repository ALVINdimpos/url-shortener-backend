interface DatabaseConfig {
  url: string;
  dialect: string;
  dialectOptions: {
    ssl: {
      require: boolean;
      rejectUnauthorized: boolean;
    };
  };
}

interface Config {
  [key: string]: DatabaseConfig;
}

declare const config: Config;
export default config;
