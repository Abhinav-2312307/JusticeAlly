"use client"

import { getApp, getApps, initializeApp } from "firebase/app"
import { getAuth } from "firebase/auth"

export function getFirebaseClientApp() {
  const apiKey = process.env.NEXT_PUBLIC_FIREBASE_API_KEY
  const authDomain = process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN
  const projectId = process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID
  const storageBucket = process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET
  const messagingSenderId = process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID
  const appId = process.env.NEXT_PUBLIC_FIREBASE_APP_ID
  const measurementId = process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID

  if (!apiKey || !authDomain || !projectId || !storageBucket || !messagingSenderId || !appId) {
    return null
  }

  if (getApps().length > 0) {
    return getApp()
  }

  return initializeApp({
    apiKey,
    authDomain,
    projectId,
    storageBucket,
    messagingSenderId,
    appId,
    measurementId,
  })
}

export function getFirebaseClientAuth() {
  const app = getFirebaseClientApp()
  return app ? getAuth(app) : null
}
