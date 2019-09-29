import * as admin from 'firebase-admin'

const serviceAccount = require(`../../serviceAccountKey.json`)

if (process.env.NODE_ENV === `production`) {
  admin.initializeApp({
    credential: admin.credential.applicationDefault(),
  })
} else {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
  })
}
export const firestore = admin.firestore()
export const FieldValue = require(`firebase-admin`).firestore.FieldValue
