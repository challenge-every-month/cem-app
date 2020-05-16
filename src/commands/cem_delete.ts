import { app } from '../initializers/bolt'
import { firestore } from '../initializers/firebase'
import {
  Option,
  Modal,
  Command,
  CallbackId,
  ProjectStatus,
} from '../types/slack'
import * as methods from '@slack/web-api/dist/methods'

app.command(Command.CemDelete, async ({ payload, ack, context }) => {
  ack()

  const challengerRef = firestore.collection(`challengers`).doc(payload.user_id)
  const projectsRef = firestore.collection(`projects`)
  const projectsQuery = projectsRef
    .where(`challenger`, `==`, challengerRef)
    .where(`status`, `==`, ProjectStatus.Draft)

  const projects = await projectsQuery.get().catch(err => {
    throw new Error(err)
  })

  if (projects.docs.length === 0) {
    const msg: methods.ChatPostEphemeralArguments = {
      token: context.botToken,
      text: `削除できるプロジェクトはありません`,
      channel: payload.channel_id,
      user: payload.user_id,
    }
    return app.client.chat.postEphemeral(msg)
  }
  const projectOptions: Option[] = projects.docs.map(project => {
    const projData = project.data()
    return {
      text: {
        type: `plain_text`,
        text: `${projData.title}(${projData.year}-${projData.month})`,
        emoji: true,
      },
      value: `${project.id}`,
    }
  })
  try {
    const modal: Modal = {
      token: context.botToken,
      trigger_id: payload.trigger_id,
      view: {
        type: `modal`,
        callback_id: CallbackId.CemDelete,
        private_metadata: payload.channel_id,
        title: {
          type: `plain_text`,
          text: `プロジェクト削除`,
          emoji: true,
        },
        submit: {
          type: `plain_text`,
          text: `削除`,
          emoji: true,
        },
        close: {
          type: `plain_text`,
          text: `キャンセル`,
          emoji: true,
        },
        blocks: [
          {
            type: `input`,
            block_id: `project`,
            label: {
              type: `plain_text`,
              text: `プロジェクト名`,
              emoji: true,
            },
            element: {
              type: `static_select`,
              action_id: `projectId`,
              placeholder: {
                type: `plain_text`,
                text: `削除するプロジェクトを選択`,
              },
              options: projectOptions,
            },
            hint: {
              type: `plain_text`,
              text: `プロジェクトに含まれる挑戦目標も同時に削除されます`,
            },
          },
        ],
      },
    }
    return app.client.views.open(modal as any)
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
