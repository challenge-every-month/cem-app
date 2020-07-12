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

export const ChallengeStatus = {
  Draft: `draft`,
  Trying: `trying`,
  Completed: `completed`,
  Incompleted: `incompleted`,
} as const
type ChallengeStatus = typeof ChallengeStatus[keyof typeof ChallengeStatus]

export interface Challenge {
  // @ts-ignore
  challenger: FirebaseFirestore.DocumentReference
  year: number
  month: number
  name: string
  status: ChallengeStatus
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
