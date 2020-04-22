import { app } from '../initializers/bolt'
import { firestore } from '../initializers/firebase'
import { Modal, Message } from '../types/slack'

app.command(`/cem_progress`, async ({ payload, ack, context }) => {
  ack()
  const challengerRef = firestore.collection(`challengers`).doc(payload.user_id)
  const projectsRef = firestore.collection(`projects`)
  const projectsQuery = projectsRef
    .where(`challenger`, `==`, challengerRef)
    .where(`status`, `==`, `draft`)

  const projects = await projectsQuery.get().catch(err => {
    throw new Error(err)
  })

  if (projects.docs.length === 0) {
    const msg: Message = {
      token: context.botToken,
      text: `修正できるプロジェクトはありません`,
      channel: payload.channel_id,
      user: payload.user_id,
    }
    return app.client.chat.postEphemeral(msg as any)
  }

  let index = 0
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

    let challengeText: string = ``
    challenges.docs.forEach(challenge => {
      const challengeData = challenge.data()
      challengeText += challengeData.name + `\n`
    })
    blocks.push({
      type: `input`,
      block_id: `challenges${index}`,
      label: {
        type: `plain_text`,
        text: `挑戦`,
        emoji: true,
      },
      hint: {
        type: `plain_text`,
        text: `挑戦が複数ある場合は改行します。1行1挑戦として入力できます`,
      },
      element: {
        type: `plain_text_input`,
        multiline: true,
        action_id: `challenges${index}`,
        initial_value: challengeText,
        placeholder: {
          type: `plain_text`,
          emoji: true,
          text: `毎週ブログを書く\n積ん読を1冊解消する`,
        },
      },
    })

    blocks.push({
      type: `input`,
      block_id: `description${index}`,
      label: {
        type: `plain_text`,
        text: `説明`,
        emoji: true,
      },
      optional: true,
      hint: {
        type: `plain_text`,
        text: `プロジェクトに補足説明があれば入力します`,
      },
      element: {
        type: `plain_text_input`,
        multiline: true,
        initial_value: projData.description,
        action_id: `description${index}`,
        placeholder: {
          type: `plain_text`,
          text: `説明の内容`,
        },
      },
    })

    index += 1
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
