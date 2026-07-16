# FrameFit: Personalized Eyewear Recommender

## Project Overview
A web app where users upload a face photo, the app extracts facial features (face shape, skin tone, DBL), and generates personalized eyeglass frame recommendations.

## Tech Stack
- **UI:** React (.jsx single file artifact), Tailwind CSS
- **Face Detection:** face-api.js (TensorFlow.js based, runs client-side, free, no API key)
  - 68 face landmarks (eyes, nose, jaw, forehead)
  - Used for: DBL calculation, face shape detection
  - CDN: https://cdn.jsdelivr.net/npm/face-api.js
  - Models CDN: https://cdn.jsdelivr.net/npm/face-api.js/weights
- **Skin Tone Analysis:** Anthropic Vision API (free inside artifact, no key needed)
- **Recommendations:** Logic-based mapping (face shape to frame shape, skin tone to frame color)

## Key Features to Extract from Face
1. **Face Shape** (from jaw/forehead landmarks): oval, round, square, heart, oblong, diamond
2. **Skin Tone** (from Anthropic Vision API): fair, light, medium, olive, tan, dark
3. **DBL (Distance Between Lenses)** (from eye landmarks): measured in mm

## Recommendation Logic

### Face Shape to Frame Shape Mapping
- Oval: most frame shapes work, recommend rectangular, square, aviator
- Round: angular frames, rectangular, square, geometric
- Square: round, oval, rimless, thin frames
- Heart: bottom-heavy frames, round, light-colored, rimless
- Oblong: oversized, decorative, deep frames
- Diamond: oval, rimless, cat-eye, semi-rimless

### Skin Tone to Frame Color Mapping
- Fair: soft colors, pastels, silver, blue, pink, light tortoise
- Light: medium tones, rose gold, soft browns, burgundy
- Medium: warm tones, gold, honey, olive green, tortoise
- Olive: warm earth tones, gold, brown, warm red
- Tan: bold colors, dark tortoise, gold, warm metallics
- Dark: bold and bright colors, gold, silver, white, red, jewel tones

### Frame Size from Face Width
- Narrow: small frames (< 130mm face width)
- Medium: medium frames (130-145mm face width)
- Wide: large frames (> 145mm face width)

### DBL Recommendation
- Based on measured distance between pupils minus lens radius
- Typical range: 14mm to 24mm

## Phases

### Phase 1: Core UI and Image Upload [BUILD FIRST]
- Landing page with branding
- Upload button + drag-and-drop
- Image preview
- Responsive layout

### Phase 2: Face Analysis Engine
- Load face-api.js models (tinyFaceDetector, faceLandmark68Net)
- Detect face and extract 68 landmarks
- Calculate face shape from landmark geometry
- Calculate DBL from eye positions
- Call Anthropic Vision API for skin tone
- Display results with visual indicators

### Phase 3: Recommendation Engine
- Apply mapping logic (shape to frames, tone to colors)
- Suggest frame size from face width
- Recommend DBL range
- Display as styled recommendation cards

### Phase 4: Report Generation
- Summary combining analysis + recommendations
- Clean printable layout
- Show uploaded photo alongside results

### Phase 5 (FUTURE, not in current build):
- Blue light filtering preference questions
- UV coating options
- Lifestyle questionnaire (screen time, outdoor/indoor)
- Integrate answers into recommendations

## Architecture Notes
- Single-file React artifact (.jsx)
- All processing client-side (privacy friendly, no uploads to server)
- face-api.js models loaded from CDN
- Anthropic API called from within artifact (no key needed)
- State machine flow: Upload > Analyzing > Results > Report

## UI Flow
1. Landing screen with hero section and upload button
2. User uploads/drops image
3. Image preview shown, "Analyze" button
4. Loading state while face-api.js + Anthropic API run
5. Results screen: face shape, skin tone, DBL displayed
6. Recommendations screen: frame shape, size, color, DBL cards
7. Generate Report button for summary view

## File Structure
- claude.md (this file, project context)
- framefit.jsx (main app, single file)

## Important Decisions
- Using face-api.js because it is free, no API keys, runs in browser
- Using Anthropic Vision API inside artifact (free, handled internally)
- Skipping questionnaire features for now (Phase 5 future)
- Single file architecture for simplicity
- Client-side only for privacy (face images never leave the browser except for Anthropic API skin tone call)
