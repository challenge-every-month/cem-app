import { app } from '../../initializers/bolt'
import { firestore } from '../../initializers/firebase'
import { Message } from '../types/slack'

export default function() {
  app.view(`cem_delete`, async ({ ack, body, view, context }) => {
    ack()

    const payload = view.state.values
    const user = body.user.id
    const metadata = body.view.private_metadata
    const projectId = payload.project.projectId.selected_option.value

    const projectRef = firestore.collection(`projects`).doc(projectId)
    const project = await projectRef.get()
    const projData = project.data()
    const projectTitle = projData!.title
    // firestoreからプロジェクトとサブコレクションのチャレンジを削除
    const batch = firestore.batch()
    const challengesRef = await projectRef.collection(`challenges`).get()
    challengesRef.docs.forEach(challenge => {
      batch.delete(challenge.ref)
    })
    batch.delete(projectRef)
    await batch.commit()
    // 成功をSlack通知
    const msg: Message = {
      token: context.botToken,
      text: `新規プロジェクト[${projectTitle}]を削除しました`,
      channel: metadata,
      user,
    }
    await app.client.chat.postEphemeral(msg).catch(err => {
      throw new Error(err)
    })
  })
}
