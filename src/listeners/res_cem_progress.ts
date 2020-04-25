import { app } from '../initializers/bolt'
import { FieldValue, firestore } from '../initializers/firebase'
// import { Message } from '../types/slack'
// import * as config from 'config'

app.view(`cem_progress`, async ({ ack, body, view }) => {
  ack()
  const payload = (view.state as any).values

  // const channel: any = config.get(`Slack.Channels.review`)

  const user = body.user.id
  const challengerRef = firestore.collection(`challengers`).doc(user)
  const projectsRef = firestore.collection(`projects`)
  const projectsQuery = projectsRef
    .where(`challenger`, `==`, challengerRef)
    .where(`status`, `==`, `published`)

  const projects = await projectsQuery.get().catch(err => {
    throw new Error(err)
  })

  const timestamp = await FieldValue.serverTimestamp()
  const batch = firestore.batch()
  // console.log({ project: projects })
  for (const project of projects.docs) {
    // console.log({ project: project.ref.id })
    const challengeRef = projectsRef
      .doc(project.ref.id)
      .collection(`challenges`)
    const challengeQuery = challengeRef.where(`challenger`, `==`, challengerRef)

    const challenges = await challengeQuery.get().catch(err => {
      throw new Error(err)
    })
    // console.log({ challenge: challenges })

    for (const challenge of challenges.docs) {
      const achievement =
        payload[`achievement_${project.ref.id}_${challenge.ref.id}`].achievement
          .value || ``
      const comment =
        payload[`comment_${project.ref.id}_${challenge.ref.id}`].comment
          .value || ``

      console.log({ achievement: achievement })
      console.log({ com: comment })

      batch.update(challenge.ref, {
        achievement: achievement,
        progressComment: comment,
        updatedAt: timestamp,
      })
    }

    // batch.update(project.ref, {
    //   achievement: ``,
    //   reviewComment: comment,
    //   updatedAt: timestamp,
    // })
    // // let projectText = ``
    // // const projData = project.data()
    // // projectText += `>>>*${projData.title}*\n`
    // const challenges = await project.ref.collection(`challenges`).get()
    // for (const challenge of challenges.docs) {
    //   const chalData = challenge.data()
    //   console.log({ chalData: chalData })
    //   // let icon = ``
    // switch (chalData.status) {
    // case `completed`:
    //   icon = `:white_check_mark:`
    //   break
    // case `incompleted`:
    //   icon = `:x:`
    //   break
    // default:
    //   icon = `:black_square_button:`
    //   break
    // }
    // projectText += `${icon} ${chalData.name}\n`
  }
  // projectText += `${projData.description}`
  // projectText += comment
  // blocks.push({
  //   type: `section`,
  //   text: {
  //     type: `mrkdwn`,
  //     text: projectText,
  //   },
  // }
  // )

  await batch.commit()
  // // 成功をSlack通知
  // const msg: Message = {
  //   token: context.botToken,
  //   text: `プロジェクトを修正しました`,
  //   channel: body.view.private_metadata,
  //   user: user,
  // }
  // await app.client.chat.postEphemeral(msg as any).catch(err => {
  //   throw new Error(err)
  // })
})
