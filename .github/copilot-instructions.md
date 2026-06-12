# NPC Dialogue Game - Development Instructions

## Project Overview
Interactive role-playing game featuring dynamic NPC characters with mood systems, memory, trust levels, and dialogue systems. Built as a vanilla JavaScript web app for easy deployment and modification.

## Technology Stack
- **Frontend**: HTML5, CSS3, Vanilla JavaScript
- **Architecture**: NPC class-based system with game controller
- **No build tools required**: Direct browser execution

## Core Systems

### 1. NPC System (npc.js)
- Character state management (mood, trust, relationship)
- Memory system with event tracking
- Dialogue generation based on character context
- Action response system (help, insult, betray, etc.)

### 2. Game Controller (game.js)
- Player input processing
- Natural language action detection
- NPC response generation
- UI state management
- Quest system

### 3. UI System (style.css + index.html)
- Responsive dialogue interface
- Mood indicator badges
- Memory and quest displays
- Debug panel for transparency

## Key Features to Maintain
- **Immersion**: NPCs stay in-character at all times
- **Memory**: Conversations and actions are remembered
- **Mood System**: 8 emotional states that affect dialogue
- **Trust Mechanics**: 0-100% scale affecting relationship status
- **Dynamic Dialogue**: Responses adapt to mood, trust, and player actions

## Files Structure
```
npc-dialogue-game/
├── index.html          # Game UI
├── style.css           # Styling
├── npc.js             # NPC class
├── game.js            # Game controller
├── README.md          # User documentation
└── .github/
    └── copilot-instructions.md  # This file
```

## Development Guidelines

### Adding New NPCs
1. Add template to `npcTemplates` object in game.js
2. Customize: name, age, job, personality, backstory, goals, secrets
3. Test with `initGame('npcName')`

### Extending Dialogue System
- Modify `generateDialogue()` method in NPC class
- Add new dialogue templates to `dialogueTemplates` object
- Ensure tone matches character personality and current mood

### Adding New Quest Types
- Add quest object to `quests` array in game.js
- Include: title, description, reward, difficulty
- Modify quest logic in `offerQuest()` if needed

### Mood Behavior
Current mood transitions:
- Trust > 70%: friendly/happy
- Trust 40-70%: friendly/neutral
- Trust 20-40%: neutral/suspicious
- Trust < 20%: suspicious/fearful

Modify `updateMood()` in NPC class to change mood logic.

## Important Notes

### Immersion Rules
- NEVER mention AI, language models, or out-of-world concepts
- NPCs only reference information they would know
- Dialogue must be natural and character-appropriate

### Memory System
- Max 50 events stored per NPC (FIFO when exceeded)
- Events tracked: timestamp, description, importance, related mood
- Used for context in future interactions

### Trust Mechanics
- Base actions have preset trust changes
- Relationship status updates automatically at 20%, 40%, 60%, 80% thresholds
- Affects both dialogue tone and available options

## Testing Checklist
- [ ] All 4 default NPCs load and respond correctly
- [ ] Trust system changes mood appropriately
- [ ] Memory persists throughout conversation
- [ ] Quests appear and complete successfully
- [ ] Mood badges update correctly
- [ ] Responsive design works on mobile
- [ ] No console errors during gameplay

## Performance Considerations
- Dialog options limited to 3 when trust < 30%
- Memory capped at 50 events
- No animations on critical paths
- Lightweight event-driven architecture

## Future Enhancement Ideas
- Branching dialogue trees for complex choices
- Inventory system with item trading
- NPC-to-NPC relationships
- Persistent save system (localStorage)
- Multi-character party system
- Combat integration
- Faction reputation system
- LLM-based dynamic dialogue generation

---

**Last Updated**: 2026-06-12
**Version**: 1.0 (Initial Release)
