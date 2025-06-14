# 🌀 Orbquest: A Modular Challenge Platformer

**Orbquest** is a solo, level-based sci-fi puzzle-action game.  
The player's objective in every level is the same: **Reach the Orb**.  
However, the **rules for how to succeed or fail change in each level** — creating a fast, evolving, and replayable experience.

---

## 🎮 Game Overview

- **Genre**: Action / Puzzle / Platformer (Top-down or 2D hybrid)
- **Play Style**: Single-player, short levels (20–60 seconds each)
- **Core Goal**: Touch the Orb to win the level
- **Core Twist**: Each level has different mechanics, hazards, and win/fail conditions

---

## 🧠 Core Loop

1. Enter new level
2. Brief prompt: "Reach the orb, but don't step on a mine."
3. Move your character using arrows or WASD
4. Reach the orb to win – fail and restart instantly
5. Progress unlocks next level with new twist

---

## 🧱 Mechanics & Features

### Player
- 4-direction or 8-direction movement
- Optional: Dash, jump, or interact button (for later levels)

### Orb
- Static or dynamic (can teleport, flee, hide, etc.)
- Always the win target

### Level Layout
- One-screen arenas or mazes
- Built from tiles and interactable objects
- Defined via tilemap and JSON rule files

---

## 🧩 Level Types

| Type          | Description |
|---------------|-------------|
| **Standard**   | Walk to orb – no traps |
| **Timer**      | Reach orb within X seconds |
| **Minefield**  | Mines are placed – touch = fail |
| **Maze**       | Multiple paths – only one leads to orb |
| **Limited Input** | Player can only move 3 times |
| **Stealth**    | Enemy patrols – getting caught resets |
| **Switch Puzzle** | Press buttons to unlock orb path |
| **Disappearing Floor** | Walked tiles vanish |
| **Darkness**   | Fog of war limits visibility |
| **Gravity Flip** | Up is down, left is right |
| **Moving Orb** | Orb teleports or runs away from player |
| **Combat-lite**| Defeat enemy guarding orb |
| **Memory**     | Solve a sequence before orb activates |

---

## 🧪 Sample Level Ideas

```text
Level 1: Simple walk to orb
Level 2: Reach the orb in 5 seconds
Level 3: Maze with fake doors
Level 4: Move only 3 times
Level 5: Reverse controls
Level 6: Avoid floor mines
Level 7: Enemy chases you
Level 8: Use pressure switch to open gate
Level 9: Limited vision – orb is hidden
Level 10: Teleporting orb with decoys


UPDATE THIS READ.ME WITH ANY MORE CONTEXT, GAMEPLAY, OR DESIGN CHANGES WE AGREE UPON
```

## 🌟 Progression & Rewards

### Meta Progression
- **Orb Collection**: Each completed level adds a unique orb to your collection
- **Skill Tree**: Unlock new abilities that can be used in specific level types
- **Level Mastery**: Complete bonus objectives for additional rewards
  - Speed run challenges
  - No-damage runs
  - Perfect score achievements

### Difficulty Scaling
- **Adaptive Difficulty**: Game learns from player performance
- **Challenge Modes**: Optional harder versions of completed levels
- **Daily Challenges**: New level variations each day

## 🎨 Visual & Audio Design

### Art Style
- **Minimalist Sci-Fi**: Clean, geometric shapes with neon accents
- **Color Coding**: Different mechanics have distinct color schemes
- **Visual Feedback**: Clear indicators for success/failure states

### Sound Design
- **Ambient Tones**: Atmospheric background music
- **Mechanical Sounds**: Distinct audio cues for different interactions
- **Success/Failure**: Satisfying sound effects for level completion

## 🔄 Advanced Mechanics

### Orb Variants
- **Split Orbs**: Multiple orbs must be collected in sequence
- **Orb Chains**: Orbs that must be collected in specific order
- **Orb Fusion**: Combine multiple orbs to unlock new paths

### Environmental Hazards
- **Laser Grids**: Timing-based movement challenges
- **Pressure Plates**: Weight-based puzzles

### Power-ups & Items
- **Temporary Abilities**: One-time use special moves
- **Equipment**: Persistent items that modify gameplay
- **Consumables**: Limited-use tools for specific situations

## 🏆 Level Design Principles

### Core Principles
1. **Clear Objectives**: Players should understand goals immediately
2. **Fair Challenge**: Difficulty comes from mechanics, not obscurity
3. **Multiple Solutions**: Allow for creative problem-solving
4. **Progressive Complexity**: Introduce mechanics gradually
5. **Meaningful Choices**: Each decision should impact gameplay

### Level Structure
- **Tutorial Sections**: Introduce new mechanics safely
- **Challenge Rooms**: Focus on specific mechanics
- **Boss Levels**: Combine multiple mechanics
- **Secret Areas**: Optional challenges for skilled players

## 🎯 Future Expansion Ideas

### Multiplayer Modes
- **Co-op Puzzles**: Levels designed for two players
- **Competitive Challenges**: Race to complete levels
- **Level Sharing**: Create and share custom levels

### Seasonal Content
- **Theme Updates**: New mechanics and visual themes
- **Special Events**: Limited-time challenges
- **Community Contests**: Player-created level competitions

### Platform Features
- **Leaderboards**: Global and friend-based rankings
- **Achievements**: Milestone rewards
- **Cloud Saves**: Cross-device progression

## 📁 Basic Level 1 Implementation

### Required Files Structure
```
orbquest/
├── assets/
│   ├── images/
│   │   ├── player.png        # Static player character (32x32px)
│   │   ├── orb.png          # Static orb image (32x32px)
│   │   ├── floor.png        # Basic floor tile (32x32px)
│   │   └── wall.png         # Basic wall tile (32x32px)
│   └── levels/
│       └── level1.json      # Level layout and configuration
├── src/
│   ├── game.js              # Main game logic
│   ├── player.js            # Player movement and controls
│   ├── level.js             # Level loading and management
│   └── renderer.js          # Game rendering
└── index.html              # Main HTML file
```

### File Descriptions

#### Image Assets
- `player.png`: Simple character sprite (32x32 pixels)
- `orb.png`: Goal orb sprite (32x32 pixels)
- `floor.png`: Basic floor tile (32x32 pixels)
- `wall.png`: Basic wall tile (32x32 pixels)

#### Level Configuration
- `level1.json`: Contains:
  - Level dimensions
  - Tile layout
  - Player starting position
  - Orb position
  - Wall positions

#### Source Files
- `game.js`: Main game loop and initialization
- `player.js`: Player movement and collision detection
- `level.js`: Level loading and tile management
- `renderer.js`: Canvas rendering and sprite drawing
- `index.html`: Basic HTML structure with canvas element

### Minimum HTML Structure
```html
<!DOCTYPE html>
<html>
<head>
    <title>Orbquest</title>
    <style>
        canvas {
            border: 1px solid black;
        }
    </style>
</head>
<body>
    <canvas id="gameCanvas"></canvas>
    <script src="src/game.js"></script>
</body>
</html>
```

### Level 1 JSON Structure
```json
{
    "width": 10,
    "height": 10,
    "tiles": [
        // 0 = floor, 1 = wall
        [1,1,1,1,1,1,1,1,1,1],
        [1,0,0,0,0,0,0,0,0,1],
        [1,0,0,0,0,0,0,0,0,1],
        [1,0,0,0,0,0,0,0,0,1],
        [1,0,0,0,0,0,0,0,0,1],
        [1,0,0,0,0,0,0,0,0,1],
        [1,0,0,0,0,0,0,0,0,1],
        [1,0,0,0,0,0,0,0,0,1],
        [1,0,0,0,0,0,0,0,0,1],
        [1,1,1,1,1,1,1,1,1,1]
    ],
    "player": {
        "x": 1,
        "y": 1
    },
    "orb": {
        "x": 8,
        "y": 8
    }
}
```