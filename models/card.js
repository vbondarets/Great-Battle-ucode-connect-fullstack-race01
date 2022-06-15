const Model = require("../model");
const pool = require('../db');

class Card extends Model{
    constructor(ID = null, price = null, name = null, hp = null, damage = null, file = null) {
        super('cards')

        this.ID = ID;
        this.price = price;
        this.name = name;
        this.hp = hp;
        this.damage = damage;
        this.file = file;
    }
    find(id) {
        if(id != null){
            return pool.execute(`SELECT * FROM cards WHERE ID=${id}`)
                .then(res =>{
                    // console.log(res);
                    //return res;
                    return super.find(res[0][0]['ID']);
                })
                .catch(err => {
                    console.error("Error:\n" + err);
                    return "FAIL";
                });
                // .catch(function(err) {
                //     console.log(err.message);
                // });
        }
    }
}

module.exports = Card;