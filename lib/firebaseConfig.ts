// Firebase client initialization (shared between server and client usage)
import { initializeApp, getApps, getApp } from 'firebase/app'
import { getFirestore } from 'firebase/firestore'
import { getStorage } from 'firebase/storage'

// Keep this file minimal and use the same NEXT_PUBLIC_* env vars as your admin panel.
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
}

// Quick runtime validation to fail fast with a clear message when required
// env vars are missing or clearly malformed. This prevents the generic
// Firestore "Invalid resource field value" error and makes the root cause
// obvious during local development.
;(function validateFirebaseConfig() {
  const required = [
    { key: 'NEXT_PUBLIC_FIREBASE_PROJECT_ID', val: firebaseConfig.projectId },
    { key: 'NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET', val: firebaseConfig.storageBucket },
  ]

  const missing = required.filter((r) => !r.val || String(r.val).trim() === '')
  if (missing.length) {
    const keys = missing.map((m) => m.key).join(', ')
    throw new Error(
      `Missing required Firebase env vars: ${keys}. Please set them in your .env.local using the exact NEXT_PUBLIC_* names from the Admin console (projectId should be the plain project-id, e.g. "my-project-id").`,
    )
  }

  // Basic sanity check: projectId should not include the "projects/" prefix
  if (String(firebaseConfig.projectId).includes('projects/')) {
    throw new Error(
      'NEXT_PUBLIC_FIREBASE_PROJECT_ID looks malformed (contains "projects/"). It should be the plain project id, for example: my-project-id',
    )
  }

  // Log non-sensitive bits to help debugging. Mask apiKey for safety.
  // These logs appear in the Next.js server console (dev or prod server logs).
  /* eslint-disable no-console */
  console.info('[firebaseConfig] projectId=', firebaseConfig.projectId)
  console.info('[firebaseConfig] storageBucket=', firebaseConfig.storageBucket)
  console.info('[firebaseConfig] apiKey=', firebaseConfig.apiKey ? firebaseConfig.apiKey.replace(/.(?=.{4})/g, '*') : null)
  /* eslint-enable no-console */
})()

// initializeApp is idempotent if we check existing apps first
const app = getApps().length ? getApp() : initializeApp(firebaseConfig)

const firestore = getFirestore(app)
const storage = getStorage(app)

export { app, firestore, storage }
