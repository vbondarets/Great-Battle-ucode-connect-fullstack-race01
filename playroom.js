const Card = require("./models/card");

class Multiset {
    _backing = new Map();
    add(value) {
        if (this._backing.has(value)) {
            this._backing.set(value, 1 + this._backing.get(value));
        } else {
            this._backing.set(value, 1);
        }
    }

    delete(value) {
        if (this._backing.get(value) > 0) {
            this._backing.set(value, this._backing.get(value) - 1);
        } else {
            //do nothing
        }
    }

    get(value) {
        if (this._backing.get(value) > 0) {
            return this._backing.get(value);
        } else {
            return 0;
        }
    }

	clear() {
		this._backing.clear();
	}

	has(value) {
		return this._backing.get(value) > 0;
	}
}

class PlayRoom {
	clients;
	turn;
	tablesize;

	constructor(clientA, clientB) {
		let room = this;
		this.tablesize = 5;
		this.handsize = 5;
		this.maxmana = 10;
		this.decksize = 8;
		this.maxhp;
		this.clients = [];
		this.clients[0] = clientA;
		this.clients[0].gameId = 0;
		this.clients[1] = clientB;
		this.clients[1].gameId = 1;
		this.clients[0].oponent = this.clients[1];
		this.clients[1].oponent = this.clients[0];

		this.turn = parseInt(Math.random() * 1.99);
		this.activeP = this.clients[this.turn];

		for(let client of this.clients) {
			client.onclose = function() {
				client.oponent.send(JSON.stringify({disconnected:true}));
			}
			client.mana = 3;
			client.table = [];
			client.tablecount = 0;
			client.hands = new Multiset();
			client.hp = 40;
			client.currentUsedCards = new Multiset();
			for(let i = 0; i < this.tablesize; i++) client.table.push(-1);
			client.send(
				JSON.stringify(
					{
						gameId: client.gameId,
						turn: this.turn,
						oponent: client.oponent.user.login,
						id: client.user.id,
						oid: client.oponent.user.id
					}
				)
			);

			client.onmessage = function(e) {
				if(room.turn != client.gameId) {console.warn(`current turn is ${room.turn} but ${client.gameId} tries to move`); return};
				let json;
				try {
					json = JSON.parse(e.data);
				} catch (error) {
					console.warn(error);
					return;
				}
				if(json.card)
					room.placeCard(json.card, json.slot);
				if(json.useon)
					room.useCard(json.slot, json.useon);
				if(json.skip || room.activeP.currentUsedCards.size == room.activeP.tablecount && room.activeP.mana === 0)
					room.nextTurn();
				
			}
		}

		this.giveCards();
	}

	placeCard(id, slot) {
		if(typeof id !== "number") {console.warn("id is not a number"); return};
		if(id < 0) {console.warn("id is less than 0"); return};
		if(this.activeP.table[slot] !== -1) {console.warn("already occupied slot"); return};
		if(!this.activeP.hands.has(id)) {console.warn("player has no such card"); return};
		this.activeP.hands.delete(id);
		this.activeP.table[slot] = this.cardbyid(id);
		this.activeP.mana -= this.activeP.table[slot].price;
		this.activeP.tablecount++;
		this.sendUpdate();
	}

	useCard(slot, usedon) {
		
		if(typeof slot !== "number") {console.warn("slot is not a number"); return};
		if(this.activeP.currentUsedCards.has(slot)) {console.warn("card aleady been used"); return};
		this.activeP.currentUsedCards.add(slot);
		if(this.activeP.table[slot] === -1) {console.warn("there is no card in the slot to use"); return};
		if(usedon == -1 && this.activeP.oponent.tablecount == 0) {
			this.activeP.oponent.hp -= this.activeP.table[slot].damage;
			if(this.activeP.oponent.hp <= 0) {
				for(let clietn of this.clients) {
					clietn.send(JSON.stringify({
						win: this.activeP.gameId
					}));
				}
			}
			this.sendUpdate();
		}
		if(usedon === -1)return;
		if(this.activeP.oponent.table[usedon] === -1) {console.warn("there is no card in the slot to use on"); return};
		this.activeP.oponent.table[usedon].hp -= this.activeP.table[slot].damage;
		if(this.activeP.oponent.table[usedon].hp <= 0) this.killCard(this.activeP.oponent.gameId, usedon);
		this.sendUpdate();
	}

	giveCards() {
		if(this.activeP.hands.size == 8) return;
		let cardId = parseInt(Math.random() * 10) + 1;
		let card = this.cardbyid(cardId); 
		this.activeP.hands.add(card.id);
		this.activeP.send(JSON.stringify(card));
	}

	sendUpdate() {
		for(let client of this.clients) {
			client.send(JSON.stringify({
				me: {
					mana: client.mana,
					hp: client.hp,
					table: client.table
				},
				oponent: {
					mana: client.oponent.mana,
					hp: client.oponent.hp,
					table: client.oponent.table
				}
			}));
		}
	}

	cardbyid(id) {
		let cards = [
{ id: 1,  name: 'Black Panther', 	price: 2, hp: 3, 	damage: 2, file: 'black_panther.png'},
{ id: 2,  name: 'Capitan America',	price: 3, hp: 3, 	damage: 4, file: 'captain_amerika.png'},
{ id: 3,  name: 'Cyclop', 			price: 1, hp: 1, 	damage: 2, file: 'cyclop.png'},
{ id: 4,  name: 'dardevil', 		price: 2, hp: 3, 	damage: 3, file: 'dardevil.png'},
{ id: 5,  name: 'Doctor Strange', 	price: 6, hp: 10, 	damage: 10, file: 'doctor_strange.png'},
{ id: 6,  name: 'Hulk', 			price: 5, hp: 8, 	damage: 8, file: 'hulk.png'},
{ id: 7,  name: 'Iron Man', 		price: 4, hp: 4,	damage: 6, file: 'iron_man.png'},
{ id: 8,  name: 'Spider Man', 		price: 3, hp: 2, 	damage: 6, file: 'spider_man.png'},
{ id: 9,  name: 'Thor', 			price: 4, hp: 8, 	damage: 2, file: 'thor.png'},
{ id: 10, name: 'Wolverine', 		price: 1, hp: 3, 	damage:1, file: 'wolverine.png'}/*,
{ id: 11, name: 'Doom', 			price: 3, hp: 1, 	damage:6, file: 'doom.png'},
{ id: 12, name: 'Electro', 			price: 2, hp: 1, 	damage:3, file: 'electro.png'},
{ id: 13, name: 'Galactus', 		price: 8, hp: 16,	damage:2, file: 'galactus.png'},
{ id: 14, name: 'Goblin', 			price: 3, hp: 6, 	damage:1, file: 'goblin.png'},
{ id: 15, name: 'Kraven', 			price: 1, hp: 1, 	damage:2, file: 'kraven.png'},
{ id: 16, name: 'Loki', 			price: 5, hp: 4, 	damage:8, file: 'loki.png'},
{ id: 17, name: 'Red Skull', 		price: 1, hp: 1, 	damage:1, file: 'red_skull.png'},
{ id: 18, name: 'Vulture', 			price: 2, hp: 2, 	damage:3, file: 'stervyatnik.png'},
{ id: 19, name: 'Tanos', 			price: 9, hp: 12, 	damage:12, file: 'tanos.png'},
{ id: 20, name: 'Venom', 			price: 7, hp: 7, 	damage:9, file: 'venom.png'}*/]
		return cards[id - 1];
	}

	killCard(gameId, slot) {
		this.clients[gameId].table[slot] = -1;
		this.clients[gameId].tablecount--;
	}

	nextTurn() {
		this.activeP.currentUsedCards.clear();
		this.turn = this.turn ? 0 : 1;
		this.activeP = this.clients[this.turn];
		for(let client of this.clients) {
			client.send(JSON.stringify({turn: this.turn}));
			if(client.mana < this.maxmana) client.mana++;
		}
		this.giveCards();
		this.sendUpdate();
	}
}

module.exports = PlayRoom;