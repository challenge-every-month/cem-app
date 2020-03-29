import { app } from '../initializers/bolt'
import { FieldValue, firestore } from '../initializers/firebase'
import { Challenge, Message, Project } from '../types/slack'

class Key {
  // eslint-disable-next-line no-useless-constructor
  constructor(public key: string) {}

  public isProjectTitle() {
    return this.key.includes(`projectTitle`)
  }

  public isYear() {
    return this.key.includes(`year`)
  }

  public isMonth() {
    return this.key.includes(`month`)
  }

  public isDescription() {
    return this.key.includes(`description`)
  }

  public isChallenge() {
    return this.key.includes(`challenge`)
  }
}

app.view(`cem_edit`, async ({ ack, body, view, context }) => {
  ack()

  const payload = (view.state as any).values

  // key情報を無理やり取得する
  for (const [keyTmp, value] of Object.entries(payload)) {
    const key = new Key(keyTmp)
    console.log(`${key}`)
    if (key.isProjectTitle()) {
      if (value instanceof Object) {
        const a = Object.values(value)
        const b = a[0].value
        console.log(b)
      }
    }

    if (key.isYear()) {
      if (value instanceof Object) {
        const a = Object.values(value)
        const b = a[0].selected_option.value
        console.log(b)
      }
    }

    if (key.isMonth()) {
      if (value instanceof Object) {
        const a = Object.values(value)
        const b = a[0].selected_option.value
        console.log(b)
      }
    }

    if (key.isDescription()) {
      if (value instanceof Object) {
        const a = Object.values(value)
        const b = a[0].value
        // TODO: undefinedだったらブランク
        console.log(b)
      }
    }

    if (key.isChallenge()) {
      console.log(`ちゃれんじ`)
      if (value instanceof Object) {
        const a = Object.values(value)
        const b = a[0].value
        console.log(b)
      }
    }
  }

  const user = body.user.id
  const projectTitle = payload.projectTitle0.projectTitle0.value
  const year = payload.year0.year0.selected_option.value
  const month = payload.month0.month0.selected_option.value
  const description: string = payload.description0
    ? payload.description0.description0.value || ``
    : ``

  const challengerRef = firestore.collection(`challengers`).doc(user)
  const projectsRef = firestore.collection(`projects`)
  const timestamp = await FieldValue.serverTimestamp()

  // firestoreからプロジェクトとサブコレクションのチャレンジを削除
  const batch = firestore.batch()
  // HACK:呼び出し元で二重発行している
  const projectDeleteQuery = firestore
    .collection(`projects`)
    .where(`challenger`, `==`, challengerRef)
    .where(`status`, `==`, `draft`)

  const projects = await projectDeleteQuery.get().catch(err => {
    throw new Error(err)
  })

  for (const project of projects.docs) {
    const projectDel = firestore.collection(`projects`).doc(project.id)
    const challengesRef = await projectDel.collection(`challenges`).get()
    challengesRef.docs.forEach(challenge => {
      batch.delete(challenge.ref)
    })
    batch.delete(projectDel)
  }

  // firestoreにプロジェクト作成

  const project: Project = {
    challenger: challengerRef,
    year: Number(year),
    month: Number(month),
    title: projectTitle,
    status: `draft`,
    description: description,
    updatedAt: timestamp,
    createdAt: timestamp,
  }
  const projectRef = await projectsRef.add(project).catch(err => {
    throw new Error(err)
  })

  // firestoreに挑戦を行ごとにパーズして保存
  for (const challengeName of payload.challenges0.challenges0.value.split(
    /\n/
  )) {
    if (challengeName === ``) {
      continue
    }
    const challenge: Challenge = {
      challenger: challengerRef,
      year: Number(payload.year0.year0.selected_option.value),
      month: Number(month),
      name: challengeName,
      status: `draft`,
      updatedAt: timestamp,
      createdAt: timestamp,
    }
    batch.set(projectRef.collection(`challenges`).doc(), challenge)
  }
  await batch.commit()
  // 成功をSlack通知
  const msg: Message = {
    token: context.botToken,
    text: `新規プロジェクト[${projectTitle}]を[${year}-${month}]に登録しました`,
    channel: body.view.private_metadata,
    user: user,
  }
  await app.client.chat.postEphemeral(msg as any).catch(err => {
    throw new Error(err)
  })
})
