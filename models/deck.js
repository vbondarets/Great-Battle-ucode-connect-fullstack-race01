const Model = require("../model");
const pool = require('../db');

class Deck extends Model{
    constructor(user_id = null, slot1 = null, slot2 = null, slot3 = null, slot4 = null, slot5 = null, slot6 = null, slot7 = null, slot8 = null) {
        super('deck')

        this.user_id = user_id;
        this.slot1 = slot1;
        this.slot2 = slot2;
        this.slot3 = slot3;
        this.slot4 = slot4;
        this.slot5 = slot5;
        this.slot6 = slot6;
        this.slot7 = slot7;
        this.slot8 = slot8;
    }
    find(id) {
            return pool.execute(`SELECT * FROM deck WHERE user_id=${id}`)
                .then(res =>{
                    // return super.find(res[0][0]['ID']);
                    if(res[0].length > 0){
                        return "OK";
                    }
                    else{
                        return "NOT FOUND";
                    }
                })
                .catch(err => {
                    console.error("Error:\n" + err);
                    return "NOT FOUND";
                });
    }
    save(){
        return pool.execute(`INSERT INTO deck (user_id, slot1, slot2, slot3, slot4, slot5, slot6, slot7, slot8) VALUES('${this.user_id}', '${this.slot1}', '${this.slot2}', '${this.slot3}', '${this.slot4}', '${this.slot5}', '${this.slot6}', '${this.slot7}', '${this.slot8}')`)
            .then(res => {
                // this.ID = res[0].insertId;
                // console.log("INSERTED");
                return "OK"
            })
            .catch(err => {
                console.log("\noshibka: " + err);
                //console.error(err.message);
                return "ERROR";
            });    
    }
    update(){
        return pool.execute(`UPDATE deck SET slot1 ='${this.slot1}', slot2 ='${this.slot2}', slot3 ='${this.slot3}', slot4 ='${this.slot4}', slot5 ='${this.slot5}', slot6 ='${this.slot6}', slot7 ='${this.slot7}', slot8 ='${this.slot8}' WHERE user_id=${this.user_id}`)
        .then(res => {
            // console.log(this.user_id + " Deck updated");
            return "OK"
        })
        .catch(err => {
            console.error(err);
            return "FAIL";
        });
    }
    get() {
            return pool.execute(`SELECT * FROM deck WHERE user_id=${this.user_id}`)
                .then(res =>{
                    return super.get_deck(res[0][0]['user_id']);
                    // return "OK";
                })
                .catch(err => {
                    console.error("Error:\n" + err);
                    return "NOT FOUND";
                });
    }
}

module.exports = Deck;