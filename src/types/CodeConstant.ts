export const CallbackId = {
  CemEdit: `cem_edit`,
  CemDelete: `cem_delete`,
  CemNew: `cem_new`,
  CemReview: `cem_review`,
} as const
type CallbackId = typeof CallbackId[keyof typeof CallbackId]

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
