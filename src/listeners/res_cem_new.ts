import { app } from '../initializers/bolt'
import { firestore, FieldValue } from '../initializers/firebase'
import { Project, Challenge, CallbackId, ProjectStatus } from '../types/slack'
import * as methods from '@slack/web-api/dist/methods'

app.view(CallbackId.CemNew, async ({ ack, body, view, context }) => {
  ack()

  const payload = (view.state as any).values
  const user = body.user.id
  const metadata = body.view.private_metadata
  const projectTitle = payload.projectTitle.projectTitle.value
  const year = payload.year.year.selected_option.value
  const month = payload.month.month.selected_option.value
  const description: string = payload.description
    ? payload.description.description.value || ``
    : ``

  const challengerRef = firestore.collection(`challengers`).doc(user)
  const projectsRef = firestore.collection(`projects`)
  const timestamp = await FieldValue.serverTimestamp()
  // firestoreにプロジェクト作成

  const project: Project = {
    challenger: challengerRef,
    year: Number(year),
    month: Number(month),
    title: projectTitle,
    status: ProjectStatus.Draft,
    description: description,
    updatedAt: timestamp,
    createdAt: timestamp,
  }
  const projectRef = await projectsRef.add(project).catch(err => {
    throw new Error(err)
  })
  // firestoreに挑戦を行ごとにパーズして保存
  const batch = firestore.batch()
  for (const challengeName of payload.challenges.challenges.value.split(/\n/)) {
    const challenge: Challenge = {
      challenger: challengerRef,
      year: Number(payload.year.year.selected_option.value),
      month: Number(month),
      name: challengeName,
      status: `draft`,
      updatedAt: timestamp,
      createdAt: timestamp,
    }
    batch.set(projectRef.collection(`challenges`).doc(), challenge)
  }
  await batch.commit()
  // 成功をSlack通知
  const msg: methods.ChatPostEphemeralArguments = {
    token: context.botToken,
    text: `新規プロジェクト[${projectTitle}]を[${year}-${month}]に登録しました`,
    channel: metadata,
    user: user,
  }
  await app.client.chat.postEphemeral(msg).catch(err => {
    throw new Error(err)
  })
})
