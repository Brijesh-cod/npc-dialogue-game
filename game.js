import { pipeline } from 'https://cdn.jsdelivr.net/npm/@xenova/transformers@2.17.2';

const Npcs = {
    aldric: {
        name: 'Aldric the Mage',
        title: 'Court Wizard',
        avatarTint: '#3b2f9a',
        persona: 'mysterious, wise, cautious',
        backstory: 'Once a powerful mage, now disillusioned with court politics.',
        goals: 'Rediscover lost magic and find a worthy apprentice.',
        quest: 'Search the tower archives for signs of a lost spellbook.'
    },
    elena: {
        name: 'Elena the Ranger',
        title: 'Monster Hunter',
        avatarTint: '#2f8f6f',
        persona: 'brave, sarcastic, protective',
        backstory: 'She lost her family to a dragon and now hunts monsters to protect others.',
        goals: 'Find and slay the dragon.',
        quest: 'Track a beast through the pine woods and bring back proof.',
    },
    marcus: {
        name: 'Marcus the Merchant',
        title: 'Wealthy Trader',
        avatarTint: '#b46a2a',
        persona: 'cunning, ambitious, friendly',
        backstory: 'A trader with a smile for everyone and a plan for everything.',
        goals: 'Expand his empire and acquire rare artifacts.',
        quest: 'Negotiate a profitable exchange with a rival caravan.',
    },
    lyra: {
        name: 'Lyra the Bard',
        title: 'Traveling Musician',
        avatarTint: '#d94f8a',
        persona: 'cheerful, social, artistic',
        backstory: 'A wandering performer who uses music to hide a wounded past.',
        goals: 'Compose the perfect song and win the grand competition.',
        quest: 'Find a forgotten melody rumored to echo through the old theater.',
    }
};

const state = {
    currentNpcKey: 'aldric',
    model: null,
    loading: true,
    messages: [],
    trust: 10,
    mood: 'neutral',
    memory: [],
    modelStatus: 'Loading AI model...',
};

const els = {};

function clamp(value, min, max) {
    return Math.max(min, Math.min(max, value));
}

function currentNpc() {
    return Npcs[state.currentNpcKey];
}

function trustLabel() {
    if (state.trust >= 80) return 'close friend';
    if (state.trust >= 60) return 'friend';
    if (state.trust >= 40) return 'friendly';
    if (state.trust >= 20) return 'acquaintance';
    return 'stranger';
}

function moodFromTrust() {
    if (state.trust >= 70) return 'friendly';
    if (state.trust >= 45) return 'neutral';
    if (state.trust >= 20) return 'suspicious';
    return 'neutral';
}

function updateMoodFromMessage(message) {
    const lower = message.toLowerCase();
    const positive = ['help', 'thank', 'please', 'gift', 'honest', 'kind', 'friend'];
    const negative = ['lie', 'steal', 'kill', 'hate', 'idiot', 'fake', 'threat'];

    if (positive.some((word) => lower.includes(word))) {
        state.trust = clamp(state.trust + 6, 0, 100);
    }
    if (negative.some((word) => lower.includes(word))) {
        state.trust = clamp(state.trust - 10, 0, 100);
    }
    state.mood = moodFromTrust();
}

function addMemory(entry) {
    state.memory.unshift({
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        text: entry,
    });
    state.memory = state.memory.slice(0, 8);
}

function setNpcVisual(npc) {
    els.avatar.style.boxShadow = `
        /* Row 0 */
        16px 0 ${npc.avatarTint}, 24px 0 ${npc.avatarTint}, 32px 0 ${npc.avatarTint}, 40px 0 ${npc.avatarTint},
        /* Row 1 */
        8px 8px ${npc.avatarTint}, 16px 8px ${npc.avatarTint}, 24px 8px ${npc.avatarTint}, 32px 8px ${npc.avatarTint}, 40px 8px ${npc.avatarTint}, 48px 8px ${npc.avatarTint},
        /* Row 2 */
        0px 16px ${npc.avatarTint}, 8px 16px #f5d6b3, 16px 16px #f5d6b3, 24px 16px #f5d6b3, 32px 16px #f5d6b3, 40px 16px #f5d6b3, 48px 16px ${npc.avatarTint}, 56px 16px ${npc.avatarTint},
        /* Row 3 */
        0px 24px ${npc.avatarTint}, 8px 24px #f5d6b3, 16px 24px #f5d6b3, 24px 24px #f5d6b3, 32px 24px #f5d6b3, 40px 24px #f5d6b3, 48px 24px #f5d6b3, 56px 24px ${npc.avatarTint},
        /* Row 4 */
        8px 32px ${npc.avatarTint}, 16px 32px ${npc.avatarTint}, 24px 32px ${npc.avatarTint}, 32px 32px ${npc.avatarTint}, 40px 32px ${npc.avatarTint}, 48px 32px ${npc.avatarTint},
        /* Row 5 */
        8px 40px ${npc.avatarTint}, 16px 40px ${npc.avatarTint}, 24px 40px ${npc.avatarTint}, 32px 40px ${npc.avatarTint}, 40px 40px ${npc.avatarTint}, 48px 40px ${npc.avatarTint},
        /* Row 6 */
        16px 48px ${npc.avatarTint}, 24px 48px ${npc.avatarTint}, 32px 48px ${npc.avatarTint}, 40px 48px ${npc.avatarTint},
        /* Row 7 */
        24px 56px #ffd24a
    `;
}

function renderProfile() {
    const npc = currentNpc();
    els.npcName.textContent = npc.name;
    els.npcTitle.textContent = npc.title;
    els.moodBadge.textContent = state.mood.charAt(0).toUpperCase() + state.mood.slice(1);
    els.moodBadge.className = `mood-badge ${state.mood}`;
    els.modelStatus.textContent = state.modelStatus;
    setNpcVisual(npc);

    els.debugInfo.textContent = JSON.stringify({
        npc: state.currentNpcKey,
        trust: state.trust,
        relationship: trustLabel(),
        mood: state.mood,
        loadedModel: Boolean(state.model),
        memory: state.memory,
    }, null, 2);

    els.statusList.innerHTML = `
        <div class="status-item">Trust: ${state.trust}%</div>
        <div class="status-item">Relationship: ${trustLabel()}</div>
        <div class="status-item">Mood: ${state.mood}</div>
        <div class="status-item">Quest hook: ${npc.quest}</div>
    `;
}

function renderMemory() {
    if (state.memory.length === 0) {
        els.memoryList.innerHTML = '<div class="memory-item">No memories yet. Start the conversation.</div>';
        return;
    }

    els.memoryList.innerHTML = state.memory
        .map((entry) => `<div class="memory-item"><strong>${entry.time}</strong> ${entry.text}</div>`)
        .join('');
}

function renderChat() {
    els.chatLog.innerHTML = state.messages
        .map((message) => `
            <article class="message ${message.role}">
                <span class="message-meta">${message.role === 'user' ? 'You' : message.role === 'assistant' ? currentNpc().name : 'System'}</span>
                ${message.text}
            </article>
        `)
        .join('');
    els.chatLog.scrollTop = els.chatLog.scrollHeight;
}

function pushMessage(role, text) {
    state.messages.push({ role, text });
    renderChat();
}

function fallbackReply(userText) {
    const npc = currentNpc();
    const lower = userText.toLowerCase();

    if (lower.includes('quest')) {
        return `I could give you work. ${npc.quest}`;
    }
    if (lower.includes('name') || lower.includes('who are you')) {
        return `I am ${npc.name}, ${npc.title}. ${npc.backstory}`;
    }
    if (lower.includes('goal') || lower.includes('want')) {
        return `My aim is simple: ${npc.goals}`;
    }
    if (lower.includes('memory') || lower.includes('remember')) {
        return state.memory.length ? `I remember your last words: ${state.memory[0].text}` : 'You have not given me much to remember yet.';
    }

    return `You have my attention. ${npc.backstory} Ask me something specific and I will answer in kind.`;
}

function buildPrompt(userText) {
    const npc = currentNpc();
    const recentMemory = state.memory
        .slice(0, 4)
        .map((entry) => `- ${entry.text}`)
        .join('\n') || '- No prior memory.';

    return `
You are ${npc.name}, a ${npc.title} in a fantasy role-playing game.
Stay in character at all times.
Reply in the first person using 1 or 2 short sentences.
Do not mention being an AI model.
Persona: ${npc.persona}.
Current mood: ${state.mood}.
Relationship: ${trustLabel()}.
Backstory: ${npc.backstory}.
Goal: ${npc.goals}.
Recent memory:\n${recentMemory}
Player says: ${userText}
NPC reply:
`.trim();
}

function isRepetitiveReply(text) {
    const normalized = text.replace(/\s+/g, ' ').trim();
    const repeatedPhrase = /(.{8,}?)\s+\1(\s+\1)+/i.test(normalized);
    const shortLoop = /\b([A-Za-z']{2,})\b(?:\W+\1\b){2,}/i.test(normalized);
    return repeatedPhrase || shortLoop || normalized.length < 20;
}

async function generateReply(userText) {
    if (!state.model) {
        return fallbackReply(userText);
    }

    const prompt = buildPrompt(userText);
    try {
        const result = await state.model(prompt, {
            max_new_tokens: 120,
            temperature: 0.8,
            top_p: 0.95,
            do_sample: true,
        });
        const text = result?.[0]?.generated_text?.trim();
        if (!text) {
            return fallbackReply(userText);
        }
        const cleaned = text.replace(/^NPC reply:\s*/i, '').trim();
        if (isRepetitiveReply(cleaned)) {
            return fallbackReply(userText);
        }
        return cleaned;
    } catch (error) {
        console.error('AI generation failed:', error);
        state.modelStatus = 'AI model fell back to local dialogue.';
        renderProfile();
        return fallbackReply(userText);
    }
}

async function loadModel() {
    try {
        state.modelStatus = 'Loading AI model...';
        renderProfile();
        const generator = await pipeline('text2text-generation', 'Xenova/flan-t5-small');
        state.model = generator;
        state.modelStatus = 'AI model ready.';
    } catch (error) {
        console.error('Model load failed:', error);
        state.model = null;
        state.modelStatus = 'Model unavailable. Using offline dialogue fallback.';
    }
    state.loading = false;
    renderProfile();
}

async function sendMessage(text) {
    const message = text.trim();
    if (!message) {
        return;
    }

    pushMessage('user', message);
    addMemory(`You said: ${message}`);
    updateMoodFromMessage(message);
    renderMemory();
    renderProfile();

    els.playerInput.value = '';
    els.sendButton.disabled = true;
    els.sendButton.textContent = state.loading ? 'Loading...' : 'Thinking...';

    const reply = await generateReply(message);
    pushMessage('assistant', reply);
    addMemory(`${currentNpc().name} replied: ${reply}`);
    state.trust = clamp(state.trust + (message.length > 20 ? 2 : 1), 0, 100);
    state.mood = moodFromTrust();
    renderMemory();
    renderProfile();

    els.sendButton.disabled = false;
    els.sendButton.textContent = 'Talk';
}

function switchNpc(key) {
    if (!Npcs[key] || key === state.currentNpcKey) {
        return;
    }

    state.currentNpcKey = key;
    state.trust = 10;
    state.mood = 'neutral';
    state.memory = [];
    state.messages = [
        {
            role: 'system',
            text: `Switched to ${Npcs[key].name}. The conversation begins anew.`,
        },
    ];
    renderChat();
    renderMemory();
    renderProfile();
}

function bindEvents() {
    els.sendButton.addEventListener('click', () => sendMessage(els.playerInput.value));
    els.playerInput.addEventListener('keydown', (event) => {
        if (event.key === 'Enter') {
            sendMessage(els.playerInput.value);
        }
    });

    document.querySelectorAll('[data-npc]').forEach((button) => {
        button.addEventListener('click', () => {
            document.querySelectorAll('[data-npc]').forEach((item) => item.classList.remove('active'));
            button.classList.add('active');
            switchNpc(button.dataset.npc);
        });
    });

    document.querySelectorAll('[data-prompt]').forEach((button) => {
        button.addEventListener('click', () => {
            els.playerInput.value = button.dataset.prompt;
            sendMessage(button.dataset.prompt);
        });
    });
}

function initializeElements() {
    els.avatar = document.getElementById('avatar');
    els.npcName = document.getElementById('npcName');
    els.npcTitle = document.getElementById('npcTitle');
    els.moodBadge = document.getElementById('moodBadge');
    els.modelStatus = document.getElementById('modelStatus');
    els.chatLog = document.getElementById('chatLog');
    els.chatHint = document.getElementById('chatHint');
    els.memoryList = document.getElementById('memoryList');
    els.statusList = document.getElementById('statusList');
    els.debugInfo = document.getElementById('debugInfo');
    els.playerInput = document.getElementById('playerInput');
    els.sendButton = document.getElementById('sendButton');
}

function bootstrap() {
    initializeElements();
    bindEvents();
    state.messages = [
        {
            role: 'system',
            text: 'The room is quiet. Choose an NPC and start a conversation.',
        },
        {
            role: 'assistant',
            text: 'I am listening. Speak plainly, and I will answer in character.',
        },
    ];
    renderChat();
    renderMemory();
    renderProfile();
    loadModel();
}

document.addEventListener('DOMContentLoaded', bootstrap);
