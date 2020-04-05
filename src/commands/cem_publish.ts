import { app } from '../initializers/bolt'
import { firestore, FieldValue } from '../initializers/firebase'
import {
  Block,
  ChallengeStatus,
  Command,
  Message,
  ProjectStatus,
} from '../types/slack'
// @ts-ignore
import * as config from 'config'

app.command(Command.CemPublish, async ({ payload, ack, context }) => {
  ack()

  const now = new Date()
  const thisYear = now.getFullYear()
  const thisMonth = now.getMonth() + 1
  const channel: any = config.get(`Slack.Channels.publish`)

  const challengerRef = firestore.collection(`challengers`).doc(payload.user_id)
  const projectsRef = firestore.collection(`projects`)
  const projectsQuery = projectsRef
    .where(`challenger`, `==`, challengerRef)
    .where(`year`, `==`, thisYear)
    .where(`month`, `==`, thisMonth)
    .where(`status`, `==`, ProjectStatus.Draft)

  try {
    const projects = await projectsQuery.get().catch(err => {
      throw new Error(err)
    })
    const batch = firestore.batch()
    const timestamp = FieldValue.serverTimestamp()
    if (projects.empty) {
      const msg: Message = {
        token: context.botToken,
        text: `プロジェクトが登録されていません`,
        channel: channel,
        user: payload.user_id,
      }
      return app.client.chat.postEphemeral(msg as any)
    }
    const challenger = await challengerRef.get()
    const challengerName = challenger.data()!.displayName
    const iconUrl = challenger.data()!.iconUrl
    const blocks: Block[] = [
      {
        type: `section`,
        text: {
          type: `mrkdwn`,
          text: `${challengerName}さんが${thisYear}年${thisMonth}月の挑戦を表明しました`,
        },
      },
    ]
    for (const project of projects.docs) {
      batch.update(project.ref, {
        status: ProjectStatus.Published,
        updatedAt: timestamp,
      })
      let projectText = ``
      const projData = project.data()
      projectText += `>>>*${projData.title}*\n`
      const challenges = await project.ref.collection(`challenges`).get()
      for (const challenge of challenges.docs) {
        batch.update(challenge.ref, {
          status: ChallengeStatus.Trying,
          updatedAt: timestamp,
        })
        const chalData = challenge.data()
        projectText += `• ${chalData.name}\n`
      }
      projectText += `${projData.description}`
      blocks.push({
        type: `section`,
        text: {
          type: `mrkdwn`,
          text: projectText,
        },
      })
    }
    await batch.commit()
    const msg: Message = {
      token: context.botToken,
      text: {
        type: `mrkdwn`,
        text: `${challengerName}さんが${thisYear}年${thisMonth}月の挑戦を表明しました`,
      },
      blocks: blocks,
      channel: channel,
      username: challengerName,
      icon_url: iconUrl,
    }
    return app.client.chat.postMessage(msg as any).catch(err => {
      throw new Error(err)
    })
  } catch (error) {
    console.log(`Error:`, error)
    const msg: Message = {
      token: context.botToken,
      text: `Error: ${error}`,
      channel: channel,
      user: payload.user_id,
    }
    return app.client.chat.postEphemeral(msg as any)
  }
})
