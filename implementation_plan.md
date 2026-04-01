# SYMBIOT 2026 — Interactive Countdown Web App

A premium, visually stunning countdown experience for the SYMBIOT 2026 hackathon kickoff ceremony. Designed to feel like a product launch — something people will record and post on Instagram.

## User Review Required

> [!IMPORTANT]
> **Tech Stack**: React + Vite + Tailwind CSS v3 + Framer Motion. You requested Tailwind — confirming this is acceptable.

> [!IMPORTANT]
> **Target Date**: April 24, 2026. The admin panel will allow editing this at runtime.

> [!WARNING]
> **Microphone Access**: The voice activation feature requires HTTPS or localhost. When deployed to production, ensure HTTPS is enabled. On projector/auditorium machines, browser microphone permissions must be granted.

> [!NOTE]
> **Sound Effects**: Will use Web Audio API to generate tick, success, and cheer sounds programmatically — no external audio file dependencies.

---

## Architecture Overview

```
e:\Symbiot Counter\
├── public/
│   └── logo.png                    # SYMBIOT 2026 logo (copied from Downloads)
├── src/
│   ├── main.jsx                    # App entry point
│   ├── App.jsx                     # Root component, routing & layout
│   ├── index.css                   # Global styles, Tailwind directives, custom animations
│   ├── components/
│   │   ├── Header.jsx              # Logo + tagline with glow animation
│   │   ├── CountdownRings.jsx      # Apple Watch-style animated rings (Days/Hours/Min/Sec)
│   │   ├── VoiceActivation.jsx     # Crowd scream mode (DESIGN → BUILD → DEPLOY)
│   │   ├── DecibelMeter.jsx        # Real-time audio waveform/radial meter
│   │   ├── ScheduleTimeline.jsx    # Friday/Saturday event timeline with mini countdowns
│   │   ├── EventCard.jsx           # Individual event card with icon, time, live countdown
│   │   ├── AdminPanel.jsx          # Hidden admin controls panel
│   │   ├── FloatingParticles.jsx   # Background particles reacting to sound
│   │   ├── Confetti.jsx            # Confetti burst effect
│   │   ├── ThemeToggle.jsx         # Dark/light mode toggle
│   │   └── PresentationMode.jsx    # Fullscreen presentation mode button
│   ├── hooks/
│   │   ├── useCountdown.js         # Countdown logic (with pause/reset)
│   │   ├── useAudioAnalyser.js     # Microphone stream + decibel analysis
│   │   └── useSoundEffects.js      # Web Audio API sound generation
│   └── utils/
│       ├── schedule.js             # Event schedule data
│       └── sounds.js               # Sound synthesis helpers
├── index.html
├── package.json
├── vite.config.js
├── tailwind.config.js
└── postcss.config.js
```

---

## Proposed Changes

### 1. Project Scaffolding

#### [NEW] Project initialization via Vite
- `npx -y create-vite@latest ./ --template react`
- Install dependencies: `tailwindcss@3`, `postcss`, `autoprefixer`, `framer-motion`, `canvas-confetti`
- Copy logo from `C:\Users\gouta\Downloads\SYMBIOT 2026 LOGO.png` → `public/logo.png`

---

### 2. Design System & Global Styles

#### [NEW] [index.css](file:///e:/Symbiot Counter/src/index.css)
- Tailwind directives (`@tailwind base/components/utilities`)
- CSS custom properties for the color palette:
  - Primary: `#00C2C2` → `#00AEEF` gradient
  - Background dark: `#0a0a1a` / Light: `#f0f4ff`
  - Glass: `rgba(255,255,255,0.05)` with backdrop blur
- Custom keyframe animations: `glow-pulse`, `ring-fill`, `float`, `particle-drift`
- Glassmorphism utility classes
- Google Font import: **Inter** (weights 300, 400, 600, 700, 900)

#### [NEW] [tailwind.config.js](file:///e:/Symbiot Counter/tailwind.config.js)
- Extended theme: custom colors, border-radius (`2xl` default), animation timing
- Dark mode: `class` strategy

---

### 3. Core Components

#### [NEW] [Header.jsx](file:///e:/Symbiot Counter/src/components/Header.jsx)
- Logo image centered at top with subtle scale animation on load
- Tagline "Design. Build. Deploy." with animated glowing text effect (CSS text-shadow animation)
- Framer Motion entrance animation (fade up + scale)

#### [NEW] [CountdownRings.jsx](file:///e:/Symbiot Counter/src/components/CountdownRings.jsx)
- **4 concentric SVG rings** (Days, Hours, Minutes, Seconds)
- Each ring: `<circle>` with `stroke-dasharray` / `stroke-dashoffset` animated via Framer Motion
- Ring colors: Days=cyan, Hours=blue, Minutes=teal, Seconds=bright cyan
- Center displays the largest unit; individual labels below each ring
- Smooth `spring` animation on every tick
- Subtle pulse/glow effect on second change using CSS box-shadow animation
- Numbers rendered in Inter 900 weight, large and elegant

#### [NEW] [VoiceActivation.jsx](file:///e:/Symbiot Counter/src/components/VoiceActivation.jsx)
- State machine: `IDLE → DESIGN → BUILD → DEPLOY → COMPLETE`
- Big centered text showing current word to scream
- Progress indicator (3 dots/circles showing which words are locked)
- When decibel crosses threshold → lock current word with success animation → advance
- After all 3: dramatic countdown reveal with confetti + cheer sound
- Controls: threshold slider, reset button, skip button (admin)

#### [NEW] [DecibelMeter.jsx](file:///e:/Symbiot Counter/src/components/DecibelMeter.jsx)
- Circular radial meter with animated arc
- Real-time frequency data visualization (waveform bars around the circle)
- Color transitions: low (blue `#1a4fd4`) → medium (cyan `#00C2C2`) → high (bright glow `#00ffff` with bloom)
- Smooth 60fps animation via `requestAnimationFrame`

#### [NEW] [ScheduleTimeline.jsx](file:///e:/Symbiot Counter/src/components/ScheduleTimeline.jsx)
- Two sections: Friday & Saturday
- Desktop: horizontal scrollable timeline with connecting line
- Mobile: vertical timeline with connecting line
- Each event rendered as `EventCard`

#### [NEW] [EventCard.jsx](file:///e:/Symbiot Counter/src/components/EventCard.jsx)
- Glass card with icon/emoji, event name, time, and live mini-countdown
- States:
  - **Past**: dimmed, checkmark
  - **Current/Ongoing**: cyan border glow + slight scale up (1.05)
  - **Next upcoming**: pulse border animation
  - **Future**: default glass style
- Framer Motion stagger entrance

#### [NEW] [AdminPanel.jsx](file:///e:/Symbiot Counter/src/components/AdminPanel.jsx)
- Hidden toggle button (small gear icon, bottom-right corner)
- Slide-out panel with:
  - Date/time picker for main countdown target
  - Editable event schedule times
  - Decibel threshold slider
  - Start/Pause/Reset countdown buttons
  - Skip voice activation button
- Glassmorphism panel with backdrop blur

#### [NEW] [FloatingParticles.jsx](file:///e:/Symbiot Counter/src/components/FloatingParticles.jsx)
- Canvas-based particle system (lightweight, 60fps)
- ~50 particles floating with subtle drift animation
- React to sound input: particle speed/size increases with decibel level
- Particles are soft glowing circles in cyan/blue tones

#### [NEW] [Confetti.jsx](file:///e:/Symbiot Counter/src/components/Confetti.jsx)
- Wrapper around `canvas-confetti` library
- Triggered programmatically after voice activation completes
- Cyan/white/blue color scheme confetti

#### [NEW] [ThemeToggle.jsx](file:///e:/Symbiot Counter/src/components/ThemeToggle.jsx)
- Sun/moon icon toggle button
- Toggles `dark` class on `<html>` element
- Smooth transition on theme change
- Persists preference in localStorage

#### [NEW] [PresentationMode.jsx](file:///e:/Symbiot Counter/src/components/PresentationMode.jsx)
- Fullscreen button using Fullscreen API
- Hides non-essential UI in presentation mode
- Optimized layout for large projector screens

---

### 4. Custom Hooks

#### [NEW] [useCountdown.js](file:///e:/Symbiot Counter/src/hooks/useCountdown.js)
- Accepts target date, returns `{ days, hours, minutes, seconds, isPaused, pause, resume, reset, setTarget }`
- Uses `requestAnimationFrame` for smooth updates
- Supports pause/resume/reset

#### [NEW] [useAudioAnalyser.js](file:///e:/Symbiot Counter/src/hooks/useAudioAnalyser.js)
- Requests microphone permission
- Creates `AudioContext` + `AnalyserNode`
- Returns `{ decibel, frequencyData, isListening, start, stop }`
- Computes RMS decibel level from frequency data
- Cleanup on unmount

#### [NEW] [useSoundEffects.js](file:///e:/Symbiot Counter/src/hooks/useSoundEffects.js)
- Web Audio API oscillator-based sounds:
  - `tick()`: short, subtle click (50ms sine wave)
  - `success()`: ascending two-tone chime
  - `cheer()`: white noise burst with filter sweep (simulated crowd)
- No external audio files needed

---

### 5. Utilities

#### [NEW] [schedule.js](file:///e:/Symbiot Counter/src/utils/schedule.js)
- Exports event schedule array with structure:
  ```js
  { day: 'Friday', emoji: '📝', name: 'Registration', time: '8:30 AM', dateTime: '2026-04-24T08:30:00' }
  ```
- All events from the provided schedule

#### [NEW] [sounds.js](file:///e:/Symbiot Counter/src/utils/sounds.js)
- Low-level Web Audio API helpers for sound synthesis

---

## Open Questions

> [!IMPORTANT]
> 1. **Deployment**: Do you plan to deploy this on Vercel (like your existing symbiotvvce.in site) or host it separately?
> 2. **Admin Password**: Should the admin panel be password-protected, or is the hidden toggle sufficient security?
> 3. **Event Dates**: The schedule shows Friday/Saturday — should I use **April 24 (Friday)** and **April 25 (Saturday), 2026** as the exact dates for the schedule events?

---

## Verification Plan

### Automated Tests
- Run `npm run build` to verify no compilation errors
- Run `npm run dev` and test in browser

### Manual Verification (Browser Testing)
1. **Visual**: Open in browser, verify glassmorphism, animations, gradient backgrounds, floating particles
2. **Countdown Rings**: Verify smooth ring animation, numbers update, pulse effects
3. **Voice Activation**: Test microphone access, verify decibel meter responds to sound, test word locking flow
4. **Schedule Timeline**: Verify horizontal/vertical layouts, current event highlighting, mini countdowns
5. **Admin Panel**: Test all controls (date edit, threshold, start/pause/reset/skip)
6. **Theme Toggle**: Verify dark/light mode switching
7. **Presentation Mode**: Test fullscreen, verify layout adapts
8. **Responsiveness**: Test mobile, tablet, desktop, and large screen layouts
9. **Performance**: Verify 60fps animations in Chrome DevTools Performance tab
