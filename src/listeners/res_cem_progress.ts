import { app } from '../initializers/bolt'
import { FieldValue, firestore } from '../initializers/firebase'
import * as config from 'config'
import * as methods from '@slack/web-api/dist/methods'
import * as index from '@slack/types/dist/index'

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
  const blocks: index.SectionBlock[] = [
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

    let projectText: string = `*${projData.title}*\n`
    for (const challenge of challenges.docs) {
      const tmpComment =
        payload[`comment_${project.ref.id}_${challenge.ref.id}`].comment.value
      const comment = tmpComment === undefined ? `` : tmpComment

      batch.update(challenge.ref, {
        progressComment: comment,
        updatedAt: timestamp,
      })
      const chalData = challenge.data()

      if (!projectText.includes(`>>>`)) {
        projectText += `>>>`
      }

      projectText += `*${chalData.name}*\n`

      let icon = ``
      let jaStatus = ``
      switch (chalData.status) {
        case `completed`:
          icon = `:white_check_mark:`
          jaStatus = `達成済`
          break
        case `lessHalf`:
          icon = `:arrow_forward:`
          jaStatus = `進捗半分以下`
          break
        case `overHalf`:
          icon = `:fast_forward:`
          jaStatus = `進捗半分以上`
          break
        default:
          icon = `:heavy_minus_sign:`
          jaStatus = `未着手`
          break
      }
      projectText += `${icon}(${jaStatus})\n`
      projectText += `${comment}\n\n`
    }

    blocks.push({
      type: `section`,
      text: {
        type: `mrkdwn`,
        text: projectText,
      },
    })
  }

  await batch.commit()
  // 成功をSlack通知
  const msg: methods.ChatPostMessageArguments = {
    token: context.botToken,
    text: `${challengerName}さんが挑戦目標を振り返りました`,
    blocks: blocks,
    channel: channel,
    username: challengerName,
    icon_url: iconUrl,
  }
  await app.client.chat.postMessage(msg).catch(err => {
    throw new Error(err)
  })
})
