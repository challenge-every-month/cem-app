import { app } from '@/bolt/setup'
import { Option, Modal, Message } from 'types/slack'

export default function() {
  app.command(`/cem_new`, async ({ payload, ack, context }) => {
    ack()
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
    try {
      const modal: Modal = {
        token: context.botToken,
        trigger_id: payload.trigger_id,
        view: {
          type: `modal`,
          callback_id: `cem_new`,
          private_metadata: payload.channel_id,
          title: {
            type: `plain_text`,
            text: `新規プロジェクト追加`,
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
          blocks: [
            {
              type: `input`,
              block_id: `projectTitle`,
              label: {
                type: `plain_text`,
                text: `プロジェクト名`,
                emoji: true,
              },
              element: {
                type: `plain_text_input`,
                action_id: `projectTitle`,
                placeholder: {
                  type: `plain_text`,
                  text: `${thisYear}年${thisMonth}月の挑戦`,
                },
              },
            },
            {
              type: `input`,
              block_id: `year`,
              label: {
                type: `plain_text`,
                text: `年`,
                emoji: true,
              },
              element: {
                type: `static_select`,
                action_id: `year`,
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
                    text: `${thisYear}`,
                    emoji: true,
                  },
                  value: `${thisYear}`,
                },
              },
            },
            {
              type: `input`,
              block_id: `month`,
              element: {
                type: `static_select`,
                action_id: `month`,
                placeholder: {
                  type: `plain_text`,
                  text: `月を選択`,
                  emoji: true,
                },
                options: monthOptions,
                initial_option: {
                  text: {
                    type: `plain_text`,
                    text: `${thisMonth}`,
                    emoji: true,
                  },
                  value: `${thisMonth}`,
                },
              },
              label: {
                type: `plain_text`,
                text: `月`,
                emoji: true,
              },
            },
            {
              type: `input`,
              block_id: `challenges`,
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
                action_id: `challenges`,
                placeholder: {
                  type: `plain_text`,
                  text: `毎週ブログを書く\n積ん読を1冊解消する`,
                },
              },
            },
            {
              type: `input`,
              block_id: `description`,
              label: {
                type: `plain_text`,
                text: `説明（optional)`,
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
                action_id: `description`,
                placeholder: {
                  type: `plain_text`,
                  text: `説明の内容`,
                },
              },
            },
          ],
        },
      }
      return app.client.views.open(modal)
    } catch (error) {
      console.log(`Error:`, error)
      const msg: Message = {
        token: context.botToken,
        text: `Error: ${error}`,
        channel: payload.channel_id,
        user: payload.user_id,
      }
      return app.client.chat.postEphemeral(msg)
    }
  })
}
