# JusticeAlly

JusticeAlly is a multilingual AI legal guidance platform for Indian users. It helps people understand legal issues in plain language, chat with legal documents, generate first-draft legal documents, browse rights resources, and keep their work organized in one authenticated workspace.

The app is built as a full-stack Next.js product with Firebase authentication, server sessions, Cloudinary-backed document storage, Gemini-powered AI workflows, and a local legal corpus for retrieval-augmented responses.

## Features

- AI legal assistant with source-aware guidance for common Indian legal questions
- Document chat for uploaded legal files, notices, contracts, FIRs, and agreements
- Document simplification with plain-language summaries and follow-up Q&A
- Draft studio for complaints, notices, RTIs, and structured legal drafts
- Rights and legal library resources backed by curated local content
- Legal aid directory and emergency guidance flows
- Authenticated workspace for saved conversations, outputs, and document metadata
- Email-password and Google authentication through Firebase
- Server-side session handling with Firebase Admin cookies or signed-session fallback
- Cloudinary document vault integration for uploaded user files
- Responsive landing, tool, resource, auth, and workspace pages

## Tech Stack

- Framework: Next.js 15 App Router
- UI: React 19, TypeScript, Tailwind CSS
- Components: Radix UI primitives, shadcn-style components, Lucide icons
- Forms and validation: React Hook Form, Zod
- Authentication: Firebase Auth
- Server auth: Firebase Admin SDK, HTTP-only session cookies
- Database: Firestore plus optional MongoDB integration
- File storage: Cloudinary
- AI: Google Gemini API
- Document parsing: Mammoth, PDF tooling through `pdfjs-dist`
- Search and local resources: curated JSON legal corpus and Fuse.js

## Project Structure

```text
app/                         Next.js routes and API handlers
components/                  Shared UI, auth, legal workflow, and layout components
content/                     Local legal corpus and directory JSON data
hooks/                       Shared React hooks
lib/                         Auth, Firebase, AI, legal, RAG, document, and DB utilities
public/assets/pdfs/          Legal resource PDFs
scripts/                     Utility scripts such as knowledge seeding
styles/                      Global style entry points
```

## Main Routes

- `/` - public landing page
- `/login`, `/signup`, `/forgot-password` - account access
- `/workspace` - authenticated user workspace
- `/tools/legal-assistant` - AI legal assistant
- `/tools/document-simplifier` - document chat and simplification
- `/tools/document-generator` - legal draft studio
- `/resources/legal-library` - searchable legal resources
- `/resources/know-your-rights` - rights guide
- `/resources/templates` - document templates
- `/resources/directory` - legal aid directory
- `/emergency` - urgent legal guidance
- `/api-guide` - API and integration overview

## Environment Setup

Environment files are intentionally ignored by Git. Start from the example file:

```bash
cp .env.example .env.local
```

Fill in the values needed for the features you want to run:

- Firebase web config for client authentication
- Firebase Admin credentials for secure server sessions
- `GEMINI_API_KEY` for AI assistant, document, and draft workflows
- Cloudinary credentials for uploaded document storage
- `SESSION_SECRET` with at least 32 characters when using signed-session fallback
- Optional MongoDB values if using the MongoDB-backed paths

Never commit `.env`, `.env.local`, or any secret-bearing environment file.

## Local Development

Install dependencies:

```bash
npm install
```

Run the development server:

```bash
npm run dev
```

Open `http://localhost:3000`.

Run type checking:

```bash
npm run typecheck
```

Create a production build:

```bash
npm run build
```

Seed the legal knowledge base when Firestore is configured:

```bash
npm run seed:knowledge
```

## Workflow

1. A user signs in with email-password or Google.
2. The server creates a secure session through Firebase Admin or a signed fallback session.
3. The user asks a legal question, uploads a document, or starts a draft.
4. API routes validate input, retrieve relevant local legal context where applicable, and call Gemini.
5. Responses, generated artifacts, and uploaded document metadata are saved to the user workspace.
6. The user can return to the workspace to continue, export, or reuse previous work.

## GitHub Readiness Notes

- `.env`, `.env.local`, and local env variants are ignored.
- `.env.example` documents required configuration without secrets.
- Build artifacts, dependency folders, debug logs, and TypeScript cache files are ignored.
- The README avoids local machine paths and documents setup from a fresh clone.

## Legal Disclaimer

JusticeAlly provides general legal information and drafting assistance. It is not a substitute for advice from a licensed advocate who has reviewed the exact facts, documents, jurisdiction, and urgency of a matter.
