import { app } from '../initializers/bolt'
import { FieldValue, firestore } from '../initializers/firebase'
import { Block, Message } from '../types/slack'
import * as config from 'config'

app.view(`cem_progress`, async ({ ack, body, view, context }) => {
  ack()
  const payload = (view.state as any).values

  const channel: any = config.get(`Slack.Channels.progress`)

  const user = body.user.id
  const challengerRef = firestore.collection(`challengers`).doc(user)
  const projectsRef = firestore.collection(`projects`)
  const projectsQuery = projectsRef
    .where(`challenger`, `==`, challengerRef)
    .where(`status`, `==`, `published`)

  const challenger = await challengerRef.get()
  const challengerName = challenger.data()!.displayName
  const iconUrl = challenger.data()!.iconUrl
  const blocks: Block[] = [
    {
      type: `section`,
      text: {
        type: `mrkdwn`,
        text: `${challengerName}さんが挑戦目標を振り返りました`,
      },
    },
  ]

  const projects = await projectsQuery.get().catch(err => {
    throw new Error(err)
  })

  const timestamp = await FieldValue.serverTimestamp()
  const batch = firestore.batch()
  for (const project of projects.docs) {
    const projData = project.data()
    const challengeRef = projectsRef
      .doc(project.ref.id)
      .collection(`challenges`)
    const challengeQuery = challengeRef.where(`challenger`, `==`, challengerRef)

    const challenges = await challengeQuery.get().catch(err => {
      throw new Error(err)
    })

    for (const challenge of challenges.docs) {
      let projectText = `>>>*${projData.title}*\n`
      const comment =
        payload[`comment_${project.ref.id}_${challenge.ref.id}`].comment
          .value || ``

      batch.update(challenge.ref, {
        progressComment: comment,
        updatedAt: timestamp,
      })
      const chalData = challenge.data()

      let jaStatus = ``
      switch (chalData.status) {
        case `completed`:
          jaStatus = `達成済`
          break
        case `lessHalf`:
          jaStatus = `進捗半分以下`
          break
        case `overHalf`:
          jaStatus = `進捗半分以上`
          break
        default:
          jaStatus = `未着手`
          break
      }
      projectText += `進捗：${jaStatus}\n挑戦：${chalData.name}\n`
      projectText += comment
      blocks.push({
        type: `section`,
        text: {
          type: `mrkdwn`,
          text: projectText,
        },
      })
    }
  }

  await batch.commit()
  // 成功をSlack通知
  const msg: Message = {
    token: context.botToken,
    text: {
      type: `mrkdwn`,
      text: `${challengerName}さんが挑戦目標を振り返りました`,
    },
    blocks: blocks,
    channel: channel,
    username: challengerName,
    icon_url: iconUrl,
  }
  await app.client.chat.postMessage(msg as any).catch(err => {
    throw new Error(err)
  })
})
