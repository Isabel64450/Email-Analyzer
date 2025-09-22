import dotenv from "dotenv";

// Set the NODE_ENV to 'development' by default
process.env.NODE_ENV = process.env.NODE_ENV || "development";

const envFound = dotenv.config();
if (envFound.error) {
  // This error should crash whole process

  throw new Error("⚠️  Couldn't find .env file  ⚠️");
}

export default {
  env: process.env.ENV,
  logs: {
    level: process.env.LOGGER_LEVEL,
  },
  applications: process.env.APPLICATIONS,
  mailer: {
    user: process.env.MAILER_USER,
    pass: process.env.MAILER_PASS_TOKEN,
    alertUser: process.env.MAILER_ALERT_USER,
  },
  mistralAi: {
    apiKey: process.env.MISTRAL_AI_API_KEY,
  },
};
