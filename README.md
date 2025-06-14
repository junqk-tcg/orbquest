# Orb Quest

A puzzle/action game set in a neon-lit, Tokyo-style dungeon where players navigate through levels to collect orbs.

## Premise

Orb Quest is a puzzle/action game where the player navigates through a series of levels to collect orbs. The game features a neon-lit, Tokyo-style dungeon aesthetic with a dark, atmospheric environment. Players must strategically navigate through levels while managing their time (in timed levels) and limited hits (when available).

## Core Mechanics

### Movement & Navigation
- Players can move through the level using arrow keys or WASD
- The goal is to reach the orb in each level
- Players cannot walk through walls or crates

### Crate System
- Crates are destructible obstacles in the level
- Players have a limited number of hits (shown as "Hits: X" in the UI)
- When a player moves into a crate:
  - The crate is destroyed
  - One hit is consumed
  - The player can then move through that space
- If a player runs out of hits, they can no longer destroy crates
- Crates are restored when restarting a level

### Level Structure
- Each level has a unique layout defined in JSON files
- Levels can have different:
  - Grid sizes (width and height)
  - Time limits (some levels are timed)
  - Number of available hits
  - Layout of walls, crates, and the orb
- The player starts at a designated position
- The orb is placed at a specific location that the player must reach

### Level Progression
- The game has 4 levels
- Players can:
  - Replay the current level
  - Progress to the next level upon completion
  - Return to the level selection screen
- Completed levels are marked with a checkmark in the level selection screen

### UI Elements
- Timer display for timed levels
- Hits counter showing remaining hits
- Level completion overlay with options to:
  - Replay the level
  - Go to the next level
  - Return to level selection
- Pause menu with options to:
  - Resume the game
  - Restart the level
  - Return to level selection

- Style the entire UI to match a rustic, neon-lit Tokyo-style dungeon aesthetic. The interface should feel slightly grimy and lived-in, like it belongs in a back-alley arcade or tech-noir basement. Use deep shadows, smoky gradients, dim textures, and glowing neon accents (magenta, cyan, green) against dark backgrounds. Fonts should be pixelated or futuristic with rough edges, and buttons should feel tactile—like lit-up panels or metal plates with glow trim.

All UI elements (menus, buttons, HUD, pop-ups) must feel immersive and in-universe, as if built from salvaged neon tech. Favor grungy overlays, low-fi animations (like CRT flicker or glitch effects), and cyberpunk dungeon visual language.

Style components using Tailwind CSS with custom themes or CSS modules, and ensure all future components automatically follow this design language. Persist and reuse shared UI primitives like GlowingButton, DarkPanel, NeonTitleBar, and so on.

Avoid modern app UI styles (rounded cards, sterile shadows). Instead, go for a cohesive gritty dungeon-tech tone with vivid glowing contrast and minimal polished chrome. It should feel like electricity is humming in the walls.


The game combines strategic planning (managing hits and finding optimal paths) with time management (in timed levels) to create engaging puzzle-solving challenges. The crate mechanic adds a layer of resource management, as players must decide when and where to use their limited hits to create paths to the orb.