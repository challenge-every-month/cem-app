const { App, LogLevel, ExpressReceiver } = require(`@slack/bolt`)

// Initialize your own ExpressReceiver
const receiver = new ExpressReceiver({
  signingSecret: process.env.SLACK_SIGNING_SECRET,
  endpoints: `/slack/events`,
})

// Initializes your app with your bot token and signing secret
const config = {
  token: process.env.SLACK_BOT_TOKEN,
  signingSecret: process.env.SLACK_SIGNING_SECRET,
  logLevel:
    process.env.NODE_ENV === `production` ? LogLevel.INFO : LogLevel.DEBUG,
  receiver,
}

export const app = new App(config)
