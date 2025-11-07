# Museum Assets Structure

This directory contains all the media assets for the Past Lens museum experience.

## Directory Structure

```
public/
├── images/
│   ├── artifacts/      # High-quality images of museum artifacts
│   ├── stories/        # Images related to cultural stories
│   └── library/        # Images for library content
├── models/            # 3D models in GLB format
├── audio/            # Audio narrations and soundtracks
└── videos/           # Video content for guided tours
```

## File Naming Conventions

1. Artifacts:
   - Format: `[artifact-name]-[id].[ext]`
   - Example: `rosetta-stone-001.jpg`

2. Stories:
   - Format: `[culture]-[story-name].[ext]`
   - Example: `japanese-amaterasu.jpg`

3. Library:
   - Format: `[category]-[title].[ext]`
   - Example: `architecture-sacred-spaces.jpg`

4. 3D Models:
   - Format: `[artifact-name]-[id].glb`
   - Example: `sutton-hoo-002.glb`

5. Audio:
   - Format: `[type]-[name].[ext]`
   - Example: `story-gilgamesh.mp3`

6. Videos:
   - Format: `[type]-[location].[ext]`
   - Example: `tour-asian-gallery.mp4`

## Image Specifications

- Artifacts: 2000x2000px, JPEG/WebP
- Stories: 1920x1080px, JPEG/WebP
- Library: 1200x800px, JPEG/WebP

## 3D Model Guidelines

- Format: GLB (preferred) or GLTF
- Optimized for web viewing
- Maximum size: 10MB per model
- Texture resolution: 2K maximum

## Audio Guidelines

- Format: MP3
- Bitrate: 192kbps
- Sample Rate: 44.1kHz

## Video Guidelines

- Format: MP4 (H.264)
- Resolution: 1080p
- Aspect Ratio: 16:9
- Maximum Duration: 5 minutes per video