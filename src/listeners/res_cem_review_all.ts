import { app } from '../initializers/bolt'
import { firestore, FieldValue } from '../initializers/firebase'
import { Block, CallbackId, ProjectStatus } from '../types/slack'
// @ts-ignore
import * as config from 'config'
import * as methods from '@slack/web-api/dist/methods'

app.view(CallbackId.CemReview, async ({ ack, body, view, context }) => {
  ack()
  const payload = (view.state as any).values

  const user = body.user.id
  const channel: any = config.get(`Slack.Channels.review`)
  // const metadata = body.view.private_metadata

  const challengerRef = firestore.collection(`challengers`).doc(user)
  const projectsRef = firestore.collection(`projects`)
  const projectsQuery = projectsRef
    .where(`challenger`, `==`, challengerRef)
    .where(`status`, `==`, ProjectStatus.Published)
  // .where(`year`, `==`, thisYear)
  // .where(`month`, `==`, thisMonth)

  try {
    const projects = await projectsQuery.get().catch(err => {
      throw new Error(err)
    })
    const batch = firestore.batch()
    const timestamp = FieldValue.serverTimestamp()
    if (projects.empty) {
      const msg: methods.ChatPostEphemeralArguments = {
        token: context.botToken,
        text: `振り返るプロジェクトが見つかりませんでした`,
        channel: channel,
        user: user,
      }
      return app.client.chat.postEphemeral(msg)
    }
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
    for (const project of projects.docs) {
      const comment = payload[`review_${project.ref.id}`].comment.value || ``
      batch.update(project.ref, {
        status: `reviewed`,
        reviewComment: comment,
        updatedAt: timestamp,
      })
      let projectText = ``
      const projData = project.data()
      projectText += `>>>*${projData.title}*\n`
      const challenges = await project.ref.collection(`challenges`).get()
      for (const challenge of challenges.docs) {
        const chalData = challenge.data()
        let icon = ``
        switch (chalData.status) {
          case `completed`:
            icon = `:white_check_mark:`
            break
          case `incompleted`:
            icon = `:x:`
            break
          default:
            icon = `:black_square_button:`
            break
        }
        projectText += `${icon} ${chalData.name}\n`
      }
      // projectText += `${projData.description}`
      projectText += comment
      blocks.push({
        type: `section`,
        text: {
          type: `mrkdwn`,
          text: projectText,
        },
      })
    }
    await batch.commit()
    const msg: methods.ChatPostMessageArguments = {
      token: context.botToken,
      text: `${challengerName}さんが挑戦目標を振り返りました`,
      blocks: blocks,
      channel: channel,
      username: challengerName,
      icon_url: iconUrl,
    }
    return app.client.chat.postMessage(msg).catch(err => {
      throw new Error(err)
    })
  } catch (error) {
    console.log(`Error:`, error)
    const msg: methods.ChatPostEphemeralArguments = {
      token: context.botToken,
      text: `Error: ${error}`,
      channel: channel,
      user: user,
    }
    return app.client.chat.postEphemeral(msg)
  }
})
