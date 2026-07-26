# Supreme Sanitary — Order App

Two pages:
- `/` — customer catalog & ordering page (no login needed)
- `/shop` — shop owner dashboard (login needed): live incoming orders, "Copy for Excel", product management, price-visibility setting

## 1. Install dependencies

```
npm install
```

## 2. Connect Firebase (client side)

Copy `.env.local.example` to `.env.local`:

```
cp .env.local.example .env.local
```

Open `.env.local` and paste in the values from:
**Firebase Console → Project Settings (gear icon) → Your apps → the web app → SDK setup and configuration**

## 3. Turn on Email/Password login for the shop owner

**Firebase Console → Authentication → Sign-in method → enable "Email/Password"**
Then **Authentication → Users → Add user** — create one login (email + password) for your uncle. That's what he'll use at `/shop`.

## 4. Publish the security rules

**Firebase Console → Firestore Database → Rules tab** → paste in the contents of `firestore.rules` from this project → Publish.

This makes sure customers can browse products and place orders, but only your logged-in uncle can view orders or edit products.

## 5. Load the starting product list into Firestore

This uses a separate admin key (different from the public config above) so it only needs to be done once from your computer, not from the deployed website.

1. **Firebase Console → Project Settings → Service Accounts → Generate new private key** — this downloads a JSON file.
2. Rename it to `serviceAccountKey.json` and put it in the root of this project (it's already git-ignored, so it will never be committed or uploaded).
3. Run:
   ```
   npm run seed
   ```
   This uploads all 293 products from `data/products.json` into Firestore. Safe to re-run anytime — it updates instead of duplicating.

## 6. Run locally to check everything works

```
npm run dev
```
Visit `http://localhost:3000` for the customer page, and `http://localhost:3000/shop` for the dashboard.

## 7. Deploy

Push this project to your existing git repo connected to Vercel. Then in **Vercel → Project → Settings → Environment Variables**, add the same 6 `NEXT_PUBLIC_FIREBASE_...` values from your `.env.local`. Redeploy, and you're live.

## Notes

- Prices are optional. Turn them on for customers anytime from `/shop` → Settings.
- Adding a new product from `/shop` → Products lets you also add size options (comma separated) so it shows the same dropdown-style selector as the imported products.
- "Copy for Excel" copies a tab-separated list of the order's items — pasting it into Excel will automatically place item name, quantity, and unit into their own columns.
