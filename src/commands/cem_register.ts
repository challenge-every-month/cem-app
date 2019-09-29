import { app } from '../bolt/setup'
import { firestore, FieldValue } from '../bolt/firebase'

export default function() {
  app.command(
    `/cem_register`,
    async ({ payload, ack, say, respond, context }) => {
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
          return app.client.chat.postEphemeral({
            token: context.botToken,
            text: `表示名を[${body.text || body.user_name}]に変更しました`,
            channel: body.channel_id,
            user: body.user_id,
          })
        }

        // firestoreにユーザー作成
        await challengersRef
          .doc(body.user_id)
          .set({
            slackName: body.user_name,
            displayName: body.text || body.user_name,
            updatedAt: FieldValue.serverTimestamp(),
            createdAt: FieldValue.serverTimestamp(),
          })
          .catch(err => {
            throw new Error(err)
          })
        // 成功をSlack通知
        return app.client.chat
          .postMessage({
            token: context.botToken,
            mrkdwn: true,
            text: `*Here comes a new challenger!*\n挑戦者[${body.text ||
              body.user_name}]さんを新規登録しました`,
            channel: body.channel_id,
          })
          .catch(err => {
            throw new Error(err)
          })
      } catch (error) {
        console.error(`Error:`, error)
        return app.client.chat.postEphemeral({
          token: context.botToken,
          text: `Error: ${error}`,
          channel: body.channel_id,
          user: body.user_id,
        })
      }
    }
  )
}
