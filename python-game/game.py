import random
import sys
import textwrap
from typing import List, Dict
from npc import NPC

NPC_TEMPLATES = {
    'aldric': {
        'name': 'Aldric the Mage',
        'age': 47,
        'job': 'Court Wizard',
        'location': 'Tower of Arcana',
        'personality': ['mysterious', 'wise', 'cautious'],
        'backstory': 'Once a powerful mage, now disillusioned with court politics.',
        'goals': ['Rediscover lost magic', 'Find a worthy apprentice'],
        'secrets': ['Fears his powers are fading'],
        'avatar': '🧙'
    },
    'elena': {
        'name': 'Elena the Ranger',
        'age': 34,
        'job': 'Monster Hunter',
        'location': 'Silverpine',
        'personality': ['brave', 'sarcastic', 'protective'],
        'backstory': 'Lost her family to a dragon. Now hunts monsters to protect others.',
        'goals': ['Find and slay the dragon'],
        'secrets': ['Dreams of revenge haunt her'],
        'avatar': '🏹'
    }
}

QUESTS = [
    {'title': 'Find the Lost Amulet', 'description': 'Search the Old Ruins to the east for my lost amulet.', 'reward': '50 gold coins'},
    {'title': 'Retrieve Rare Herbs', 'description': 'Gather moonflowers from the Enchanted Forest.', 'reward': '30 gold coins + Potion'},
]

class Game:
    def __init__(self):
        self.game_state = {
            'current_npc_key': 'aldric',
            'npc': NPC(NPC_TEMPLATES['aldric']),
            'inventory': [
                {'name': 'Gold Coins', 'value': 50, 'rarity': 'common', 'description': 'Universal currency'},
                {'name': 'Healing Potion', 'value': 30, 'rarity': 'common', 'description': 'Restores health'},
                {'name': 'Ancient Scroll', 'value': 100, 'rarity': 'rare', 'description': 'Contains forbidden knowledge'},
                {'name': 'Silver Amulet', 'value': 75, 'rarity': 'uncommon', 'description': 'Provides protection'},
            ],
            'current_quest': None,
            'history': []
        }

    def print_header(self, text: str):
        print('='*len(text))
        print(text)
        print('='*len(text))

    def show_npc(self):
        npc = self.game_state['npc']
        print(f"{npc.avatar}  {npc.name} ({npc.job})")
        print(f"Mood: {npc.mood}  Trust: {npc.trust}%  Relationship: {npc.relationship}")
        print('-'*40)

    def show_dialogue(self, text: str):
        print(textwrap.fill(text, width=70))
        print()

    def show_options(self, options: List[str]):
        for i, opt in enumerate(options, 1):
            print(f"{i}. {opt}")
        print('0. Exit')

    def input_choice(self, max_choice: int) -> int:
        while True:
            choice = input('> ').strip()
            if choice.isdigit():
                val = int(choice)
                if 0 <= val <= max_choice:
                    return val
            print('Invalid choice. Enter the number of your selection.')

    def run(self):
        self.print_header('NPC Dialogue Game (Python CLI)')
        while True:
            npc = self.game_state['npc']
            self.show_npc()
            dialogue = npc.generate_dialogue()
            self.show_dialogue(dialogue)

            options = [
                'Tell me about yourself.',
                'What are your goals?',
                'Can you help me?',
                'Offer an item',
                'Switch NPC',
                'Show inventory',
                'Show memory',
                'Show debug'
            ]

            self.show_options(options)
            choice = self.input_choice(len(options))
            if choice == 0:
                print('Goodbye!')
                return
            action = options[choice-1]
            if action == 'Tell me about yourself.':
                npc.remember('Player asked about backstory')
                self.show_dialogue(npc.backstory)
            elif action == 'What are your goals?':
                npc.remember('Player asked about goals')
                self.show_dialogue('My goals: ' + ', '.join(npc.goals))
            elif action == 'Can you help me?':
                npc.remember('Player asked for help')
                if npc.trust < 30:
                    self.show_dialogue("I don't know you well enough to trust you with tasks.")
                else:
                    quest = random.choice(QUESTS)
                    self.game_state['current_quest'] = quest
                    self.show_dialogue(npc.offer_quest(quest))
            elif action == 'Offer an item':
                self.offer_item()
            elif action == 'Switch NPC':
                self.switch_npc()
            elif action == 'Show inventory':
                self.show_inventory()
            elif action == 'Show memory':
                self.show_memory()
            elif action == 'Show debug':
                print(npc.to_dict())
            print('\n')

    def show_inventory(self):
        inv = self.game_state['inventory']
        if not inv:
            print('(Inventory empty)')
            return
        for i, item in enumerate(inv, 1):
            print(f"{i}. {item['name']} ({item['rarity']}) - {item['description']} - Value: {item['value']}")
        print('0. Back')
        choice = self.input_choice(len(inv))
        if choice == 0:
            return
        item = inv[choice-1]
        print(f"Offer {item['name']} to {self.game_state['npc'].name}? (y/n)")
        resp = input('> ').strip().lower()
        if resp == 'y':
            npc = self.game_state['npc']
            resp_text = npc.receive_item(item)
            self.game_state['inventory'].pop(choice-1)
            print(resp_text)
        else:
            print('You keep the item.')

    def offer_item(self):
        self.show_inventory()

    def show_memory(self):
        mem = self.game_state['npc'].memory
        if not mem:
            print('(No memories)')
            return
        for m in mem[-10:]:
            print(f"- {m['event']} ({m['importance']})")

    def switch_npc(self):
        keys = list(NPC_TEMPLATES.keys())
        for i, k in enumerate(keys, 1):
            print(f"{i}. {NPC_TEMPLATES[k]['name']}")
        print('0. Cancel')
        choice = self.input_choice(len(keys))
        if choice == 0:
            return
        key = keys[choice-1]
        self.game_state['current_npc_key'] = key
        self.game_state['npc'] = NPC(NPC_TEMPLATES[key])
        print(f"Switched to {NPC_TEMPLATES[key]['name']}")


if __name__ == '__main__':
    g = Game()
    g.run()
