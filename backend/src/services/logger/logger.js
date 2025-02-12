const log4js = require("log4js");

log4js.configure({
  appenders: {
    out: { type: "stdout" },
    file: { type: "file", filename: "./logs/eduhund-backend.log" },
    slack: {
      type: "@log4js-node/slack",
      token: process.env.SLACK_BOT_TOKEN,
      channel_id: process.env.SLACK_CHANNEL_ID,
      username: "Taskbook",
    },
  },
  categories: {
    default: { appenders: ["out"], level: "debug" },
    local: { appenders: ["out", "file"], level: "debug" },
    test: { appenders: ["out", "file"], level: "debug" },
    prod: { appenders: ["out", "file", "slack"], level: "debug" },
  },
});

const log = log4js.getLogger(process.env.MACHINE);

module.exports = { log };
