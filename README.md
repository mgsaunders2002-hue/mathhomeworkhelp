# Maths, Together
A calm, responsive maths homework helper for Grade 6 and 8 Dimensions learners and Grade 9 Alberta learners.

## What works
- Three learning pathways, keyboard-accessible controls, mobile layouts and a parent/student guide.
- Six original practice questions with hints, teaching steps, and deterministic numerical answer checking, including fractions.
- Typed question help through a server-side OpenAI Responses API connection when configured. No key goes into browser code.
- No student accounts, database, analytics or application-level question storage.

## Run
Requires Node 22+. No dependency install needed.

```
npm start
```
Visit http://localhost:3000. Practice examples work without a key. For personal questions, configure OPENAI_API_KEY and OPENAI_MODEL through your hosting provider's secret/environment settings. Choose an available text-capable Responses API model. Never commit the key or put it in public files. APP_ORIGIN must equal the deployed HTTPS origin for hosted browser requests. PORT defaults to 3000. MAX_REQUESTS_PER_HOUR defaults to 100 across this server process. This limit resets on restart; use a durable gateway limit for public production use.

## Hosting
Deploy as a Node web service with start command `npm start`. GitHub Pages can serve the interface by publishing the public directory, but cannot run the tutor server. A backend is required for arbitrary questions. This repository does not configure or claim a live deployment.

## Honest scope
This is a first working foundation, not a complete or certified curriculum product. Topic-by-topic alignment against the exact Dimensions editions and applicable Alberta school-year curriculum remains to be done. Grade 9 examples are original, unofficial practice; they do not claim a current PAT format. No textbook pages or answer keys are included. Photo input, diagrams generated from arbitrary questions, full curriculum practice banks, timed PAT simulations, and independent symbolic verification of arbitrary AI answers are not implemented.

AI answers are model-generated, not independently verified. Only built-in example answers have deterministic checking. Teacher review and a representative mathematics evaluation set are required before student release.

## Data and release preparation
The server forwards typed question/answer text to OpenAI using store:false; this is not a promise of zero provider retention. Do not enter personal information. The app keeps no conversation history. Review school consent/privacy requirements, provider processing policies and hosting logs before deployment to students. Add durable abuse controls and spending limits before opening unrestricted access. No tracking or external fonts are loaded.

## Checks
`npm test` runs HTTP integration tests against a temporary local server. No paid API call is made. API success responses still require testing with a configured account before release.
