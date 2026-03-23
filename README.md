# JusticeAlly

JusticeAlly is a rebuilt Next.js legal guidance platform for Indian users. It replaces the original v0-style demo with a working full-stack architecture:

- Next.js App Router frontend and API routes
- Firebase Authentication on the client
- Firebase Admin session cookies on the server, with a signed-cookie fallback when only Firebase web auth is configured
- Firestore persistence for conversations and saved artifacts
- Cloudinary document vault storage for uploaded user files
- Gemini generation for assistant, simplification, and drafting
- RAG retrieval against a chunked legal knowledge corpus

## Stack

- `Next.js 15`
- `React 19`
- `Tailwind CSS`
- `Firebase` + `firebase-admin`
- `Gemini API`

## Environment

Copy `.env.example` to `.env.local` and fill in:

- `GEMINI_API_KEY`
- `NEXT_PUBLIC_FIREBASE_API_KEY`
- `NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN`
- `NEXT_PUBLIC_FIREBASE_PROJECT_ID`
- `NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET`
- `NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID`
- `NEXT_PUBLIC_FIREBASE_APP_ID`
- `NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID`
- `FIREBASE_ADMIN_PROJECT_ID`
- `FIREBASE_ADMIN_CLIENT_EMAIL`
- `FIREBASE_ADMIN_PRIVATE_KEY`
- `SESSION_COOKIE_NAME`
- `SESSION_SECRET`
- `CLOUDINARY_CLOUD_NAME`
- `CLOUDINARY_API_KEY`
- `CLOUDINARY_API_SECRET`
- `CLOUDINARY_FOLDER`

## Local development

1. Install dependencies:

```bash
npm install
```

2. Seed the Firestore knowledge base:

```bash
npm run seed:knowledge
```

3. Start the app:

```bash
npm run dev
```

## Main routes

- `/` marketing landing
- `/login`, `/signup`, `/forgot-password`
- `/workspace`
- `/tools/legal-assistant`
- `/tools/document-simplifier`
- `/tools/document-generator`
- `/resources/legal-library`
- `/resources/directory`
- `/resources/templates`
- `/resources/rights-guide`
- `/emergency`
- `/api-guide`

## Auth and storage

- Email/password, Google, and phone OTP sign-in are wired through Firebase Authentication.
- Successful login creates an HTTP-only workspace session.
- If Firebase Admin credentials are present, the app uses Firebase session cookies.
- If Firebase Admin is not configured, the app can still create signed sessions with `SESSION_SECRET`.
- User profile details, conversations, saved outputs, and uploaded document metadata are stored in Firestore.
- Raw user documents are uploaded to Cloudinary and linked back into the workspace vault.

## RAG flow

1. The seed corpus lives in [`content/legal-corpus.json`](/Users/abhinavsahu/Desktop/Project/justiceAlly/JusticeAlly/content/legal-corpus.json).
2. The seeding script chunks documents and stores embeddings in Firestore `knowledgeChunks`.
3. `/api/chat` embeds the user query, retrieves relevant chunks, builds a grounded prompt, calls Gemini, then stores the result.
4. The UI renders both the answer and the retrieved source cards.

## Notes

- The included corpus is a starter knowledge base, not a comprehensive law library.
- The platform is India-focused because the existing product content and legal workflows were India-specific.
- The app provides general legal information and drafting support. It does not replace a licensed advocate reviewing the exact facts.
