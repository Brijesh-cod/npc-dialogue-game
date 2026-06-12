# NPC Dialogue Game

An interactive role-playing game where you engage in realistic conversations with NPCs. Each character has their own personality, mood system, memory, relationship tracking, and **branching dialogue trees**.

## Features

✨ **Dynamic Character System**
- Multiple NPC personalities (Aldric the Mage, Elena the Ranger, Marcus the Merchant, Lyra the Bard)
- Mood system: happy, neutral, suspicious, angry, friendly, fearful, excited, sad
- Trust/relationship system (stranger → close friend)
- Character memory that persists throughout the game

🗣️ **Branching Dialogue Trees** ⭐ NEW
- Interactive dialogue branches with multiple paths
- Conversations adapt based on your choices and trust level
- Natural progression through story nodes
- Memory of your dialogue choices

💼 **Inventory System** ⭐ NEW
- Collect and trade items with NPCs
- Items have value, rarity, and descriptions
- Offer items to boost trust and unlock new responses
- Dynamic inventory management

📜 **Quest System**
- NPCs offer quests based on trust level
- Quest completion/abandonment affects relationships
- Varied quest types and difficulty levels

💾 **Memory & State**
- NPCs remember important conversations and events
- Relationship status changes based on your actions
- Debug panel showing full NPC state for transparency
- Conversation history tracking

## How to Play

1. **Open `index.html`** in your web browser
2. **Choose dialogue branches** or follow conversation paths
3. **Trade items** from your inventory to build relationships
4. **Complete quests** to gain trust
5. **Switch NPCs** using the debug panel to meet different characters
6. **Betray or insult** NPCs to see how they react negatively

## Game Mechanics

### Branching Dialogue System
- Each NPC has interconnected dialogue nodes
- Your choices lead to different conversation paths
- Low trust = fewer dialogue options available
- High trust = access to secrets and deeper conversations

### Inventory System
- Start with 4 items: Gold Coins, Healing Potion, Ancient Scroll, Silver Amulet
- Each item has a value (affects trust boost)
- Offer items to NPCs to increase trust
- Items disappear after being given

### Mood System
- Mood affects NPC tone and willingness to help
- High trust → positive moods (friendly, happy)
- Low trust → negative moods (suspicious, angry)

### Trust/Relationship
- **0-20%**: Stranger (NPC is guarded)
- **20-40%**: Acquaintance (NPC is neutral)
- **40-60%**: Friendly (NPC is opening up)
- **60-80%**: Friend (NPC is helpful)
- **80-100%**: Close Friend (NPC reveals secrets and offers powerful quests)

### Player Actions Detected
- `help`: +15 trust
- `honesty`: +10 trust
- `gift`: +10 trust (plus item value bonus)
- `flattery`: +5 trust
- `insult`: -20 trust
- `lie`: -15 trust
- `threat`: -25 trust
- `betrayal`: -30 trust
- `quest_complete`: +20 trust
- `quest_fail`: -10 trust

## NPC Characters

### Aldric the Mage 🧙
- **Age**: 47
- **Occupation**: Court Wizard
- **Personality**: Mysterious, wise, cautious
- **Goal**: Rediscover lost magic, find apprentice
- **Secret**: Fears his powers are fading

### Elena the Ranger 🏹
- **Age**: 34
- **Occupation**: Monster Hunter
- **Personality**: Brave, sarcastic, protective
- **Goal**: Slay the dragon, build a team
- **Secret**: Revenge haunts her

### Marcus the Merchant 💼
- **Age**: 52
- **Occupation**: Wealthy Trader
- **Personality**: Cunning, ambitious, friendly
- **Goal**: Expand empire, find artifacts
- **Secret**: Uses insider information

### Lyra the Bard 🎵
- **Age**: 28
- **Occupation**: Traveling Musician
- **Personality**: Cheerful, social, artistic
- **Goal**: Compose perfect song, win competition
- **Secret**: Running from past love

## Technical Details

### Architecture
- **NPC.js**: Character class managing state, mood, memory, dialogue tree
- **Game.js**: Game controller handling interactions, inventory, dialogue navigation
- **style.css**: Responsive UI styling
- **index.html**: Game interface

### Dialogue Tree System
NPCs have interconnected dialogue nodes:
- `initial`: Default greeting and conversation starters
- `backstory`: Character background information
- `goals`: NPC's objectives and ambitions
- `help_offer`: Quest and assistance offers
- `trade`: Item trading branch

Each node has branches that lead to different outcomes.

### Memory System
- Stores up to 50 events per NPC
- Events include: timestamp, event description, importance level, related mood
- Tracks conversation choices made during gameplay

### Inventory System
- Items stored in `gameState.inventory`
- Each item has: name, value, rarity, description
- Trading items with NPCs increases trust by item value/20
- Items are consumed after trading

## Deployment

### Deploy to GitHub Pages (5 minutes)

1. Create a GitHub repository
2. Push code to `main` branch
3. Go to **Settings → Pages**
4. Select **Deploy from a branch** → **main** → **Save**
5. Your game is live at `https://YOUR_USERNAME.github.io/npc-dialogue-game/`

**See [DEPLOY.md](DEPLOY.md) for detailed deployment instructions.**

## Customization

### Add New NPCs

Edit `game.js` and add to `npcTemplates`:

```javascript
yourNpc: {
    name: 'Your NPC Name',
    age: 30,
    job: 'Occupation',
    personality: ['trait1', 'trait2'],
    backstory: 'Your backstory here',
    goals: ['goal1', 'goal2'],
    secrets: ['secret1'],
    avatar: '🎨'
}
```

Then call `initGame('yourNpc')` to load that character.

### Create Custom Dialogue Trees

In `npc.js`, extend the `getDialogueTree()` method:

```javascript
custom_node: {
    text: 'Your dialogue here',
    branches: [
        { text: 'Player choice', action: 'action_name', next: 'next_node' },
        { text: 'Another choice', action: 'another_action', next: 'other_node' }
    ]
}
```

### Add Inventory Items

Modify `gameState.inventory` in `game.js`:

```javascript
inventory: [
    { name: 'Item Name', value: 50, rarity: 'common', description: 'Description' }
]
```

## Future Enhancements

- [ ] Save/load game state (localStorage)
- [ ] More complex quest chains
- [ ] NPC-to-NPC interactions
- [ ] Combat system
- [ ] Faction reputation
- [ ] Dynamic dialogue generation with LLM integration
- [ ] Achievements and milestones
- [ ] Multiple game worlds
- [ ] Party system with multiple companions

## License

Open source - feel free to modify and expand!

---

**Enjoy the game! Try different approaches with each NPC to discover their full personalities and secrets.** 🎮

