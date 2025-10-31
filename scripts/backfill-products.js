/**
 * Backfill script for Firestore to set placeholder values for missing
 * product/specification fields and add placeholder images for categories.
 *
 * Usage:
 * 1. Install firebase-admin in your project (if not installed):
 *    npm install firebase-admin
 *
 * 2. Set GOOGLE_APPLICATION_CREDENTIALS to point to your service account JSON file:
 *    $env:GOOGLE_APPLICATION_CREDENTIALS = 'C:\path\to\svc-key.json'    (PowerShell)
 *
 * 3. Run:
 *    node scripts/backfill-products.js
 *
 * NOTE: Run in a safe environment and review changes before committing.
 */

const admin = require('firebase-admin')
const path = require('path')

if (!process.env.GOOGLE_APPLICATION_CREDENTIALS) {
  console.error('Please set GOOGLE_APPLICATION_CREDENTIALS to your service account JSON file path.')
  process.exit(1)
}

admin.initializeApp({
  credential: admin.credential.applicationDefault(),
})

const db = admin.firestore()

async function backfillProducts() {
  const productsRef = db.collection('products')
  const snapshot = await productsRef.get()
  console.log(`Found ${snapshot.size} product docs.`)

  let count = 0
  for (const doc of snapshot.docs) {
    const data = doc.data()
    const updates = {}

    // Add placeholder weight/dimensions/material if missing
    if (data.weight === undefined) updates.weight = data.weight || null
    if (data.dimensions === undefined) updates.dimensions = data.dimensions || null
    if (data.material === undefined) updates.material = data.material || null
    if (data.color === undefined) updates.color = data.color || null
    if (data.careInstructions === undefined) updates.careInstructions = data.careInstructions || null

    // Ensure imageUrl exists (if not, keep imagePath or image or set a placeholder path)
    if (!data.imageUrl && (data.imagePath || data.image)) {
      // keep existing path in imagePath/image
      updates.image = data.image || data.imagePath || null
    }

    if (Object.keys(updates).length > 0) {
      await doc.ref.update(updates)
      count++
      console.log(`Updated ${doc.id}: ${JSON.stringify(updates)}`)
    }
  }

  console.log(`Backfilled ${count} product documents.`)
}

async function backfillCategories() {
  const col = db.collection('categories')
  const snap = await col.get()
  console.log(`Found ${snap.size} categories.`)

  let count = 0
  for (const doc of snap.docs) {
    const data = doc.data()
    const updates = {}
    if (!data.imageUrl && !data.imagePath) {
      // set a placeholder image url (you can upload a placeholder to storage and use its URL),
      // here we store a relative placeholder which the frontend can translate to a static asset.
      updates.image = data.image || '/images/collections/placeholder.jpg'
    }

    if (Object.keys(updates).length > 0) {
      await doc.ref.update(updates)
      count++
      console.log(`Updated category ${doc.id}: ${JSON.stringify(updates)}`)
    }
  }

  console.log(`Backfilled ${count} categories.`)
}

async function main() {
  try {
    await backfillProducts()
    await backfillCategories()
    console.log('Done.')
    process.exit(0)
  } catch (err) {
    console.error('Error running backfill:', err)
    process.exit(1)
  }
}

main()
