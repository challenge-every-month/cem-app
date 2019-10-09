import { app } from '../initializers/bolt'
import { Message } from '../types/slack'
const config = require(`config`)

export default function() {
  app.receiver.app.get(`/slack/deployed`, (req, res) => {
    res.sendStatus(200)
    const channels = config.get(`Slack.Channels`)
    const msg: Message = {
      token: process.env.SLACK_BOT_TOKEN,
      text: `おめでとう！CEMたろうは新しいバージョンに進化した！`,
      channel: channels.development,
    }
    return app.client.chat.postMessage(msg).catch(err => {
      throw new Error(err)
    })
  })
}
