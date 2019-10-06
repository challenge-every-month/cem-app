import * as dotenv from 'dotenv'
const { App, LogLevel } = require(`@slack/bolt`)

// Initializes your app with your bot token and signing secret
let config = {}
if (process.env.NODE_ENV === `production`) {
  config = {
    token: process.env.SLACK_BOT_TOKEN,
    signingSecret: process.env.SLACK_SIGNING_SECRET,
  }
} else {
  dotenv.config()
  config = {
    token: process.env.SLACK_BOT_TOKEN,
    signingSecret: process.env.SLACK_SIGNING_SECRET,
    logLevel: LogLevel.DEBUG,
  }
}
export const app = new App(config)
