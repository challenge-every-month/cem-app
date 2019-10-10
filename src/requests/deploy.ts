import { app } from '../initializers/bolt'
import { Message } from '../types/slack'
const config = require(`config`)

export default function() {
  app.receiver.app.get(`/slack/deploying`, (req, res) => {
    res.sendStatus(200)
    const channels = config.get(`Slack.Channels`)
    const msg: Message = {
      token: process.env.SLACK_BOT_TOKEN,
      text: `・・・おや！？ CEMたろうのようすが・・・！`,
      channel: channels.development,
      icon_url: `https://challenge-every-month-404e2.appspot.com/static/boy_dark.png`,
    }
    return app.client.chat.postMessage(msg).catch(err => {
      throw new Error(err)
    })
  })
  app.receiver.app.get(`/slack/deployed`, (req, res) => {
    res.sendStatus(200)
    const channels = config.get(`Slack.Channels`)
    const msg: Message = {
      token: process.env.SLACK_BOT_TOKEN,
      text: `おめでとう！CEMたろうは新しいバージョンに進化した！`,
      channel: channels.development,
      icon_url: `https://challenge-every-month-404e2.appspot.com/static/boy_fire.png`,
    }
    return app.client.chat.postMessage(msg).catch(err => {
      throw new Error(err)
    })
  })
}
