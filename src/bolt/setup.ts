import * as dotenv from 'dotenv'
dotenv.config()
const { App } = require(`@slack/bolt`)

// Initializes your app with your bot token and signing secret
export const app = new App({
  token: process.env.SLACK_BOT_TOKEN,
  signingSecret: process.env.SLACK_SIGNING_SECRET,
})
