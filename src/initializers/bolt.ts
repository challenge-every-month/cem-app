// @ts-ignore
import { App, LogLevel, ExpressReceiver } from '@slack/bolt'
import { EndPoint } from '../types/slack'

// Initialize your own ExpressReceiver
export const expressReceiver = new ExpressReceiver({
  signingSecret: process.env.SLACK_SIGNING_SECRET as string,
  endpoints: EndPoint.Event,
  // endpoints: `/slack/events`,
})

// Initializes your app with your bot token and signing secret
export const app = new App({
  token: process.env.SLACK_BOT_TOKEN,
  receiver: expressReceiver,
  logLevel:
    process.env.NODE_ENV === `production` ? LogLevel.INFO : LogLevel.DEBUG,
})
