import { app, expressReceiver } from '../initializers/bolt'
import { EndPoint, Message } from '../types/slack'
// @ts-ignore
import * as config from 'config'

expressReceiver.app.get(EndPoint.Deploying, (req, res) => {
  res.sendStatus(200)
  const channels: any = config.get(`Slack.Channels`)
  const msg: Message = {
    token: process.env.SLACK_BOT_TOKEN,
    text: `・・・おや！？ CEMたろうのようすが・・・！`,
    channel: channels.development,
    icon_url: `https://challenge-every-month-404e2.appspot.com/static/boy_dark.png`,
  }
  return app.client.chat.postMessage(msg as any).catch(err => {
    throw new Error(err)
  })
})
expressReceiver.app.get(EndPoint.Deployed, (req, res) => {
  res.sendStatus(200)
  const channels: any = config.get(`Slack.Channels`)
  const msg: Message = {
    token: process.env.SLACK_BOT_TOKEN,
    text: `おめでとう！CEMたろうは新しいバージョンに進化した！`,
    channel: channels.development,
    username: `進化したCEMたろう`,
    icon_url: `https://challenge-every-month-404e2.appspot.com/static/boy_fire.png`,
  }
  return app.client.chat.postMessage(msg as any).catch(err => {
    throw new Error(err)
  })
})
