const { createLogger, transports, format } = require('winston');

const myFormat = format.printf(({ level, message, label, timestamp }) => {
  return `${timestamp} ${level}: ${message}`;
});
const logger = createLogger({
  level: 'info',
  format: format.combine(  
    format.timestamp({ format: 'HH:mm:ss' })
  ),
  transports: [
    new transports.Console({
      format: format.combine(format.colorize(), myFormat)
    }),
    new transports.File({ filename: './logs/error.log', level: 'error', format: myFormat }),
    new transports.File({ filename: './logs/combined.log', format: myFormat})
  ]
});

module.exports = logger;
