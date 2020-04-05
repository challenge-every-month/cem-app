import { app } from '../initializers/bolt'
import { Option, Modal, Message } from '../types/slack'
import { firestore } from '../initializers/firebase'
import { CallbackId } from '../types/CodeConstant'

app.command(`/cem_edit`, async ({ payload, ack, context }) => {
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

  const now = new Date()
  const thisYear = now.getFullYear()
  const thisMonth = now.getMonth() + 1
  const monthOptions: Option[] = Array.from(Array(12).keys()).map(m => {
    return {
      text: {
        type: `plain_text`,
        text: `${m + 1}`,
        emoji: true,
      },
      value: `${m + 1}`,
    }
  })

  let index = 0
  const blocks: any[] = []
  // async/awaitを使いたいので、for-ofを使用している
  for (const project of projects.docs) {
    const challlengeRef = projectsRef.doc(project.id).collection(`challenges`)
    const challenges = await challlengeRef.get()

    const projData = project.data()
    // console.log(project.id)
    blocks.push({
      type: `input`,
      block_id: `projectTitle${index}`,
      label: {
        type: `plain_text`,
        text: `プロジェクト名`,
        emoji: true,
      },
      element: {
        type: `plain_text_input`,
        action_id: `projectTitle${index}`,
        initial_value: projData.title,
        placeholder: {
          type: `plain_text`,
          text: `${thisYear}年${thisMonth}月の挑戦`,
        },
      },
    })

    blocks.push({
      type: `input`,
      block_id: `year${index}`,
      label: {
        type: `plain_text`,
        text: `年`,
        emoji: true,
      },
      element: {
        type: `static_select`,
        action_id: `year${index}`,
        placeholder: {
          type: `plain_text`,
          text: `年を選択`,
        },
        options: [
          {
            text: {
              type: `plain_text`,
              text: `${thisYear}`,
              emoji: true,
            },
            value: `${thisYear}`,
          },
          {
            text: {
              type: `plain_text`,
              text: `${thisYear + 1}`,
              emoji: true,
            },
            value: `${thisYear + 1}`,
          },
        ],
        initial_option: {
          text: {
            type: `plain_text`,
            text: `${projData.year}`,
            emoji: true,
          },
          value: `${projData.year}`,
        },
      },
    })
    blocks.push({
      type: `input`,
      block_id: `month${index}`,
      label: {
        type: `plain_text`,
        text: `月`,
        emoji: true,
      },
      element: {
        type: `static_select`,
        action_id: `month${index}`,
        placeholder: {
          type: `plain_text`,
          text: `月を選択`,
          emoji: true,
        },
        options: monthOptions,
        initial_option: {
          text: {
            type: `plain_text`,
            text: `${projData.month}`,
            emoji: true,
          },
          value: `${projData.month}`,
        },
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
        callback_id: CallbackId.CemEdit,
        private_metadata: payload.channel_id,
        title: {
          type: `plain_text`,
          text: `プロジェクト修正`,
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
