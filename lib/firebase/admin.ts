import { cert, getApps, initializeApp } from "firebase-admin/app"
import { getAuth } from "firebase-admin/auth"
import { getFirestore } from "firebase-admin/firestore"
import { getFirebaseAdminConfig } from "@/lib/env"

export function getFirebaseAdminApp() {
  const config = getFirebaseAdminConfig()

  if (!config) {
    return null
  }

  if (getApps().length > 0) {
    return getApps()[0]!
  }

  return initializeApp({
    credential: cert({
      projectId: config.projectId,
      clientEmail: config.clientEmail,
      privateKey: config.privateKey,
    }),
  })
}

export function getFirebaseAdminAuth() {
  const app = getFirebaseAdminApp()
  return app ? getAuth(app) : null
}

export function getFirebaseAdminDb() {
  const app = getFirebaseAdminApp()
  return app ? getFirestore(app) : null
}
