export interface TextSection {
  type: `plain_text` | `mrkdown`
  text: string
  emoji?: boolean
}
export interface Option {
  text: TextSection
  value: string
}
export interface Block {
  type: string
  label: TextSection
  block_id: string
  optional?: boolean
  element: {
    type: `plain_text_input` | `static_select`
    action_id: string
    placeholder: TextSection
    multiline?: boolean
    options?: Option[]
    initial_option?: Option
  }
  hint?: TextSection
}
export interface Modal {
  token: any
  trigger_id: string
  view: {
    type: `modal`
    callback_id: string
    private_metadata?: string
    title: TextSection
    submit: TextSection
    close: TextSection
    blocks: Block[]
  }
}
export interface Message {
  token?: string
  channel: string
  mrkdwn?: boolean
  text?: string
  user?: string
  as_user?: boolean
  blocks?: Block[]
  icon_emoji?: string
  icon_url?: string
}
