import { app } from '../initializers/bolt'
import { firestore } from '../initializers/firebase'
import { Command, CallbackId, ProjectStatus } from '../types/slack'
import * as methods from '@slack/web-api/dist/methods'
import * as index from '@slack/types/dist/index'

app.command(Command.CemReview, async ({ payload, ack, context }) => {
  ack()

  const challengerRef = firestore.collection(`challengers`).doc(payload.user_id)
  const projectsRef = firestore.collection(`projects`)
  const projectsQuery = projectsRef
    .where(`challenger`, `==`, challengerRef)
    .where(`status`, `==`, ProjectStatus.Published)
  const projects = await projectsQuery.get().catch(err => {
    throw new Error(err)
  })
  if (projects.docs.length === 0) {
    const msg: methods.ChatPostEphemeralArguments = {
      token: context.botToken,
      text: `レビューできるプロジェクトがありませんでした`,
      channel: payload.channel_id,
      user: payload.user_id,
    }
    return app.client.chat.postEphemeral(msg)
  }
  const challengeOptions: index.Option[] = [
    {
      text: {
        type: `plain_text`,
        text: `:white_check_mark: 達成`,
      },
      value: `completed`,
    },
    {
      text: {
        type: `plain_text`,
        text: `:x: 未達成`,
      },
      value: `incompleted`,
    },
  ]
  const projectBlocks: index.Block[] = []
  for (const project of projects.docs) {
    const projData = project.data()
    const block: index.SectionBlock = {
      type: `section`,
      text: {
        type: `mrkdwn`,
        text: `*${projData.title}* (${projData.year}-${projData.month})`,
      },
    }
    projectBlocks.push(block)
    const challenges = await project.ref.collection(`challenges`).get()
    for (const challenge of challenges.docs) {
      const chalData = challenge.data()
      const challengeBlock = {
        type: `section`,
        text: {
          type: `mrkdwn`,
          text: `${chalData.name}`,
        },
        accessory: {
          action_id: `review_${project.ref.id}_${challenge.ref.id}`,
          type: `static_select`,
          placeholder: {
            type: `plain_text`,
            text: `結果を選択`,
          },
          options: challengeOptions,
        },
      }
      projectBlocks.push(challengeBlock)
    }
    const reviewComment = {
      type: `input`,
      block_id: `review_${project.ref.id}`,
      label: {
        type: `plain_text`,
        text: `レビューコメント`,
        emoji: true,
      },
      optional: true,
      element: {
        type: `plain_text_input`,
        multiline: true,
        action_id: `comment`,
        placeholder: {
          type: `plain_text`,
          text: `${projData.title}の振り返り`,
        },
      },
    }
    projectBlocks.push(reviewComment)
  }
  try {
    const modal: methods.ViewsOpenArguments = {
      token: context.botToken,
      trigger_id: payload.trigger_id,
      view: {
        type: `modal`,
        callback_id: CallbackId.CemReview,
        private_metadata: payload.channel_id,
        title: {
          type: `plain_text`,
          text: `振り返り`,
          emoji: true,
        },
        submit: {
          type: `plain_text`,
          text: `確定`,
          emoji: true,
        },
        close: {
          type: `plain_text`,
          text: `閉じる`,
          emoji: true,
        },
        blocks: projectBlocks,
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
