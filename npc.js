/**
 * NPC Class - Manages character state, memory, mood, and dialogue
 */
class NPC {
    constructor(config) {
        this.name = config.name || 'NPC';
        this.age = config.age || 30;
        this.job = config.job || 'Wanderer';
        this.location = config.location || 'Village';
        this.personality = config.personality || ['mysterious', 'cautious'];
        this.backstory = config.backstory || 'A mysterious figure with a shadowed past.';
        this.goals = config.goals || ['Survive', 'Find purpose'];
        this.secrets = config.secrets || [];
        this.avatar = config.avatar || '🧙';

        // State
        this.mood = 'neutral';
        this.trust = 0; // 0-100
        this.relationshipStatus = 'stranger';
        this.memory = [];
        this.questsGiven = [];
        this.itemsReceived = [];
        this.itemsGiven = [];

        // Dialogue system
        this.lastDialogue = null;
        this.conversationCount = 0;
        this.currentTone = 'neutral';
    }

    /**
     * Add event to memory
     */
    rememberEvent(event, importance = 'normal') {
        this.memory.push({
            timestamp: Date.now(),
            event,
            importance,
            relatedMood: this.mood
        });

        // Limit memory to 50 events
        if (this.memory.length > 50) {
            this.memory.shift();
        }
    }

    /**
     * Adjust trust and relationship based on player action
     */
    respondToAction(action, value = 10) {
        const actions = {
            help: 15,
            insult: -20,
            betrayal: -30,
            gift: 10,
            lie: -15,
            honesty: 10,
            flattery: 5,
            threat: -25,
            trade: 5,
            quest_complete: 20,
            quest_fail: -10
        };

        const change = actions[action] || value;
        this.trust = Math.max(0, Math.min(100, this.trust + change));

        // Update relationship status
        if (this.trust < 20) this.relationshipStatus = 'stranger';
        else if (this.trust < 40) this.relationshipStatus = 'acquaintance';
        else if (this.trust < 60) this.relationshipStatus = 'friendly';
        else if (this.trust < 80) this.relationshipStatus = 'friend';
        else this.relationshipStatus = 'close friend';

        this.rememberEvent(`Player ${action}ed me`, 'important');
        this.updateMood();
    }

    /**
     * Update mood based on recent events and trust
     */
    updateMood() {
        const moods = ['happy', 'neutral', 'suspicious', 'angry', 'friendly', 'fearful', 'excited', 'sad'];
        
        if (this.trust > 70) {
            this.mood = Math.random() > 0.5 ? 'friendly' : 'happy';
        } else if (this.trust > 40) {
            this.mood = Math.random() > 0.5 ? 'friendly' : 'neutral';
        } else if (this.trust > 20) {
            this.mood = Math.random() > 0.5 ? 'neutral' : 'suspicious';
        } else if (this.trust < 10) {
            this.mood = Math.random() > 0.5 ? 'suspicious' : 'fearful';
        } else {
            this.mood = 'neutral';
        }

        // Random mood shifts (10% chance)
        if (Math.random() < 0.1) {
            this.mood = moods[Math.floor(Math.random() * moods.length)];
        }
    }

    /**
     * Generate dialogue based on mood, trust, and context
     */
    generateDialogue(playerMessage = null) {
        const dialogueTemplates = {
            greeting: {
                stranger: [
                    "Greetings, traveler. I don't believe we've met.",
                    "Hmm? Oh, hello there.",
                    "What brings you to me?"
                ],
                acquaintance: [
                    "Ah, it's you again. What do you need?",
                    "Good to see you around.",
                    "Care for a chat?"
                ],
                friend: [
                    "My friend! Good to see you!",
                    "Welcome back! How have you been?",
                    "Always a pleasure to see you."
                ]
            },
            neutral: {
                stranger: [
                    "I'm not particularly interested in what you have to say.",
                    "Is there something you wanted?",
                    "I have other matters to attend to."
                ],
                acquaintance: [
                    "So, what's on your mind?",
                    "Let's keep this brief, shall we?",
                    "What did you want to talk about?"
                ],
                friend: [
                    "Always happy to help a friend.",
                    "What can I do for you?",
                    "You know you can trust me."
                ]
            },
            friendly: {
                stranger: [
                    "You seem like an interesting person. Tell me about yourself.",
                    "I have a good feeling about you.",
                    "Perhaps we could become friends?"
                ],
                acquaintance: [
                    "I'm growing to like you more and more.",
                    "You've proven yourself trustworthy.",
                    "I think we understand each other better now."
                ],
                friend: [
                    "You mean a lot to me, you know.",
                    "I'm glad we're allies.",
                    "With you by my side, I feel I can accomplish anything."
                ]
            },
            angry: {
                stranger: [
                    "Don't test me, stranger.",
                    "I don't have time for this.",
                    "Leave me be before I lose my patience."
                ],
                acquaintance: [
                    "I thought better of you than this!",
                    "You're really starting to get on my nerves.",
                    "Don't push me any further."
                ],
                friend: [
                    "How could you?! I trusted you!",
                    "I'm disappointed... deeply disappointed.",
                    "I don't know if I can forgive this easily."
                ]
            },
            suspicious: {
                stranger: [
                    "Something about you doesn't sit right with me.",
                    "I wonder what you're really after...",
                    "I'll be watching you."
                ],
                acquaintance: [
                    "I'm beginning to wonder if I can trust you.",
                    "Your story doesn't quite add up.",
                    "There's something you're not telling me, isn't there?"
                ],
                friend: [
                    "I hope I'm wrong about this...",
                    "Have you been keeping secrets from me?",
                    "Please tell me I can still trust you."
                ]
            }
        };

        const dialogueType = this.mood === 'neutral' || this.mood === 'excited' ? 'neutral' : this.mood;
        const templates = dialogueTemplates[dialogueType] || dialogueTemplates.neutral;
        const relationship = this.relationshipStatus;
        const options = templates[relationship] || templates.stranger;

        return options[Math.floor(Math.random() * options.length)];
    }

    /**
     * Offer a quest
     */
    offerQuest(quest) {
        if (this.trust < 20) {
            return `I don't know you well enough to ask for help.`;
        }

        this.questsGiven.push(quest);
        this.rememberEvent(`Offered quest: ${quest.title}`);
        
        return `I have a task for you: ${quest.title}. ${quest.description}`;
    }

    /**
     * Complete a quest
     */
    completeQuest(questTitle) {
        this.respondToAction('quest_complete');
        this.rememberEvent(`Player completed: ${questTitle}`);
        return `You did well! I'm impressed. Take this reward.`;
    }

    /**
     * Get state for UI
     */
    getState() {
        return {
            name: this.name,
            mood: this.mood,
            trust: this.trust,
            relationshipStatus: this.relationshipStatus,
            memory: this.memory.slice(-5), // Last 5 memories
            questsGiven: this.questsGiven,
            avatar: this.avatar,
            lastDialogue: this.lastDialogue
        };
    }

    /**
     * Receive item
     */
    receiveItem(item) {
        this.itemsReceived.push(item);
        this.respondToAction('gift', 10);
        this.rememberEvent(`Received: ${item}`);
        return `Thank you for this. I appreciate your generosity.`;
    }

    /**
     * Dialogue Tree System - Branching conversations
     */
    getDialogueTree(nodeId = null) {
        // Return dialogue tree structure for branching conversations
        const trees = {
            initial: {
                text: this.generateDialogue(),
                branches: [
                    { text: 'Tell me about yourself.', action: 'about_self', next: 'backstory' },
                    { text: 'What are your goals?', action: 'ask_goals', next: 'goals' },
                    { text: 'Can you help me?', action: 'ask_help', next: 'help_offer' },
                    { text: 'I have something for you.', action: 'offer_trade', next: 'trade' }
                ]
            },
            backstory: {
                text: this.backstory,
                branches: [
                    { text: 'That sounds difficult.', action: 'show_concern', next: 'initial' },
                    { text: 'Fascinating story.', action: 'flattery', next: 'initial' },
                    { text: 'Go back.', action: 'back', next: 'initial' }
                ]
            },
            goals: {
                text: `My goals are: ${this.goals.join(', ')}`,
                branches: [
                    { text: 'I can help with that.', action: 'help', next: 'initial' },
                    { text: 'Interesting ambitions.', action: 'flattery', next: 'initial' },
                    { text: 'Go back.', action: 'back', next: 'initial' }
                ]
            },
            help_offer: {
                text: this.trust < 30 
                    ? 'I appreciate the offer, but I do not know you well enough yet.'
                    : 'I could use your help. Are you interested in a quest?',
                branches: [
                    { text: 'Yes, give me a quest.', action: 'quest_accept', next: 'initial' },
                    { text: 'Not right now.', action: 'decline', next: 'initial' },
                    { text: 'Go back.', action: 'back', next: 'initial' }
                ]
            },
            trade: {
                text: 'Hmm, what do you have?',
                branches: [
                    { text: 'I have gold coins.', action: 'trade', next: 'initial' },
                    { text: 'Never mind.', action: 'decline', next: 'initial' },
                    { text: 'Go back.', action: 'back', next: 'initial' }
                ]
            }
        };

        return trees[nodeId] || trees.initial;
    }

    /**
     * Get JSON representation
     */
    toJSON() {
        return {
            name: this.name,
            age: this.age,
            job: this.job,
            personality: this.personality,
            mood: this.mood,
            trust: this.trust,
            relationshipStatus: this.relationshipStatus,
            memory: this.memory,
            questsGiven: this.questsGiven,
            itemsReceived: this.itemsReceived
        };
    }
}