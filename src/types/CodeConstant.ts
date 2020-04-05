export const CallbackId = {
  CemEdit: `cem_edit`,
  CemDelete: `cem_delete`,
  CemNew: `cem_new`,
  CemReview: `cem_review`,
} as const
type CallbackId = typeof CallbackId[keyof typeof CallbackId]
