import { app } from '../initializers/bolt'
import { firestore, FieldValue } from '../initializers/firebase'
import { Message, Challenger } from '../types/slack'

export default function() {
  app.command(`/cem_register`, async ({ payload, ack, context }) => {
    ack()
    const body = payload
    const challengersRef = firestore.collection(`challengers`)
    try {
      const user = await challengersRef.doc(body.user_id).get()
      // すでに登録されている場合
      if (user.exists) {
        await challengersRef
          .doc(body.user_id)
          .update({
            displayName: body.text || body.user_name,
            updatedAt: FieldValue.serverTimestamp(),
          })
          .catch(err => {
            throw new Error(err)
          })
        const msg: Message = {
          token: context.botToken,
          text: `表示名を[${body.text || body.user_name}]に変更しました`,
          channel: body.channel_id,
          user: body.user_id,
        }
        return app.client.chat.postEphemeral(msg)
      }

      // firestoreにユーザー作成
      const challenger: Challenger = {
        slackName: body.user_name,
        displayName: body.text || body.user_name,
        updatedAt: FieldValue.serverTimestamp(),
        createdAt: FieldValue.serverTimestamp(),
      }
      await challengersRef
        .doc(body.user_id)
        .set(challenger)
        .catch(err => {
          throw new Error(err)
        })
      // 成功をSlack通知
      const msg: Message = {
        token: context.botToken,
        text: `*Here comes a new challenger!*\n挑戦者[${body.text ||
          body.user_name}]さんを新規登録しました`,
        channel: body.channel_id,
      }
      return app.client.chat.postMessage(msg).catch(err => {
        throw new Error(err)
      })
    } catch (error) {
      console.error(`Error:`, error)
      const msg: Message = {
        token: context.botToken,
        text: `Error: ${error}`,
        channel: body.channel_id,
        user: body.user_id,
      }
      return app.client.chat.postEphemeral(msg)
    }
  })
}
