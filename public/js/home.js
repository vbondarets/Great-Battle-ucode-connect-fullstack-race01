let card_list = [];

async function get_card(url,body){
    let res = await fetch(url, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(body)
    });
    let resp = await res.json();//Otvet ot servera
    return resp;
}
async function geting_deck(url){
    let res = await fetch(url, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        }
    });
    let resp = await res.json();//Otvet ot servera
    return resp;
}


async function get_user(url,body){
    let res = await fetch(url, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        }
    });
    let resp = await res.json();//Otvet ot servera
    return resp;
}
async function logout(url){
    let res = await fetch(url, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        }
    });
    let resp = await res.json();
    return resp;
}
async function data_filling(){
    let user_data = await get_user('/userdata')
    document.getElementById("username").innerHTML = user_data.login;
    document.getElementById("settings_username").innerHTML = user_data.login;
    if(user_data.avatar == null){
        // console.log('no avatar')
    }
    else {
        document.getElementById("profile_image").src = "../resources/img/users_avatars/" + user_data.avatar;
    }
    // await get_deck();
}

function redirect(dest){
    window.location.replace(dest)
}

data_filling();

function PreviewImage() {
    var oFReader = new FileReader();
    oFReader.readAsDataURL(document.getElementById("uploadImage").files[0]);
    console.log(document.getElementById("uploadImage").files)

    oFReader.onload = function (oFREvent) {
        document.getElementById("settings_profile_image").src = oFREvent.target.result;
    };
};

var homeWindow = {
    play: document.getElementById("play_window"),// = "inline",
    deck: document.getElementById("deck_window"), // = "none",
    settings: document.getElementById("settings_window"),// = "none",
    dialog: document.getElementById("dialog_window") //= "none"
}
var window_buf = homeWindow.play;
open_play()
function open_play(){
    homeWindow.play.style.display = "inline",
    document.getElementById("play_button").setAttribute("onclick", "")
    homeWindow.deck.style.display = "none",
    document.getElementById('deck_button').setAttribute("onclick", "open_deck()")
    homeWindow.settings.style.display = "none"
    document.getElementById('settings_button').setAttribute("onclick", "open_settings()")
    window_buf = homeWindow.play;
}
async function open_deck(){
    homeWindow.play.style.display = "none",
    document.getElementById('play_button').setAttribute("onclick", "open_play()")
    homeWindow.deck.style.display = "inline",
    document.getElementById('deck_button').setAttribute("onclick", "")
    homeWindow.settings.style.display = "none"
    document.getElementById('settings_button').setAttribute("onclick", "open_settings()")
    window_buf = homeWindow.deck;
    for(let i = 1; i <=26; i++){
        await get_cards({id: i});
        await card_list_loading(i)
    }
    await get_deck();
    // console.log('deka')
    get_deck_price()
}
function open_settings(){
    //card.setAttribute("onclick", "addToDeck("+card_id+")")
    homeWindow.play.style.display = "none",
    document.getElementById('play_button').setAttribute("onclick", "open_play()")
    homeWindow.deck.style.display = "none",
    document.getElementById('deck_button').setAttribute("onclick", "open_deck()")
    homeWindow.settings.style.display = "inline"
    document.getElementById('settings_button').setAttribute("onclick", "")
    window_buf = homeWindow.settings;
}
function open_dialog(){
    homeWindow.play.style.display = "none",
    homeWindow.deck.style.display = "none",
    homeWindow.settings.style.display = "none"
    homeWindow.dialog.style.display = "inline"
    document.querySelector("button[type=submit]").addEventListener("click", async function (e) {
        // console.log("vihod");
        e.preventDefault();
        let res = await logout('/logout');
        if(res.status){
            redirect('/');
        }
        // redirect('/login');
        
    });
    document.querySelector("button[type=dismit]").addEventListener("click", function () {
        homeWindow.dialog.style.display = "none";
        window_buf.style.display = "inline";
    })
}
async function get_cards(body){
    let card = await get_card('/get_card', body);
    card_list.push(card);
}
async function get_deck(){
    // for(let i = 1; i <=26; i++){
    //     //await get_cards({id: i});
    //     await card_list_loading(i)
    // }
    // let slots = document.getElementsByClassName("deck_slot")
    // for(let i = 0; i <=7; i++){
    //     if(slots[i].status == "full"){
    //         slots[i].status = "empty"
    //     }
    // }


    let deck = []
    deck = await geting_deck('/get_deck');
    // console.log(deck);
    if(deck.error == "NO DECK"){
        // console.log("decki netu")
        return;
    }
    else{
        for(let i = 1; i<=8; i++){
            // console.log('+')
            await addToDeck(deck['slot'+ String(i)]);
        }
    }
}


async function card_list_loading(card_id){
    // let card_id = 2;
    let card = document.getElementById("list_card_" + String(card_id))
    let card_img = card.querySelector('img');
    let org ="heroes/"
    if(card_id > 10 && card_id < 21){
        org ="villians/"
    }
    if(card_id >= 21){
        org ="stones/"
    }
    card_img.src = "../resources/img/cards/png/"+ org +card_list[card_id-1].file;
    let card_price = card.querySelector('#price_list_card_' + String(card_id));
    card_price.innerHTML = card_list[card_id-1].price;
    let card_hp = card.querySelector('#hp_list_card_' + String(card_id));
    card_hp.innerHTML = card_list[card_id-1].hp;
    /////////////////fixing
    if(card_list[card_id-1].hp >= 10){
        if(card_hp.style.left != "26.5vw"){
            card_hp.style.left ="139px"
        }
        
        // console.log(card_id)
        // console.log('hp: ' + card_list[card_id-1].hp)
    }
    let card_damage = card.querySelector('#damage_list_card_' + String(card_id));
    card_damage.innerHTML = card_list[card_id-1].damage;
    if(card_list[card_id-1].damage >= 10){
        card_damage.style.left ="25px"
        // console.log('hp: ' + card_list[card_id-1].damage)
    }
}
function get_deck_price(){
    let deck_price = 0;
    let fullSlotCount = 0;
    let slots = document.getElementsByClassName("deck_slot")
    for(let i = 0; i <=7; i++){
        if(slots[i].status == "full"){
            fullSlotCount = fullSlotCount + 1;
            // console.log(slots[i].id)
            let card = slots[i].querySelector('.card');
            let card_id = card.id[10];
            if (card.id[11] != undefined){
                card_id += card.id[11]
            }
            let card_price = card.querySelector('#price_list_card_' + String(card_id));
            deck_price = deck_price + parseInt(card_price.innerHTML)

        }
        else if(slots[i].status == "empty"){
            continue;
        }
    }
    if(fullSlotCount != 0){
        deck_price = deck_price / parseInt(fullSlotCount)
    }
    else {
        deck_price = 0
    }
    deck_price = deck_price.toFixed(1)
    deck_price = String(deck_price);
    if(deck_price[2] == 0){
        deck_price = deck_price[0]
    }
    // console.log(deck_price[0])
    let price_label = document.getElementById("deck_price_label");
    // console.log("aboba")
    price_label.innerHTML = "deck price: " + deck_price
    // console.log(deck_price);

}
async function addToDeck(id){
    let slots = document.getElementsByClassName("deck_slot")
    for(let i = 0; i <=7; i++){
        if(slots[i].status == undefined){
            slots[i].status = "empty"
        }
    }
    for(let i = 0; i <=7; i++){
        if(slots[i].status == "empty"){
            slots[i].status = "full"
            let card = document.getElementById("list_card_" + String(id))
            card.onclick= "";
            card.style.height = "690.982px"
            if(i > 3){
                slots[i].style.marginTop = "-10vh"
            }
            let card_price = card.querySelector('#price_list_card_' + String(id));
            card_price.style.fontSize = "60px";
            card_price.style.position = "relative";
            card_price.style.bottom = "81.5vh"
            card_price.style.left = "2.3vw"
            let card_hp = card.querySelector('#hp_list_card_' + String(id));
            card_hp.style.fontSize = "60px";
            card_hp.style.position = "relative";
            card_hp.style.bottom = "20vh"
            card_hp.style.left = "27.5vw"
            if(card_hp.innerHTML >= 10){
                // console.log("sdvig 1")
                card_hp.style.left = "26.5vw"
            }
            let card_damage = card.querySelector('#damage_list_card_' + String(id));
            card_damage.style.fontSize = "60px";
            card_damage.style.position = "relative";
            card_damage.style.bottom = "28.8vh"
            card_damage.style.left= "2.3vw"
            if(card_damage.innerHTML >= 10){
                card_damage.style.left = "1.4vw"
            }
            // console.log(card);
            slots[i].append(card);
            break;
        }
        else{
            continue;
        }
    }

    // console.log(slots)
    get_deck_price()
}
async function removeFromDeck(id){
    // console.log("Slot id: "+ id)
    let slot = document.getElementById("deck_slot" + id)
    if(id > 3){
        slot.style.marginTop = "+10vh"
    }
    if(slot.status == "full"){
        slot.status = "empty"
        // console.log("slot is full")
        let card = slot.querySelector('.card')
        let card_id = card.id[10];
        if (card.id[11] != undefined){
            card_id += card.id[11]
        }
        let card_class;
        if(card_id <= 10){
            card_class = "heroes"
        }
        else if (card_id > 10 && card_id <=20){
            card_class = "villians"
        }
        else{
            card_class = "stones"
        }
        let list = document.getElementById(card_class + "_list")
        // console.log(card_id)
        // console.log(card_class)
        // console.log(list)
        //207.3
        //returning default style
        card.style.height ="207.3px"
        let card_price = card.querySelector('#price_list_card_' + String(card_id));
        card_price.style.fontSize = "20px";
        card_price.style.position = "absolute";
        card_price.style.bottom = "180px"
        card_price.style.left = "30px"

        let card_hp = card.querySelector('#hp_list_card_' + String(card_id));
        card_hp.style.fontSize = "20px";
        card_hp.style.position = "absolute";
        card_hp.style.bottom = "5px"
        card_hp.style.left = "143.5px"
        // console.log("hp: "+ card_hp.innerHTML)
        if(card_hp.innerHTML >= 10){
            // console.log("sdvig 2")
            card_hp.style.left = "139px"
        }

        let card_damage = card.querySelector('#damage_list_card_' + String(card_id));
        card_damage.style.fontSize = "20px";
        card_damage.style.position = "absolute";
        card_damage.style.bottom = "5px"
        card_damage.style.left = "30px"
        if(card_damage.innerHTML >= 10){
            card_damage.style.left = "24px"
        }

        card.setAttribute("onclick", "addToDeck("+card_id+")")
        list.prepend(card)

    }
    else{
        // console.log("slot is empty")
        return;
    }
    get_deck_price()

}

async function slotsFillCheck(){
    let slots = document.getElementsByClassName("deck_slot")
    let status = "ok";
    for(let i = 0; i <=7; i++){
        if(slots[i].status == "full"){
            continue;
        }
        else{
            status = "empty"
            break;
        }
    }
    return status;
}
function hideError(){
    let message = document.getElementById('deck_error_message')
        message.style.display = "none"
}
async function send_deck(url, body){
    let res = await fetch(url, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(body)
    });
    let resp = await res.json();//Otvet ot servera
    //console.log(resp);
    return resp;
}
document.querySelector("#deck_save_button").addEventListener("click", async function (e) {
    // console.log("otpravka")
    let chekingResult;
    chekingResult = await slotsFillCheck();
    // console.log(chekingResult)
    if(chekingResult == "ok"){
        let slots = document.getElementsByClassName("deck_slot")
        let slots_data = [];
        for(let i = 0; i <=7; i++){
            let card = slots[i].querySelector('.card')
            let card_id = card.id[10];
            if (card.id[11] != undefined){
                card_id += card.id[11]
            }
            slots_data.push(card_id);
            // if(i == 7){
            //     console.log(slots_data)
            // }
        }
        // console.log(slots_data)
        let body = {
            slot1: slots_data[0],
            slot2: slots_data[1],
            slot3: slots_data[2],
            slot4: slots_data[3],
            slot5: slots_data[4],
            slot6: slots_data[5],
            slot7: slots_data[6],
            slot8: slots_data[7]
        }
        let res = await send_deck("/save_deck", body);
        // console.log(res);
        if(res.status == "OK"){
            let message = document.getElementById('deck_error_message')
            message.innerHTML = "deck updated"
            message.style.display = "block"
            // console.log(message.style.display)
            setTimeout(hideError, 2000)
        }

    }
    else{
        let message = document.getElementById('deck_error_message')
        message.innerHTML= "fill all slots"
        message.style.display = "block"
        // console.log(message.style.display)
        setTimeout(hideError, 2000)
    }
    

});