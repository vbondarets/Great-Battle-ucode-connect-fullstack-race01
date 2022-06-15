const pool = require('./db');

class Model {
    constructor(table_name) {
        this.table = table_name;
    }
    check(login){
        return pool.execute(`SELECT * FROM ${this.table} WHERE name=${login}`)
    }
    find(ID) {
        return pool.execute(`SELECT * FROM ${this.table} WHERE ID=${ID}`)
            .then(res => {
                // if(res[0].length > 0){
                //     return super.find(res[0][0]['ID']);
                // }
                // else{
                //     return "NOT FOUND";
                // }
                        
                for(let key in res[0][0]) {
                    if(res[0][0].hasOwnProperty(key)){
                        // console.log(res[0][0])
                        let newValue = res[0][0][key];
                        if(typeof(newValue) == 'string')
                            eval(`this.${key}` + " = " + "'" + newValue + "'");
                        else
                            eval(`this.${key}` + " = " + newValue);
                    }
                }
            })
            .catch(err => {
                console.error(err.message);
                pool.end();
            })
    }
    delete() {
        return pool.execute(`SELECT * FROM ${this.table} WHERE id=${this.ID}`)
            .then(res => {
                if(res[0].length != 0) {
                    return pool.execute(`DELETE FROM ${this.table} WHERE id=${this.ID}`);
                }
                throw "Not exist";
            })
            .then(res => {
                console.log("DELETED SUCCESFULLY");
            })
            .catch(err => {
                console.error(err);
                pool.end();
            })
    }
    save() {

    }
    get_deck(ID) {
        return pool.execute(`SELECT * FROM ${this.table} WHERE user_id=${ID}`)
            .then(res => {
                        
                for(let key in res[0][0]) {
                    if(res[0][0].hasOwnProperty(key)){
                        // console.log(res[0][0])
                        let newValue = res[0][0][key];
                        if(typeof(newValue) == 'string')
                            eval(`this.${key}` + " = " + "'" + newValue + "'");
                        else
                            eval(`this.${key}` + " = " + newValue);
                    }
                }
            })
            .catch(err => {
                console.error(err.message);
                pool.end();
            })
    }
}
    

module.exports = Model;