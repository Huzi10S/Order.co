// One-time (or re-run anytime) script to load data/products.json into Firestore.
//
// Setup before running:
// 1. In Firebase Console -> Project Settings -> Service Accounts -> "Generate new private key".
//    This downloads a JSON file. Save it as serviceAccountKey.json in this project's root folder.
//    (This file is git-ignored already, never commit it.)
// 2. Run:  npm run seed
//
// This will create/update one Firestore document per product, using the "id" field
// from products.json as the document ID -- so re-running it is safe and just updates
// existing products instead of duplicating them.

import { readFile } from "fs/promises";
import { initializeApp, cert } from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";
import { createRequire } from "module";

const require = createRequire(import.meta.url);
const serviceAccount = require("../serviceAccountKey.json");

initializeApp({
  credential: cert(serviceAccount),
});

const db = getFirestore();

async function seed() {
  const raw = await readFile(new URL("../data/products.json", import.meta.url));
  const products = JSON.parse(raw);

  console.log(`Seeding ${products.length} products...`);

  const batchSize = 400; // Firestore batch write limit is 500
  for (let i = 0; i < products.length; i += batchSize) {
    const batch = db.batch();
    const chunk = products.slice(i, i + batchSize);
    for (const product of chunk) {
      const ref = db.collection("products").doc(product.id);
      batch.set(ref, product, { merge: true });
    }
    await batch.commit();
    console.log(`  Wrote ${Math.min(i + batchSize, products.length)}/${products.length}`);
  }

  console.log("Done. Products are now in Firestore under the 'products' collection.");
  process.exit(0);
}

seed().catch((err) => {
  console.error("Seed failed:", err);
  process.exit(1);
});
