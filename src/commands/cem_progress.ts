import { app } from '../initializers/bolt'
import { firestore } from '../initializers/firebase'
import { Modal, Message } from '../types/slack'

app.command(`/cem_progress`, async ({ payload, ack, context }) => {
  ack()
  const challengerRef = firestore.collection(`challengers`).doc(payload.user_id)
  const projectsRef = firestore.collection(`projects`)
  const projectsQuery = projectsRef
    .where(`challenger`, `==`, challengerRef)
    .where(`status`, `==`, `published`)

  const projects = await projectsQuery.get().catch(err => {
    throw new Error(err)
  })

  if (projects.docs.length === 0) {
    const msg: Message = {
      token: context.botToken,
      text: `振り返りできるプロジェクトはありません`,
      channel: payload.channel_id,
      user: payload.user_id,
    }
    return app.client.chat.postEphemeral(msg as any)
  }

  // let index = 0
  const blocks: any[] = []
  // async/awaitを使いたいので、for-ofを使用している
  for (const project of projects.docs) {
    const challlengeRef = projectsRef.doc(project.id).collection(`challenges`)
    const challenges = await challlengeRef.get()

    const projData = project.data()
    blocks.push({
      type: `section`,
      text: {
        type: `plain_text`,
        text: `プロジェクト名：${projData.title}`,
        emoji: true,
      },
    })

    challenges.docs.forEach(challenge => {
      const challengeData = challenge.data()
      blocks.push({
        type: `section`,
        block_id: `achievement_${project.ref.id}_${challenge.ref.id}`,
        text: {
          type: `mrkdwn`,
          text: `挑戦：${challengeData.name}`,
        },
        accessory: {
          action_id: `achievement`,
          type: `static_select`,
          options: [
            {
              text: {
                type: `plain_text`,
                text: `未着手`,
                emoji: true,
              },
              value: `notStarted`,
            },
            {
              text: {
                type: `plain_text`,
                text: `進捗半分以下`,
                emoji: true,
              },
              value: `lessHalf`,
            },
            {
              text: {
                type: `plain_text`,
                text: `進捗半分以上`,
                emoji: true,
              },
              value: `overHalf`,
            },
            {
              text: {
                type: `plain_text`,
                text: `完了済`,
                emoji: true,
              },
              value: `completed`,
            },
          ],
          initial_option: {
            text: {
              type: `plain_text`,
              text: `未着手`,
              emoji: true,
            },
            value: `notStarted`,
          },
        },
      })

      blocks.push({
        type: `input`,
        block_id: `comment_${project.ref.id}_${challenge.ref.id}`,
        element: {
          type: `plain_text_input`,
          // multiline: true,
          initial_value: projData.description,
          action_id: `comment`,
          placeholder: {
            type: `plain_text`,
            text: `挑戦に対するコメント`,
          },
        },
        label: {
          type: `plain_text`,
          text: `コメント`,
          emoji: true,
        },
      })
    })
    // break
  }

  try {
    const modal: Modal = {
      token: context.botToken,
      trigger_id: payload.trigger_id,
      view: {
        type: `modal`,
        callback_id: `cem_progress`,
        private_metadata: payload.channel_id,
        title: {
          type: `plain_text`,
          text: `プロジェクト進捗報告`,
          emoji: true,
        },
        submit: {
          type: `plain_text`,
          text: `保存`,
          emoji: true,
        },
        close: {
          type: `plain_text`,
          text: `破棄`,
          emoji: true,
        },
        blocks: blocks,
      },
    }
    return app.client.views.open(modal as any)
  } catch (error) {
    console.log(`Error:`, error)
    const msg: Message = {
      token: context.botToken,
      text: `Error: ${error}`,
      channel: payload.channel_id,
      user: payload.user_id,
    }
    return app.client.chat.postEphemeral(msg as any)
  }
})
