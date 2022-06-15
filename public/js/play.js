async function get_users(url, body){
    let res = await fetch(url, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(body)
    });
    let resp = await res.json();
    return resp;
}

async function users_data(uid1, uid2){ //potom nado vstavit (uid1, uid2) kak parametri
	let users = await get_users("/get_users", {
		id1: uid1,
		id2: uid2
	});
	// console.log(users)
	return users;
}


async function set_users_data(u1, u2){
	let users = await users_data(u1, u2)
	// console.log(users)
	let myname = document.createElement("label");
	myname.innerHTML= users.login1;
	myname.id = "mynik";
	document.body.append(myname);

	let myavatar = document.createElement("img");
	myavatar.src= "../resources/img/users_avatars/" + users.avatar1;
	myavatar.id = "myavatar";
	document.body.append(myavatar);

	let opname = document.createElement("label");
	opname.innerHTML= users.login2;
	opname.id = "opnik";
	document.body.append(opname);

	let opavatar = document.createElement("img");
	opavatar.src= "../resources/img/users_avatars/" + users.avatar2;
	opavatar.id = "opavatar";
	document.body.append(opavatar);

	opavatar.onclick = function(e) {
		if(opcardcount) return;
		if(activecard && !activecard.used && turn == myid) {
				ws.send(JSON.stringify({
					slot: activecard.index,
					useon: -1
				}));
			activecard.used = true;
			showNum(activecard.x, activecard.y, "Used");
			ophp -= activecard.damage;
			let x = e.clientX / window.innerWidth * 100;
			let y = e.clientY / window.innerWidth * 100;
			console.log(x,y);
			showNum(x, y, `-${activecard.damage}`);
			setTimeout(function(){showNum(x, y, `${ophp}HP left`)}, 1000);
		}
	}
}

let timeLeft = 30;

let skip_timer = document.createElement("label");
skip_timer.id = "skip_timer";
skip_timer.innerHTML = ""
document.body.append(skip_timer);


let skipButton = document.createElement("div");
skipButton.id = "skip";
document.body.append(skipButton);

let mymanadiv = document.createElement("div");
mymanadiv.id = "mymana";
document.body.append(mymanadiv);

let oponentmana = document.createElement("div");
oponentmana.id = "oponentmana";
document.body.append(oponentmana);

let myname = document.createElement("div");
myname.id = "myname";
//document.body.append(myname);

let oponentname = document.createElement("div");
oponentname.id = "oponentname";
//document.body.append(oponentname);

let overlay = document.getElementById("overlay");

let mycards = [];
let maxmana = 10;
let mymana = 10;
let holdedcard;
let downmx;
let downmy;

let activecard;

let ophp = 40;

let floatingnums = [];
let floatingnumssize = 12;
let floatingnumcursor = 0;

for(let i = 0; i < floatingnumssize; i++) {
	floatingnums.push({x: 0, y: 0, a: 0, n: 0, dom: document.createElement("div")});
	floatingnums[i].dom.className = "FloatingNum";
	document.body.append(floatingnums[i].dom);
}

function showNum(x, y, n) {
	floatingnums[floatingnumcursor] = {x: x, y: y, a: 1, n: n, dom: floatingnums[floatingnumcursor].dom};
	floatingnums[floatingnumcursor++].dom.innerText = n;
	floatingnumcursor %= floatingnumssize;
}

setInterval(function() {
	for(let num of floatingnums) {
		num.y -= 1/12;
		num.a -= 1/60;
		num.dom.style.top = num.y + "vw";
		num.dom.style.left = num.x + "vw";
		num.dom.style.color = num.n < 0 ? `rgba(150, 200, 255, ${num.a})` : `rgba(150, 150, 150, ${num.a})`;
	}
}, 1000/20);


skipButton.onclick = function () {
	if(turn !== myid) return;
	ws.send(JSON.stringify({
		skip: true
	}));
	timeLeft = 30;
}

function setCardActive(card) {
	if(activecard) {
		activecard.img.style.boxShadow = "";
		activecard.active = false;
	}
	activecard = card;
	activecard.active = true;
	activecard.img.style.boxShadow = "0px 0px 8px #e245c0";
}

function placeCard(slot, card) {
	removeCardFromHands(card);

	card.placed = true;
	slot.card = card;
	card.x = slot.x;
	card.y = slot.y;
	ws.send(JSON.stringify({
		card: card.id,
		slot: slot.index
	}));

	
	
	card.index = slot.index;
	card.img.onmousedown = undefined;
	card.img.onclick = function() {
		setCardActive(card);
	}
}

function removeCardFromHands(card) {
	card.inhands = false;
	for(let i = card.index; i < mycards.length - 1; i++) {
		mycards[i] = mycards[i + 1];
		mycards[i].index = i;
	}
	mycards.pop();
}

let opcardcount = 0;

function createCard(card, oponentslot) {

	let cardImg = document.createElement("div");
	let actualimg = document.createElement("img");
	actualimg.src = `../resources/img/cards/png/heroes/${card.file}`;
	actualimg.className = "card";
	cardImg.className = "card";
	cardImg.append(actualimg);
	document.body.append(cardImg);

    cardImg.style.top = "33.5vw";
    cardImg.style.left = "82.3vw";

	card.img = cardImg;
	card.animspeed = 0.3;

//////////////////////////STATS//////////////////////
let cardPrice =  document.createElement("label");
cardPrice.innerHTML = card.price;
cardPrice.className = "statPrice";
cardPrice.style.left = "0.5vw"
if(card.price >= 10){
	cardPrice.style.left = "0.45vw"
}
cardImg.append(cardPrice);


let cardDamage = document.createElement("label");
cardDamage.innerHTML = card.damage;
cardDamage.className = "statDamage";
cardDamage.style.left = "0.1vw"
if(card.damage >= 10){
	cardDamage.style.left = "-0.2vw"
}
cardImg.append(cardDamage);

let cardHP  = document.createElement("label");
cardHP.innerHTML = card.hp;
cardHP.className = "statHP";
cardHP.style.left = "4.83vw"
if(card.hp >= 10){
	cardHP.style.left = "4.23vw"
}
cardImg.append(cardHP);




////////////////////////////////////////////////


	if(oponentslot === undefined) {
	card.index = mycards.push(card) - 1;
	card.inhands = true;
	card.dragged = false;

	cardImg.onmousedown = function(e) {
		if(card.placed) return;
		holdedcard = card;
		card.dragged = true;
		downmx = e.clientX;
		downmy = e.clientY;
		card.grabpos = {top: parseFloat(card.img.style.top.slice(0,-2)), left: parseFloat(card.img.style.left.slice(0,-1))};
		card.x = card.grabpos.left;
		card.y = card.grabpos.top;
	}
	} else {
		card.img.classList.add("OponentCard");
		card.index = oponentslot;
		oponenttableslots[oponentslot].card = card;
		card.x = oponenttableslots[oponentslot].x;
		card.y = oponenttableslots[oponentslot].y;

		card.img.onclick = function() {
			if(activecard && !activecard.used && turn == myid) {
				ws.send(JSON.stringify({
					slot: activecard.index,
					useon: card.index
				}));
				activecard.used = true;
				showNum(activecard.x, activecard.y, "Used");
			}
		}
	}
}

function pxtovw(px) {
	return px / window.innerWidth * 100;
}

document.onmousemove = function(e) {
	if(holdedcard && !holdedcard.placed) {
		holdedcard.x = holdedcard.grabpos.left + pxtovw(e.clientX - downmx);
		holdedcard.y = holdedcard.grabpos.top + pxtovw(e.clientY - downmy);
	}
}

document.onmouseup = function(e) {
	if(holdedcard) {
	holdedcard.dragged = false;

	for(let slot of mytableslots) {
		if(slot.card) continue;
		if((holdedcard.x-slot.x)*(holdedcard.x-slot.x) + (holdedcard.y-slot.y)*(holdedcard.y-slot.y) > 16) continue;
		if(turn != myid) continue;
		if(holdedcard.price > mymana) continue;
		placeCard(slot, holdedcard);
	}


	holdedcard = undefined;
	}
}

setInterval(function() {
	for(let card of mycards) {
		if(card.inhands && !card.dragged && !card.placed) {
			card.img.title = `PRICE: ${card.price} HP: ${card.hp}, DMG: ${card.damage}`;
			card.img.style.top = (parseFloat(card.img.style.top.slice(0, -2)) + 45 *  card.animspeed) / (1 + card.animspeed) + "vw";
			card.img.style.left = (parseFloat(card.img.style.left.slice(0, -2)) + (34.5 + card.index*6) *  card.animspeed) / (1 + card.animspeed) + "vw";
		} else {
			card.img.title = `PRICE: ${card.price} HP: ${card.hp}, DMG: ${card.damage}`;
			card.img.style.left = (parseFloat(card.img.style.left.slice(0, -2)) + card.x *  card.animspeed) / (1 + card.animspeed) + "vw";
			card.img.style.top = (parseFloat(card.img.style.top.slice(0, -2)) + card.y *  card.animspeed) / (1 + card.animspeed) + "vw";
		}
	}

	for(let tableslot of mytableslots) {
		if(tableslot.card) {
		tableslot.card.img.title = `PRICE: ${tableslot.card.price} HP: ${tableslot.card.hp}, DMG: ${tableslot.card.damage}`;
		tableslot.card.img.style.left = (parseFloat(tableslot.card.img.style.left.slice(0, -2)) + tableslot.card.x *  tableslot.card.animspeed) / (1 + tableslot.card.animspeed) + "vw";
		tableslot.card.img.style.top = (parseFloat(tableslot.card.img.style.top.slice(0, -2)) + tableslot.card.y *  tableslot.card.animspeed) / (1 + tableslot.card.animspeed) + "vw";
	}}

	for(let tableslot of oponenttableslots) {
		if(tableslot.card) {
		tableslot.card.img.title = `PRICE: ${tableslot.card.price} HP: ${tableslot.card.hp}, DMG: ${tableslot.card.damage}`;
		tableslot.card.img.style.left = (parseFloat(tableslot.card.img.style.left.slice(0, -2)) + tableslot.card.x *  tableslot.card.animspeed) / (1 + tableslot.card.animspeed) + "vw";
		tableslot.card.img.style.top = (parseFloat(tableslot.card.img.style.top.slice(0, -2)) + tableslot.card.y *  tableslot.card.animspeed) / (1 + tableslot.card.animspeed) + "vw";
	}}

}, 1000/60);

let mytableslots = [];
let oponenttableslots = [];

for(let i = 0; i < 5; i++) {
	mytableslots.push(
		{
			x: 26.9 + i*10,
			y: 29,
			index: i
		}
	);

	oponenttableslots.push(
		{
			x: 26.9 + i*10,
			y: 18,
			index: i
		}
	);
}

let ws = new WebSocket("wss://" + window.location.hostname);
let started = false;

function getCookie(name) {
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop().split(';').shift();
}

ws.onopen = function() {
	ws.send(getCookie("accessToken"));
}

let oponent;
let turn;
let myid;

function killOponentCard(slot) {}
function killMyCard(slot) {}

ws.onmessage = async function(e) {
	let data = JSON.parse(e.data);
	console.log(data);
	if(!started) {
		// console.log('tut')
		oponent = data.oponent;
		myid = data.gameId;
		turn = data.turn;
		started = true;
		overlay.style.display = "none";
		// console.log('igra poshla')
		// console.log(users.avatar1)
		set_users_data(data.id, data.oid);
		// console.log("zapusk_taimera");
setInterval(function() {
	document.getElementById("skip_timer").innerText = timeLeft;
	timeLeft--;
	if(timeLeft < 0) {
		skipButton.onclick();
	}

}, 1000);
		
	}

	if(data.hasOwnProperty("turn")) {
		turn = data.turn;
		timeLeft = 30;
		for(let slot of mytableslots) {
			if(slot.card)
			slot.card.used = false;
		}
	}

	if(data.disconnected) {
		overlay.style.display = "flex";
		overlay.innerText = "Your oponent has been disconnected.";
		overlay.onclick = function(){window.location.reload()};
	}
	
	if(data.me) {
		opcardcount = 0;
		mymana = data.me.mana;
		mymanadiv.style.width = 22.28 / maxmana * mymana + "vw";
		mymanadiv.title = `MANA: ${mymana}/10`;

		oponentmana.style.width = 22.28 / maxmana * data.oponent.mana + "vw";
		mymanadiv.title = `MANA: ${data.oponent.mana}/10`;
		for(let i = 0; i < data.oponent.table.length; i++) {
			let card = data.oponent.table[i];
			opcardcount += card !== -1 ?? 1;
			if(!oponenttableslots[i].card) {
				if(card !== -1)
					createCard(card, i);
			} else {
				if(card !== -1) {
					let hpdiff = card.hp - oponenttableslots[i].card.hp;
					if(hpdiff) {
						showNum(oponenttableslots[i].card.x, oponenttableslots[i].card.y, hpdiff);
						oponenttableslots[i].card.hp += hpdiff;
					}
				} else {
					showNum(oponenttableslots[i].card.x, oponenttableslots[i].card.y, "Dead");
					oponenttableslots[i].card.img.remove();
					delete oponenttableslots[i].card;
				}
			}
		}

		for(let i = 0; i < data.me.table.length; i++) {
			let card = data.me.table[i];
			if(mytableslots[i].card) {
				if(card !== -1) {
					let hpdiff = card.hp - mytableslots[i].card.hp;
					if(hpdiff) {
						showNum(mytableslots[i].card.x, mytableslots[i].card.y, hpdiff);
						mytableslots[i].card.hp += hpdiff;
					}
				} else {
					showNum(mytableslots[i].card.x, mytableslots[i].card.y, "Dead");
					mytableslots[i].card.img.remove();
					delete mytableslots[i].card;
				}
			}
		}
	}

	if(data.hasOwnProperty("win")) {
		overlay.style.display = "flex";
		overlay.innerText = (myid == data.win) ? "You Win" : "You Lose";
		overlay.onclick = function(){window.location.reload()};
	}

	

	if(data.id && data.hp) 
		createCard(data);
}