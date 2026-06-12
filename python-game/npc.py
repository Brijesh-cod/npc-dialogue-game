import random
import time
from typing import List, Dict

class NPC:
    def __init__(self, config: Dict):
        self.name = config.get('name', 'NPC')
        self.age = config.get('age', 30)
        self.job = config.get('job', 'Wanderer')
        self.location = config.get('location', 'Village')
        self.personality = config.get('personality', [])
        self.backstory = config.get('backstory', 'A shadowed past')
        self.goals = config.get('goals', [])
        self.secrets = config.get('secrets', [])
        self.avatar = config.get('avatar', '')

        self.mood = 'neutral'
        self.trust = 0
        self.relationship = 'stranger'
        self.memory: List[Dict] = []
        self.quests_given: List[Dict] = []
        self.items_received: List[str] = []

    def remember(self, event: str, importance: str = 'normal'):
        self.memory.append({'timestamp': time.time(), 'event': event, 'importance': importance, 'mood': self.mood})
        if len(self.memory) > 50:
            self.memory.pop(0)

    def respond_to_action(self, action: str, value: int = 10):
        mapping = {
            'help': 15,
            'insult': -20,
            'betrayal': -30,
            'gift': 10,
            'lie': -15,
            'honesty': 10,
            'flattery': 5,
            'threat': -25,
            'trade': 5,
            'quest_complete': 20,
            'quest_fail': -10
        }
        change = mapping.get(action, value)
        self.trust = max(0, min(100, self.trust + change))
        # update relationship
        if self.trust < 20:
            self.relationship = 'stranger'
        elif self.trust < 40:
            self.relationship = 'acquaintance'
        elif self.trust < 60:
            self.relationship = 'friendly'
        elif self.trust < 80:
            self.relationship = 'friend'
        else:
            self.relationship = 'close friend'
        self.remember(f'Player {action}ed me', 'important')
        self.update_mood()

    def update_mood(self):
        moods = ['happy', 'neutral', 'suspicious', 'angry', 'friendly', 'fearful', 'excited', 'sad']
        if self.trust > 70:
            self.mood = random.choice(['friendly', 'happy'])
        elif self.trust > 40:
            self.mood = random.choice(['friendly', 'neutral'])
        elif self.trust > 20:
            self.mood = random.choice(['neutral', 'suspicious'])
        elif self.trust < 10:
            self.mood = random.choice(['suspicious', 'fearful'])
        else:
            self.mood = 'neutral'
        if random.random() < 0.1:
            self.mood = random.choice(moods)

    def generate_dialogue(self, player_msg: str = None) -> str:
        templates = {
            'neutral': {
                'stranger': [
                    "I'm not particularly interested in what you have to say.",
                    "Is there something you wanted?",
                    "I have other matters to attend to."
                ],
                'acquaintance': [
                    "So, what's on your mind?",
                    "Let's keep this brief, shall we?",
                    "What did you want to talk about?"
                ],
                'friend': [
                    "Always happy to help a friend.",
                    "What can I do for you?",
                    "You know you can trust me."
                ]
            },
            'friendly': {
                'stranger': [
                    "You seem like an interesting person. Tell me about yourself.",
                    "I have a good feeling about you.",
                    "Perhaps we could become friends?"
                ],
                'acquaintance': [
                    "I'm growing to like you more and more.",
                    "You've proven yourself trustworthy.",
                    "I think we understand each other better now."
                ],
                'friend': [
                    "You mean a lot to me, you know.",
                    "I'm glad we're allies.",
                    "With you by my side, I feel I can accomplish anything."
                ]
            },
            'angry': {
                'stranger': [
                    "Don't test me, stranger.",
                    "I don't have time for this.",
                    "Leave me be before I lose my patience."
                ],
                'acquaintance': [
                    "I thought better of you than this!",
                    "You're really starting to get on my nerves.",
                    "Don't push me any further."
                ],
                'friend': [
                    "How could you?! I trusted you!",
                    "I'm disappointed... deeply disappointed.",
                    "I don't know if I can forgive this easily."
                ]
            },
            'suspicious': {
                'stranger': [
                    "Something about you doesn't sit right with me.",
                    "I wonder what you're really after...",
                    "I'll be watching you."
                ],
                'acquaintance': [
                    "I'm beginning to wonder if I can trust you.",
                    "Your story doesn't quite add up.",
                    "There's something you're not telling me, isn't there?"
                ],
                'friend': [
                    "I hope I'm wrong about this...",
                    "Have you been keeping secrets from me?",
                    "Please tell me I can still trust you."
                ]
            }
        }
        mood_key = 'neutral' if self.mood in ('neutral', 'excited') else self.mood
        rel = self.relationship
        options = templates.get(mood_key, templates['neutral']).get(rel, templates['neutral']['stranger'])
        return random.choice(options)

    def offer_quest(self, quest: Dict) -> str:
        if self.trust < 20:
            return "I don't know you well enough to ask for help."
        self.quests_given.append(quest)
        self.remember(f'Offered quest: {quest.get("title")}', 'important')
        return f"I have a task for you: {quest.get('title')}. {quest.get('description')}"

    def complete_quest(self, title: str) -> str:
        self.respond_to_action('quest_complete')
        self.remember(f'Player completed: {title}')
        return "You did well! I'm impressed. Take this reward."

    def receive_item(self, item: Dict) -> str:
        self.items_received.append(item.get('name'))
        self.respond_to_action('gift', max(1, item.get('value', 0) // 20))
        self.remember(f'Received: {item.get("name")}')
        return f'Thank you for the {item.get("name")}. I appreciate your generosity.'

    def to_dict(self):
        return {
            'name': self.name,
            'age': self.age,
            'job': self.job,
            'mood': self.mood,
            'trust': self.trust,
            'relationship': self.relationship,
            'memory': self.memory[-5:],
            'quests_given': self.quests_given,
            'items_received': self.items_received
        }
