import { app, expressReceiver } from '../initializers/bolt'
import { EndPoint } from '../types/slack'
// @ts-ignore
import * as config from 'config'
import * as methods from '@slack/web-api/dist/methods'

expressReceiver.app.get(EndPoint.Remind, (req, res) => {
  res.sendStatus(200)
  const fromCron = req.header(`X-Appengine-Cron`) === `true`
  const channels: any = config.get(`Slack.Channels`)
  const now = new Date()
  const today = now.getDate()
  const thisMonth = now.getMonth() + 1
  const tommorrow = new Date(now.setDate(today + 1)).getDate()

  let text = ``
  let channel = ``
  let postingMsg = true
  if (today === 1) {
    if (thisMonth === 1) {
      text = `謹賀新年！新しい年の始まりです。今年はどんな年にしましょうか？\n今月の目標とは別に今年の目標も立てちゃいます？\nそれでは今年も、Let's Challenge！`
    } else {
      text = `新しい月の始まりです！今月も目標を立てて一歩一歩行きましょう！Let's Challenge！`
    }
    channel = channels.publish
  } else if (today === 15) {
    text = `月の真ん中、折り返し地点ですね。軽く振り返ってみましょうか。進捗どうですか？`
    channel = channels.progress
  } else if (tommorrow === 1) {
    if (thisMonth === 12) {
      text = `今月も、そして今年も一年お疲れさまでした。\n今年が終わる前に月の振りかえりを忘れずに！\nそして今年一年をとおしてたふりかえりをしてみてはいかがでしょうか？`
    } else {
      text = `今月もお疲れさまでした。振り返りをしましょう！`
    }
    channel = channels.review
  } else {
    postingMsg = false
  }
  const msg: methods.ChatPostMessageArguments = {
    token: process.env.SLACK_BOT_TOKEN,
    text: `<!channel>\n${text}`,
    channel: channel,
  }
  if (fromCron && postingMsg) {
    return app.client.chat.postMessage(msg).catch(err => {
      throw new Error(err)
    })
  } else {
    let msg = ``
    if (!fromCron) {
      msg += `the request does not come from cron\n`
    }
    if (!postingMsg) {
      msg += `it is not time to remind\n`
    }
    return console.log(msg)
  }
})
