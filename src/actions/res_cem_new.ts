import { app } from '../initializers/bolt'
import { firestore, FieldValue } from '../initializers/firebase'
import { Message } from '../types/slack'

export default function() {
  app.view(`cem_new`, async ({ ack, body, view, context }) => {
    ack()

    const payload = view.state.values
    const user = body.user.id
    const metadata = body.view.private_metadata
    const projectName = payload.projectTitle.projectTitle.value
    const year = payload.year.year.selected_option.value
    const month = payload.month.month.selected_option.value

    const challengerRef = firestore.collection(`challengers`).doc(user)
    const projectsRef = firestore.collection(`projects`)
    // firestoreにプロジェクト作成
    const projectRef = await projectsRef
      .add({
        challenger: challengerRef,
        year: Number(year),
        month: Number(month),
        title: projectName,
        description: payload.description.description.value,
        updatedAt: FieldValue.serverTimestamp(),
      })
      .catch(err => {
        throw new Error(err)
      })
    // firestoreに挑戦を行ごとにパーズして保存
    for (const challenge of payload.challenges.challenges.value.split(/\n/)) {
      await projectRef
        .collection(`challenges`)
        .add({
          challeger: challengerRef,
          year: Number(payload.year.year.selected_option.value),
          month: Number(month),
          name: challenge,
          status: `pending`,
          updatedAt: FieldValue.serverTimestamp(),
          createdAt: FieldValue.serverTimestamp(),
        })
        .catch(err => {
          throw new Error(err)
        })
    }
    // 成功をSlack通知
    const msg: Message = {
      token: context.botToken,
      text: `新規プロジェクト[${projectName}]を[${year}-${month}]に登録しました`,
      channel: metadata,
      user: user,
    }
    await app.client.chat.postEphemeral(msg).catch(err => {
      throw new Error(err)
    })
  })
}
