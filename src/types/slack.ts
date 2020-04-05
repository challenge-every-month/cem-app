export interface TextSection {
  type: `plain_text` | `mrkdwn`
  text: string
  emoji?: boolean
}
export interface Option {
  text: TextSection
  value: string
}
export interface Block {
  type: `section` | `actions` | `divider` | `context` | `image`
  text?: TextSection
  fields?: TextSection[]
  image_url?: string
  alt_text?: string
  accessory?: any
  elements?: any
}
export interface ModalBlock {
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
    blocks: ModalBlock[]
  }
}
export interface Message {
  token?: string
  channel: string
  mrkdwn?: boolean
  text?: string | TextSection
  user?: string
  as_user?: boolean
  blocks?: Block[]
  icon_emoji?: string
  icon_url?: string
  username?: string
}
export interface Challenger {
  slackName: string
  displayName: string
  iconUrl: string
  updatedAt: any
  createdAt: any
}

export const ProjectStatus = {
  Draft: `draft`,
  Published: `published`,
  Reviewed: `reviewed`,
} as const
type ProjectStatus = typeof ProjectStatus[keyof typeof ProjectStatus]

export interface Project {
  // @ts-ignore
  challenger: FirebaseFirestore.DocumentReference
  year: number
  month: number
  title: string
  status: ProjectStatus
  description: string
  updatedAt: any
  createdAt: any
}
export interface Challenge {
  // @ts-ignore
  challenger: FirebaseFirestore.DocumentReference
  year: number
  month: number
  name: string
  status: `draft` | `trying` | `completed` | `incompleted`
  updatedAt: any
  createdAt: any
}

export const EndPoint = {
  Event: `/slack/events`, // コマンドを受けるためのエンドポイント
  Deploying: `/slack/deploying`,
  Deployed: `/slack/deployed`,
  Remind: `/slack/remind`,
  Welcome: `/`,
} as const

export const Command = {
  CemEdit: `/cem_edit`,
  CemDelete: `/cem_delete`,
  CemNew: `/cem_new`,
  CemReview: `/cem_review`,
  CemHelp: `/cem_help`,
  CemPublish: `/cem_publish`,
  CemRegister: `/cem_register`,
} as const
type Command = typeof Command[keyof typeof Command]

export const CallbackId = {
  CemEdit: `cem_edit`,
  CemDelete: `cem_delete`,
  CemNew: `cem_new`,
  CemReview: `cem_review`,
} as const
type CallbackId = typeof CallbackId[keyof typeof CallbackId]
