Nice — this is a great point to finish strong. I read your progress report and your existing 3D components (dome/sphere gallery, light-rays, particle field, 3D model viewer scaffold, cursor-following cards, infinite ball menu) — excellent foundation. Below I’ll **think like a senior engineer** and give you a thorough, actionable **MCP** (Models / Controllers / Providers) spec for all remaining features you asked for — focused on using your 3D features to deliver a premium, immersive, learnable virtual museum.

I’ll also include the frontend 3D component mapping, data & media pipeline details, events & UX flows, deployment/infra notes, testing/acceptance criteria, and a prioritized task list so you can implement and ship.

---

# MCP SPEC — Remaining Features (artifact archives, AI explain, storytelling avatars, similarity gallery, media & transcripts, immersive UX)

> Note: “MCP” sections are grouped by feature. Each feature has: Models (DB/schema), Controllers (API endpoints + behavior), Providers (external services / background workers / platform glue). After MCP sections you’ll find Frontend 3D component mapping, data flow, media pipeline, UX & interaction flows, acceptance criteria and an ordered implementation checklist.

---

## 1) Feature: Artifact Archive & Detail (core archival UX)

### Models

* **Artifact**

  * `_id`, `slug`, `title`, `community`, `category` (song/story/video/object), `shortDescription`, `longDescription`, `dateCollected`, `provenance`, `tags`, `visibility` (public/restricted)
  * `media` array: `{ id, type: image|audio|video|3d, url, thumbnail, duration, hlsUrl?, captionsVtt?, transcriptId?, glbUrl?, ktx2_url }`
  * `embeddingsId` optional (vector DB id)
  * `related` [] (manual related items)
  * `layoutPos` (x,y,z / scene id)
  * `consentDocs` metadata, `licenses`
  * `createdBy`, `createdAt`, `updatedAt`
* **Transcript**

  * `_id`, `artifactId`, `text`, `segments` [{start, end, text}], `language`, `generatedBy`, `createdAt`
* **MediaAsset**

  * `_id`, `artifactId`, `type`, `sourceUrl`, `processedUrls` (mp4, hls, thumbnails), `status` (pending/processing/ready/failed), `duration`, `size`, `checksum`
* **ArtifactIndex** (for fast search metadata)

  * `artifactId`, `title`, `community`, `tags`, `shortDescription`, `embeddingVectorId`
* **DownloadLog** / **AccessLog**

### Controllers (REST)

* `GET /api/artifacts` — list, filters, pagination, optional `sceneOnly=true`.
* `GET /api/artifacts/:id` — detail: artifact + media, pre-signed URLs (if private), transcript reference, embeddings summary.
* `POST /api/artifacts` — curator create (accepts metadata + placeholder).
* `PUT /api/artifacts/:id` — update meta & layout.
* `DELETE /api/artifacts/:id` — admin only.
* `GET /api/artifacts/:id/media/:assetId` — proxy/redirect pre-signed URL or CDN URL.
* `GET /api/artifacts/:id/similar?topK=8` — returns similarity results (vector query + optional LLM re-rank).

### Providers

* **StorageProvider** — S3 / Spaces for processed media, LQIP, GLB, thumbnails, KTX2 textures.
* **CDNProvider** — Cloudflare / CloudFront for low-latency assets.
* **VectorDBProvider** — Pinecone / Weaviate for embeddings and similarity queries.
* **DB** — MongoDB Atlas (artifact metadata), Postgres optional for relational data.
* **AuthProvider** — JWT + Role management (public, user, curator, admin).

---

## 2) Feature: AI Explain / Compare / Contextual Knowledge

### Models

* **AIInsight**

  * `_id`, `artifactId`, `promptSummary`, `response`, `model`, `tokensUsed`, `cachedUntil`, `createdAt`, `sources` (links)
* **PromptTemplate** — stored templated prompts per community / artifact category.

### Controllers

* `POST /api/ai/explain` — body `{ artifactId, mode: 'short'|'detailed'|'compare', options }`

  * server: fetch artifact + transcript + provenance → compose prompt → either return cached `AIInsight` (if recent) or call AI provider → store `AIInsight` → return.
* `POST /api/ai/compare` — compare two or more artifacts (returns bullet points, tensions, cultural context).
* `POST /api/ai/generateImage` — for curator/preview of generated images (with watermark + provenance).
* `GET /api/ai/insights/:artifactId` — recent insights.

### Providers

* **LLMProvider** — OpenAI/Google Gemini wrapper. Include:

  * prompt templates
  * rate limit, retry/exponential backoff for 503s
  * response caching
  * provenance & safety tagging (always return sources)
* **EmbeddingProvider** — to build embedding for artifact texts and transcripts (run at ingestion).
* **AIService** — orchestrates retrieval + LLM call + caching + logs.

---

## 3) Feature: Storytelling (3D story avatars + voices + immersive narration)

### Models

* **Story**

  * `_id`, `title`, `artifactId?`, `type` (oralHistory|folktale|ceremony), `text`, `audioUrl`, `videoUrl`, `language`, `narrators` [voice profiles], `duration`, `transcriptId`
* **VoiceProfile**

  * `_id`, `name`, `provider` (webspeech|openai-tts|polly), `locale`, `gender`, `sampleUrl`, `premiumAllowed`

### Controllers

* `GET /api/stories` — paginate/list
* `GET /api/stories/:id` — story + narrator options + transcript
* `POST /api/stories` — curator create/upload
* `POST /api/stories/:id/tocAudio` — on-demand TTS generate and store (returns URL)

### Providers

* **TTSProvider** — OpenAI TTS / AWS Polly / Azure TTS, plus fallback to browser SpeechSynthesis for client-side playback.
* **AvatarAnimationProvider** — stores pre-baked lip-sync animations or uses runtime lip-sync (Rhino, Papagayo, or animation blending)—for web, prefer precomputed visemes or use a lightweight library to map audio amplitude to mouth blend shapes.
* **StoryPlayer** — orchestrates synchronized playback: audio + 3D avatar animations + ambient FX + camera framing.

---

## 4) Feature: Similarity & Related Items Gallery

### Models

* (use `Embeddings` stored in VectorDB)
* **SimilarityCache** — `artifactId -> [artifactId,score]`, TTL

### Controllers

* `GET /api/search?query=...` — returns lexical + semantic scored items
* `GET /api/artifacts/:id/related` — returns vector search topK and re-ranked responses
* `POST /api/reindex` — re-generate embeddings for an artifact (curator triggered)

### Providers

* **VectorDB** — queries for topK
* **RankerService** — optional LLM re-ranker to improve UX (shorter list)
* **SearchAPI** — composite results of text-index search + vector search

---

## 5) Feature: Audio (recording, transcripts, waveform), Playback & Accessibility

### Models

* `Transcript` (see above)
* `Waveform` — stored waveform image URL, segments for highlighting
* `Caption` — vtt files associated with media

### Controllers

* `POST /api/transcribe` — upload audio blob -> worker -> Whisper -> return transcript id
* `GET /api/transcripts/:id` — fetch transcripts & segments
* `GET /api/media/:id/waveform` — serve waveform image for the player (or precomputed data for visualization)
* `POST /api/caption/generate` — create VTT from transcript

### Providers

* **ASRProvider** — Whisper API or local; accepts audio, returns transcript + timestamps
* **MediaWorker** — background job (BullMQ) to run ASR + generate waveforms (ffmpeg + waveform.js) + captions + embeddings
* **WebAudio / Player** — front-end audio player with waveform and time-coded transcript highlighting and spatialized audio (Three.js positional audio)

---

## 6) Feature: Curator Tools & Layout Editor (drag/drop in 3D)

### Models

* **Layout** — `layoutId`, `sceneId`, `items`: [{artifactId, position, rotation, scale, hotspotMeta}], `author`, `published`
* **ModerationTask**

### Controllers

* `GET /api/layouts/:sceneId`
* `POST /api/layouts` (save/preview)
* `POST /api/layouts/:id/publish` (trigger publishing, update artifact layout positions)
* `POST /api/moderation/:artifactId` — queue

### Providers

* **RealtimeProvider** — for collaborative editing (optional) using WebSocket or Pusher
* **Worker** — to validate media/consent

---

## 7) Feature: Guided Tours, Camera Spline, Teleport and Accessibility

### Models

* **Tour**

  * `tourId`, `title`, `steps`: [{artifactId, cameraPos, cameraTarget, duration, narrationId}], `isPremium`
* **PlayState** — persisted user position / visited artifacts

### Controllers

* `GET /api/tours`
* `POST /api/tours/:id/start` — server returns timed script for front-end
* `POST /api/tours/:id/logVisit` — analytics

### Providers

* **SyncService** — for multi-user synchronized guided tours (optional)
* **AnalyticsProvider** — log events for conversions / engagement

---

# FRONTEND — 3D COMPONENT MAP (how backend + models map to 3D UI)

For each component give behavior, data needed, events.

### Components

* `DomeGallery` (existing)

  * Props: `sceneId`, `artifacts[]`
  * Behavior: spherical gallery with hotspots on inner surface; supports rotate (pointer drag) and kinetic scrolling; on hover spotlight illumination via `LightRays` component; clicking emits `onSelect(artifactId)`.
  * Optimizations: LOD for textures, lazy texture loading.

* `LightRays` (existing)

  * Behavior: follows cursor/reticle, projected onto dome; soft blend, enables visual focus.
  * Hook into `onFocus` to increase beam intensity.

* `ParticleField` (existing)

  * Subtle parallax; responds to camera motion and story events (particles pulse with beat during storytelling).

* `ArtifactHotspot` (new)

  * Uses `InteractiveArtifact` concept: plane with texture, `Html` label, `onHover`, `onClick`.
  * Adds `positionalAudio` if artifact has audio.

* `ModelViewer` (existing scaffold)

  * Load GLB/GLTF via Drei `useGLTF`, apply Draco loader if needed; show controls (zoom, rotate), bounding box, full-screen.

* `DetailPanel` (shadcn UI)

  * Shows artifact metadata, media player, transcript (with highlight on playback), AI Explain button, related gallery.
  * Buttons: Play story (opens `StoryTeller`), AI Explain (calls `POST /api/ai/explain`), Download.

* `StoryTeller` (new, 3D + audio)

  * Props: `storyId`, `voiceProfileId`, `avatarModelId`
  * Renders a small scene: animated 3D avatar (a stylized grandma/grandfather), synchronized lip-sync to TTS audio, ambient lighting, camera framing zoom in/out, particle/beam emphasis during emotional beats.
  * Implementation: play TTS audio via Audio element or positional audio; animate avatar blendshapes based on amplitude-based viseme mapping or precomputed viseme cues from backend when generating TTS.

* `SimilarityCarousel`

  * 3D carousel or planar tile list — pulls from `GET /api/artifacts/:id/related`.

* `InfiniteMenu` (existing)

  * Use to let users pick filters or quick-jump to communities; hover selects item as you described.

* `Waveform` & `TranscriptViewer`

  * Waveform renders using precomputed data; click on waveform seeks audio; transcript segments map to times and highlight.

* `TourController`

  * Buttons: start tour, pause, next step, re-center; starts camera spline using `gsap`/`react-three-fiber` animation along prepared `Tour` path.

---

# INTERACTIONS & DATA FLOW (event sequences)

### A. Select artifact from dome -> open detail panel (core flow)

1. User hovers hotspot → `LightRays` intensifies and `ParticleField` pulses.
2. Click → `DomeGallery` emits `onSelect(artifactId)`.
3. Frontend prefetch: `GET /api/artifacts/:id` (if not prefetched) → load textures and smaller preview media.
4. Animate camera to focus (lerp) using spline or camera controls.
5. Display `DetailPanel` with metadata, thumbnails, Play Audio button.
6. If audio/story exists, prefetch transcript `GET /api/transcripts/:id` and waveform.
7. User clicks AI Explain → `POST /api/ai/explain` returns `AIInsight` → show in panel and offer TTS read (client or server generated).
8. Option: user chooses voice and clicks “Play Story” → `StoryTeller` component loads TTS (if not pre-generated), plays audio with avatar animation and ambient visuals.

### B. Voice query (STT → AI explain)

1. User toggles mic component (MediaRecorder capture) → sends blob to `POST /api/transcribe`.
2. Backend runs Whisper → returns text; create/append to conversation history.
3. Frontend sends single string that includes compressed context (recent messages + latest user question) to `POST /api/ai/explain` or general chat endpoint.
4. Backend returns natural language answer → frontend optionally TTS speaks answer (via browser or server TTS).
5. UI highlights related artifacts if mentioned.

### C. Similarity search flow

1. User hits “Similar” → frontend calls `GET /api/artifacts/:id/related`.
2. Backend does vector query → returns IDs → frontend fetches metadata and displays `SimilarityCarousel`.
3. Clicking a similar item repeats flow A.

---

# MEDIA PIPELINE (ingest → production)

1. **Upload**

   * Curator uploads file(s) via signed POST to `POST /api/upload`.
   * Backend saves to raw bucket (S3 private).
2. **Enqueue job**

   * Worker (BullMQ) gets job:

     * **Images**: generate multiple sizes, webp, LQIP, upload thumbnails.
     * **Audio**: normalize, generate MP3/OGG and HLS? (HLS mainly for video), generate short preview clip, run Whisper for transcript, produce waveform PNG/data, generate VTT captions.
     * **Video**: transcode MP4 + HLS variants, extract thumbnails, capture preview clip, generate captions via ASR.
     * **3D models**: run gltf-pipeline (draco compress), generate GLB, create KTX2 textures.
3. **Embeddings**

   * Combine metadata + transcripts → create embeddings → store in VectorDB; record vector id in artifact.
4. **Publish**

   * Update artifact `media` records to `status=ready`, create CDN distribution and caching headers.
5. **Optional**: run AI insight generation (background) for quick first-run explain preview.

**Tools**: FFmpeg, whisper (API or local), gltf-pipeline + Draco, imagemin + sharp, elastic transcode, Pinecone/Weaviate.

---

# PERFORMANCE & OPTIMIZATIONS (3D specific)

* Use texture atlases or KTX2 compressed textures for mobile.
* LOD for 3D models; use bounding box placeholders until loaded.
* Use `use-asset` or texture caching; prefetch next hotspots on camera path.
* Limit canvas resolution on low-power devices (devicePixelRatio cap).
* Use `Suspense` + placeholder while models/textures load; show shimmer LQIP.
* Spatial audio: WebAudio PannerNode for positional audio; fall back to stereo on unsupported devices.
* Debounce heavy interactions (AI calls, re-renders).
* Prefetch AI explanation small summary for hotspots when user hovers for >300ms.

---

# ACCESSIBILITY & UX

* Keyboard navigation: allow artifact selection via arrow keys and Enter.
* Screen-reader: DetailPanel has ARIA roles, transcripts, captions.
* Reduced motion toggle: disable extra camera motion.
* Subtitles & transcripts for every media; language toggles.
* High-contrast theme option.

---

# ACCEPTANCE CRITERIA (how you’ll know each feature is done)

* **Artifact Detail:** On click, the detail panel opens within 500–1000ms of selection; all media player controls work; transcript/captions load and sync with playback.
* **AI Explain:** 90% of calls return within 6s (for small payloads); returned response includes a `sources` array and a `confidence` score.
* **Story Avatar:** TTS audio plays and avatar lip-syncs (audio-driven) with acceptable mouth movement; user can switch voice profiles and playback restarts with chosen voice.
* **Similarity:** Similar items are semantically relevant (manual QA: top 5 contain related cultural items in 4/5 cases).
* **Performance:** Initial scene -> interactive within 2.5s on modern desktop; mobile target under 4s; main 3D frame rate >= 30fps after LOD.
* **Security:** Media downloads use signed URLs and respect artifact `visibility`.

---

# PRIORITIZED IMPLEMENTATION ROADMAP (concrete steps)

(Ordered by priority; do small PRs and QA for each step.)

### Phase A — Core Archive + 3D Integration (high priority)

1. Implement `Artifact` + `MediaAsset` models + API endpoints (`GET /api/artifacts`, `GET /api/artifacts/:id`).
2. Implement media pipeline worker skeleton and example job for images (sharp conversions) and audio (ffmpeg trim).
3. Wire `DomeGallery` hotspots to `GET /api/artifacts/:id` to open `DetailPanel`.
4. Implement Transcript model + `POST /api/transcribe` (Whisper) hooking into the worker.
5. Add `DetailPanel` UI: images, audio player, transcript viewer, download (signed URL).
6. Add embedding generation on ingestion (text + transcript) and store vectorId.

### Phase B — AI & Similarity

1. Implement `POST /api/ai/explain` (LLM wrapper) with caching and provenance.
2. Implement `GET /api/artifacts/:id/related` using VectorDB.
3. Wire AI Explain button in UI, show results in `DetailPanel`.

### Phase C — Storytelling Avatars & TTS

1. Add `Story` model and Story CRUD.
2. Implement TTS provider (server-side generation and cache).
3. Add `StoryTeller` component: play TTS audio + simple avatar (blendshape or amplitude-driven mouth).
4. Add voice profile selection in UI.

### Phase D — Curator Tools & Layout Editor

1. Implement Layout model + `POST /api/layouts`.
2. Build a 3D layout editor UI (drag/place hotspots) and save positions.

### Phase E — Polish & Advanced

1. Waveform UI, caption generation, time-coded transcript highlight
2. Guided tours, purchase gating and Stripe integration
3. Performance tuning, prefetch/LOD improvements, offline caching (PWA)

---

# TESTING & QA

* Unit tests for controllers (Jest + Supertest)
* Integration tests for worker jobs (simulate upload -> process -> artifact ready)
* E2E with Playwright for core user journeys: landing -> select artifact -> play story -> AI explain
* Performance tests for 3D (Lighthouse + custom fps checks)
* Accessibility checks with axe

---

# DEPLOYMENT & INFRA (quick notes)

* Frontend (Next.js): Vercel (edge + serverless functions) or Netlify (if static)
* Backend + Workers: Railway / Render (long-running), as Vercel serverless can be tricky for Prisma/long-running workers
* Storage: S3 + CDN (Cloudflare)
* Vector DB: Pinecone (or Weaviate if self-host)
* Queue: Redis + BullMQ

---

# DEV TIPS & IMPLEMENTATION NOTES (practical)

* Prefetch small text metadata for all artifacts in the scene to create instant tooltip info on hover; load heavy assets on click.
* Use incremental worker pipeline: show `status=processing` on artifacts so UI shows loader cards.
* For avatar lip-sync: if budget limited, use amplitude-based mouth movement and head nods — cheap and effective.
* For TTS caching: generate on-demand and persist TTS audio keyed by `{storyId + voiceProfile}` to avoid re-generation cost.
* Use server-side generated `index.json` (artifact catalog) for initial scene load instead of requesting thousands of API requests.

---

# Deliverables I can generate next (pick one)

* A full set of **Mongoose/Prisma schema snippets** for all Models above.
* A set of **Express controller templates** for the key endpoints: artifacts, ai/explain, transcribe, media upload.
* A **React-Three-Fiber + Drei** pattern for DomeGallery -> hotspot -> camera focus -> DetailPanel (tsx).
* The **worker job** example (BullMQ + ffmpeg + whisper call + embedding generation).
* A **step-by-step PR checklist** (detailed task list you can assign to sprints).

---

If you want me to continue, tell me which deliverable to produce first and I’ll generate the code/schema/controllers or the TSX 3D glue code next. Ready to produce the exact code for any of the pieces above.
