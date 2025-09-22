import winston from "winston";
import config from "@envConfig";
import path from "path";

const transports = [];
if (config.env === "production") {
  // Write info and error logs to info_logs file
  transports.push(
    new winston.transports.File({
      filename: path.join(process.cwd(), "logs", "info_logs.log"), // File for info and error logs
      level: "info", // Capture logs at level "info" and above (info, error)
      format: winston.format.combine(
        winston.format.timestamp({
          format: "DD-MM-YYYY HH:mm:ss",
        }),
        winston.format.errors({ stack: true }),
        winston.format.splat(),
        winston.format.json() // JSON format for structured logs
      ),
    })
  );

  // Write all logs (including debug) to debug_logs file
  transports.push(
    new winston.transports.File({
      filename: path.join(process.cwd(), "logs", "debug_logs.log"), // File for all logs, including debug
      level: "debug", // Capture all logs at "debug" level and above
      format: winston.format.combine(
        winston.format.timestamp({
          format: "DD-MM-YYYY HH:mm:ss",
        }),
        winston.format.errors({ stack: true }),
        winston.format.splat(),
        winston.format.json() // JSON format for structured logs
      ),
    })
  );

  // Also log to the console in production mode (like in development)
  transports.push(
    new winston.transports.Console({
      format: winston.format.combine(
        winston.format.splat(),
        winston.format.cli(), // CLI format for readable console output
        winston.format.timestamp({
          format: "DD-MM-YYYY HH:mm:ss",
        })
      ),
    })
  );
} else {
  // In development, log to the console with a readable format
  transports.push(
    new winston.transports.Console({
      format: winston.format.combine(
        winston.format.splat(),
        winston.format.cli() // CLI format for more readable output in development
      ),
    })
  );
}

const LoggerInstance = winston.createLogger({
  level: config.logs.level,
  levels: winston.config.npm.levels,
  format: winston.format.combine(
    winston.format.timestamp({
      format: "DD-MM-YYYY HH:mm:ss",
    }),
    winston.format.errors({ stack: true }),
    winston.format.splat(),
    winston.format.json()
  ),
  transports,
});

export default LoggerInstance;
