/**
 * Game Controller - Manages the interactive dialogue experience
 */

let npc = null;
let gameState = {
    conversationTurns: 0,
    completedQuests: [],
    currentQuest: null,
    inventory: [
        { name: 'Gold Coins', value: 50, rarity: 'common', description: 'Universal currency' },
        { name: 'Healing Potion', value: 30, rarity: 'common', description: 'Restores health' },
        { name: 'Ancient Scroll', value: 100, rarity: 'rare', description: 'Contains forbidden knowledge' },
        { name: 'Silver Amulet', value: 75, rarity: 'uncommon', description: 'Provides protection' }
    ],
    currentDialogueNode: 'initial',
    conversationHistory: []
};

// Sample NPCs to choose from
const npcTemplates = {
    aldric: {
        name: 'Aldric the Mage',
        age: 47,
        job: 'Court Wizard',
        location: 'Tower of Arcana',
        personality: ['mysterious', 'wise', 'cautious'],
        backstory: 'Once a powerful mage, now disillusioned with court politics.',
        goals: ['Rediscover lost magic', 'Find a worthy apprentice', 'Uncover ancient secrets'],
        secrets: ['Fears his powers are fading', 'Guilty about an old mistake'],
        avatar: '🧙'
    },
    elena: {
        name: 'Elena the Ranger',
        age: 34,
        job: 'Monster Hunter',
        location: 'Tavern in Silverpine',
        personality: ['brave', 'sarcastic', 'protective'],
        backstory: 'Lost her family to a dragon. Now hunts monsters to protect others.',
        goals: ['Find and slay the dragon', 'Build a team', 'Protect the innocent'],
        secrets: ['Dreams of revenge haunt her', 'Sometimes doubts her mission'],
        avatar: '🏹'
    },
    marcus: {
        name: 'Marcus the Merchant',
        age: 52,
        job: 'Wealthy Trader',
        location: 'Market Square',
        personality: ['cunning', 'ambitious', 'friendly'],
        backstory: 'Built his fortune through trade and negotiation.',
        goals: ['Expand his empire', 'Find rare artifacts', 'Gain political influence'],
        secrets: ['Uses insider information', 'Has enemies in high places'],
        avatar: '💼'
    },
    lyra: {
        name: 'Lyra the Bard',
        age: 28,
        job: 'Traveling Musician',
        location: 'Inn by the River',
        personality: ['cheerful', 'social', 'artistic'],
        backstory: 'Travels the world gathering stories and making music.',
        goals: ['Compose the perfect song', 'Win a grand competition', 'Inspire people'],
        secrets: ['Running from a past love', 'Wants to settle down'],
        avatar: '🎵'
    }
};

// Predefined dialogue options
const dialogueChoices = [
    { text: 'Tell me about yourself.', action: 'ask_about_self', trust: 5 },
    { text: 'I heard rumors about you.', action: 'rumors', trust: -5 },
    { text: 'Can you help me?', action: 'ask_help', trust: 5 },
    { text: 'You look troubled.', action: 'show_concern', trust: 10 },
    { text: 'I respect your work.', action: 'flattery', trust: 5 },
    { text: 'What are your goals?', action: 'ask_goals', trust: 5 },
    { text: 'Want to work together?', action: 'propose_alliance', trust: 10 },
    { text: 'I can offer you something valuable.', action: 'trade_proposal', trust: 5 }
];

const quests = [
    {
        title: 'Find the Lost Amulet',
        description: 'Search the Old Ruins to the east for my lost amulet.',
        reward: '50 gold coins',
        difficulty: 'Medium'
    },
    {
        title: 'Retrieve Rare Herbs',
        description: 'Gather moonflowers from the Enchanted Forest.',
        reward: '30 gold coins + Potion of Wisdom',
        difficulty: 'Easy'
    },
    {
        title: 'Defeat the Shadow Beast',
        description: 'A dark creature has been terrorizing the village. Stop it.',
        reward: '100 gold coins + Legendary Sword',
        difficulty: 'Hard'
    },
    {
        title: 'Steal from the Merchant',
        description: 'Get the encrypted scroll from Marcus. Be careful.',
        reward: 'Secret map',
        difficulty: 'Hard'
    }
];

/**
 * Initialize the game with a selected NPC
 */
function initGame(selectedNpc = 'aldric') {
    const template = npcTemplates[selectedNpc];
    npc = new NPC(template);
    gameState.conversationTurns = 0;
    gameState.currentQuest = null;
    gameState.currentDialogueNode = 'initial';
    gameState.conversationHistory = [];
    
    updateUI();
    displayGreeting();
}

/**
 * Display NPC's initial greeting
 */
function displayGreeting() {
    const greeting = npc.generateDialogue();
    npc.lastDialogue = greeting;
    updateDialogueBox(greeting);
    updateOptions();
}

/**
 * Send player message
 */
function sendMessage() {
    const input = document.getElementById('playerInput');
    const message = input.value.trim();

    if (!message) return;

    // Process player message
    processPlayerMessage(message);
    input.value = '';
    input.focus();
}

/**
 * Process player message and generate NPC response
 */
function processPlayerMessage(message) {
    gameState.conversationTurns++;
    
    // Detect player action from message
    const action = detectPlayerAction(message);
    
    if (action) {
        npc.respondToAction(action.type, action.value);
    }

    // Generate NPC response
    const response = generateNPCResponse(message, action);
    npc.lastDialogue = response;
    
    // Add to memory
    npc.rememberEvent(`Player said: "${message}"`);
    
    updateUI();
    updateDialogueBox(response);
    updateOptions();
    updateDebug();
}

/**
 * Detect player action from natural language
 */
function detectPlayerAction(message) {
    const lowerMsg = message.toLowerCase();

    // Help/Support
    if (lowerMsg.includes('help') || lowerMsg.includes('assist')) {
        return { type: 'help', value: 15 };
    }

    // Insult
    if (lowerMsg.includes('stupid') || lowerMsg.includes('fool') || lowerMsg.includes('idiot')) {
        return { type: 'insult', value: -20 };
    }

    // Compliment/Flattery
    if (lowerMsg.includes('amazing') || lowerMsg.includes('great') || lowerMsg.includes('impressive')) {
        return { type: 'flattery', value: 5 };
    }

    // Gift/Trade
    if (lowerMsg.includes('gift') || lowerMsg.includes('give') || lowerMsg.includes('take')) {
        return { type: 'gift', value: 10 };
    }

    // Honesty
    if (lowerMsg.includes('honest') || lowerMsg.includes('truth') || lowerMsg.includes('sincere')) {
        return { type: 'honesty', value: 10 };
    }

    // Threat
    if (lowerMsg.includes('threat') || lowerMsg.includes('harm') || lowerMsg.includes('kill')) {
        return { type: 'threat', value: -25 };
    }

    return null;
}

/**
 * Generate NPC response based on player message and action
 */
function generateNPCResponse(message, action) {
    const responses = {
        help: [
            'Your offer means a lot to me.',
            'I appreciate your willingness to help.',
            'Perhaps you\'re not so bad after all.'
        ],
        insult: [
            'How dare you! We\'re done here.',
            'That was uncalled for.',
            'I don\'t have to listen to this disrespect.'
        ],
        flattery: [
            'Well, that\'s kind of you to say.',
            'I appreciate the compliment.',
            'Perhaps we got off on the wrong foot.'
        ],
        gift: [
            'This is very generous of you.',
            'You shouldn\'t have!',
            'I will treasure this.'
        ],
        honesty: [
            'I respect your truthfulness.',
            'It\'s refreshing to hear honesty.',
            'That kind of integrity is rare.'
        ],
        threat: [
            'Is that a threat?!',
            'You dare threaten me?',
            'I will remember this.'
        ],
        generic: [
            npc.generateDialogue(message),
            'Interesting thought.',
            'I see what you mean.',
            'Tell me more about that.'
        ]
    };

    let category = 'generic';
    if (action && responses[action.type]) {
        category = action.type;
    }

    const options = responses[category];
    return options[Math.floor(Math.random() * options.length)];
}

/**
 * Handle dialogue option click
 */
function selectDialogueOption(text, action) {
    processPlayerMessage(text);
}

/**
 * Select a dialogue branch
 */
function selectBranch(branch) {
    gameState.conversationHistory.push({
        npc: npc.name,
        playerText: branch.text,
        action: branch.action,
        timestamp: Date.now()
    });

    // Apply action effects
    if (branch.action !== 'back' && branch.action !== 'decline') {
        npc.respondToAction(branch.action);
    }

    // Move to next node
    gameState.currentDialogueNode = branch.next || 'initial';
    gameState.conversationTurns++;

    // Generate contextual response
    let response = '';
    if (branch.action === 'quest_accept' && npc.trust > 30) {
        const quest = quests[Math.floor(Math.random() * quests.length)];
        gameState.currentQuest = quest;
        response = npc.offerQuest(quest);
    } else {
        response = npc.generateDialogue(branch.text);
    }

    npc.lastDialogue = response;
    npc.rememberEvent(`Player chose: "${branch.text}"`);

    updateUI();
    updateDialogueBox(response);
    updateOptions();
    updateDebug();
}

/**
 * Update UI displays
 */
function updateUI() {
    const state = npc.getState();

    // Update NPC info
    document.getElementById('npcName').textContent = state.name;
    document.getElementById('moodBadge').textContent = capitalizeFirst(state.mood);
    document.getElementById('moodBadge').className = `mood-badge ${state.mood}`;
    document.getElementById('moodText').textContent = capitalizeFirst(state.mood);
    document.getElementById('trustText').textContent = state.trust + '%';
    document.getElementById('avatar').textContent = state.avatar;

    // Update memory
    updateMemoryDisplay(state.memory);

    // Update inventory
    updateInventoryDisplay();

    // Update quests
    updateQuestDisplay();
}

/**
 * Update dialogue box
 */
function updateDialogueBox(text) {
    const dialogueBox = document.getElementById('dialogueBox');
    dialogueBox.style.opacity = '0.5';
    
    setTimeout(() => {
        document.getElementById('dialogueText').textContent = text;
        dialogueBox.style.opacity = '1';
    }, 200);
}

/**
 * Update dialogue options based on branching tree
 */
function updateOptions() {
    const optionsSection = document.getElementById('optionsSection');
    optionsSection.innerHTML = '';

    // Get current dialogue node from tree
    const dialogueTree = npc.getDialogueTree(gameState.currentDialogueNode);
    
    if (!dialogueTree.branches || dialogueTree.branches.length === 0) {
        // No branches - reset to initial
        gameState.currentDialogueNode = 'initial';
        updateOptions();
        return;
    }

    // Limit options based on trust for immersion
    let availableBranches = dialogueTree.branches;
    if (npc.trust < 30 && gameState.currentDialogueNode === 'initial') {
        availableBranches = dialogueTree.branches.slice(0, 2);
    }

    // Add branching dialogue options
    availableBranches.forEach(branch => {
        const btn = document.createElement('button');
        btn.className = 'dialogue-option';
        btn.textContent = branch.text;
        btn.onclick = () => selectBranch(branch);
        optionsSection.appendChild(btn);
    });

    // Add quest button if applicable
    if (npc.trust > 40 && !gameState.currentQuest && gameState.currentDialogueNode === 'initial') {
        const questBtn = document.createElement('button');
        questBtn.className = 'dialogue-option';
        questBtn.textContent = 'Offer me a quest';
        questBtn.onclick = () => {
            const quest = quests[Math.floor(Math.random() * quests.length)];
            gameState.currentQuest = quest;
            const response = npc.offerQuest(quest);
            npc.lastDialogue = response;
            updateDialogueBox(response);
            updateOptions();
        };
        optionsSection.appendChild(questBtn);
    }

    // Custom input option
    const customBtn = document.createElement('button');
    customBtn.className = 'dialogue-option';
    customBtn.textContent = 'Say something custom...';
    customBtn.onclick = () => {
        document.getElementById('playerInput').focus();
    };
    optionsSection.appendChild(customBtn);
}

/**
 * Create a dialogue option button
 */
function createOptionButton(text, onClick) {
    const btn = document.createElement('button');
    btn.className = 'dialogue-option';
    btn.textContent = text;
    btn.onclick = onClick;
    return btn;
}

/**
 * Update inventory display
 */
function updateInventoryDisplay() {
    const inventoryDiv = document.getElementById('inventory');
    
    if (gameState.inventory.length === 0) {
        inventoryDiv.innerHTML = '<p><em>Empty</em></p>';
        return;
    }

    let html = '<ul>';
    gameState.inventory.forEach((item, index) => {
        html += `<li><strong>${item.name}</strong> (${item.rarity})<br><small>${item.description}</small><br><small>Value: ${item.value} gold</small><br><button onclick="offerItemToNPC(${index})">Offer to ${npc.name}</button></li>`;
    });
    html += '</ul>';
    inventoryDiv.innerHTML = html;
}

/**
 * Offer item to NPC
 */
function offerItemToNPC(index) {
    const item = gameState.inventory[index];
    if (!item) return;

    const trustBoost = Math.ceil(item.value / 20);
    npc.respondToAction('gift', trustBoost);
    npc.rememberEvent(`Received gift: ${item.name}`);
    npc.itemsReceived.push(item.name);

    const responses = [
        `What a thoughtful gift! Thank you for the ${item.name}.`,
        `I appreciate this. You have a good eye for valuable things.`,
        `This ${item.name}... I will treasure it.`,
        `You did not have to give me this, but I will not refuse.`
    ];

    const response = responses[Math.floor(Math.random() * responses.length)];
    npc.lastDialogue = response;
    updateDialogueBox(response);

    // Remove item from inventory
    gameState.inventory.splice(index, 1);
    updateUI();
    updateOptions();
}

/**
 * Switch to different NPC
 */
function switchNPC(npcName) {
    if (confirm(`Switch to ${npcName}? This will reset the conversation.`)) {
        gameState.currentDialogueNode = 'initial';
        gameState.conversationTurns = 0;
        gameState.currentQuest = null;
        initGame(npcName);
    }
}

/**
 * Update memory display
 */
function updateMemoryDisplay(memories) {
    const memoryList = document.getElementById('memoryList');
    
    if (memories.length === 0) {
        memoryList.innerHTML = '<p><em>No memories yet...</em></p>';
        return;
    }

    memoryList.innerHTML = '<ul>' + memories.map(m => 
        `<li>${m.event} <small>(${m.importance})</small></li>`
    ).join('') + '</ul>';
}

/**
 * Update quest display
 */
function updateQuestDisplay() {
    const questLog = document.getElementById('questLog');
    
    if (gameState.currentQuest) {
        questLog.innerHTML = `
            <strong>${gameState.currentQuest.title}</strong>
            <p>${gameState.currentQuest.description}</p>
            <p>Reward: ${gameState.currentQuest.reward}</p>
            <button onclick="completeQuest()">Complete Quest</button>
            <button onclick="abandonQuest()">Abandon Quest</button>
        `;
    } else if (npc.questsGiven.length > 0) {
        questLog.innerHTML = '<p>No active quest.</p>';
    } else {
        questLog.innerHTML = '<p><em>No quests yet...</em></p>';
    }
}

/**
 * Complete current quest
 */
function completeQuest() {
    if (!gameState.currentQuest) return;
    
    const response = npc.completeQuest(gameState.currentQuest.title);
    gameState.completedQuests.push(gameState.currentQuest);
    gameState.currentQuest = null;
    
    npc.lastDialogue = response;
    updateDialogueBox(response);
    updateOptions();
    updateUI();
}

/**
 * Abandon current quest
 */
function abandonQuest() {
    if (!gameState.currentQuest) return;
    
    npc.respondToAction('quest_fail');
    gameState.currentQuest = null;
    
    const response = 'I see. Perhaps you\'re not the right one for this task.';
    npc.lastDialogue = response;
    updateDialogueBox(response);
    updateOptions();
    updateUI();
}

/**
 * Update debug info
 */
function updateDebug() {
    const debugInfo = {
        npcState: npc.toJSON(),
        gameState: gameState,
        conversationTurns: gameState.conversationTurns
    };

    document.getElementById('debugInfo').textContent = JSON.stringify(debugInfo, null, 2);
}

/**
 * Reset game
 */
function resetGame() {
    if (confirm('Reset the game? This will lose all progress.')) {
        initGame('aldric');
        alert('Game reset!');
    }
}

/**
 * Utility: Capitalize first letter
 */
function capitalizeFirst(str) {
    return str.charAt(0).toUpperCase() + str.slice(1);
}

/**
 * Keyboard shortcuts
 */
document.addEventListener('DOMContentLoaded', () => {
    initGame('aldric');

    document.getElementById('playerInput').addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            sendMessage();
        }
    });
});
