import { app } from '../initializers/bolt'
import { firestore } from '../initializers/firebase'
import * as methods from '@slack/web-api/dist/methods'
import * as index from '@slack/types/dist/index'

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
    const msg: methods.ChatPostEphemeralArguments = {
      token: context.botToken,
      text: `中間報告できるプロジェクトはありません`,
      channel: payload.channel_id,
      user: payload.user_id,
    }
    return app.client.chat.postEphemeral(msg)
  }

  // let index = 0
  const blocks: index.Block[] = []
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
    } as index.SectionBlock)

    challenges.docs.forEach(challenge => {
      const challengeData = challenge.data()
      blocks.push({
        type: `section`,
        text: {
          type: `mrkdwn`,
          text: `挑戦：${challengeData.name}`,
        },
        accessory: {
          action_id: `progress_${project.ref.id}_${challenge.ref.id}`,
          type: `static_select`,
          placeholder: {
            type: `plain_text`,
            text: `進捗を選択`,
          },
          options: [
            {
              text: {
                type: `plain_text`,
                text: `:heavy_minus_sign: 未着手`,
              },
              value: `notStarted`,
            },
            {
              text: {
                type: `plain_text`,
                text: `:arrow_forward: 進捗半分以下`,
              },
              value: `lessHalf`,
            },
            {
              text: {
                type: `plain_text`,
                text: `:fast_forward: 進捗半分以上`,
              },
              value: `overHalf`,
            },
            {
              text: {
                type: `plain_text`,
                text: `:white_check_mark: 達成済`,
              },
              value: `completed`,
            },
          ],
        },
      } as index.SectionBlock)

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
        optional: true,
        label: {
          type: `plain_text`,
          text: `コメント`,
          emoji: true,
        },
      } as index.InputBlock)
    })
  }

  try {
    const modal: methods.ViewsOpenArguments = {
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
    return app.client.views.open(modal)
  } catch (error) {
    console.log(`Error:`, error)
    const msg: methods.ChatPostEphemeralArguments = {
      token: context.botToken,
      text: `Error: ${error}`,
      channel: payload.channel_id,
      user: payload.user_id,
    }
    return app.client.chat.postEphemeral(msg)
  }
})
