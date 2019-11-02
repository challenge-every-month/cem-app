import { app } from '../initializers/bolt'
import { firestore, FieldValue } from '../initializers/firebase'
import { Message, Challenger } from '../types/slack'

export default function() {
  app.command(`/cem_register`, async ({ payload, ack, context }) => {
    ack()
    try {
      const challengersRef = firestore.collection(`challengers`)
      const userInfo = await app.client.users.info({
        token: context.botToken,
        user: payload.user_id,
      })
      const iconUrl = userInfo.user.profile.image_48
      const userName = payload.text || userInfo.user.profile.display_name
      const user = await challengersRef.doc(payload.user_id).get()
      // すでに登録されている場合
      if (user.exists) {
        await challengersRef
          .doc(payload.user_id)
          .update({
            displayName: userName,
            iconUrl: iconUrl,
            updatedAt: FieldValue.serverTimestamp(),
          })
          .catch(err => {
            throw new Error(err)
          })
        const msg: Message = {
          token: context.botToken,
          text: `表示名を[${userName}]に変更しました`,
          channel: payload.channel_id,
          user: payload.user_id,
        }
        return app.client.chat.postEphemeral(msg)
      }

      // firestoreにユーザー作成
      const challenger: Challenger = {
        slackName: payload.user_name,
        displayName: userName,
        iconUrl: iconUrl,
        updatedAt: FieldValue.serverTimestamp(),
        createdAt: FieldValue.serverTimestamp(),
      }
      await challengersRef
        .doc(payload.user_id)
        .set(challenger)
        .catch(err => {
          throw new Error(err)
        })
      // 成功をSlack通知
      const msg: Message = {
        token: context.botToken,
        text: `*Here comes a new challenger!*\n挑戦者[${userName}]さんを新規登録しました`,
        channel: payload.channel_id,
        icon_url: `https://challenge-every-month-404e2.appspot.com/static/boy_good.png`,
      }
      return app.client.chat.postMessage(msg).catch(err => {
        throw new Error(err)
      })
    } catch (error) {
      console.error(`Error:`, error)
      const msg: Message = {
        token: context.botToken,
        text: `Error: ${error}`,
        channel: payload.channel_id,
        user: payload.user_id,
      }
      return app.client.chat.postEphemeral(msg)
    }
  })
}
