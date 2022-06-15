const Model = require("../model");
const pool = require('../db');

class User extends Model {
    constructor(login = null, password = null,email = null,  id = null, avatar = null) {
        super('users');
        
        this.login = login;
        this.password = password;
        this.email = email;
        this.ID = id;
        this.avatar = avatar;
    }
    find(id) {
        if(id != null){
            return pool.execute(`SELECT ID FROM users WHERE id=${id}`)
                .then((res) =>{
                    if(res[0].length > 0){
                        return super.find(res[0][0]['ID']);
                    }
                    else{
                        return "NOT FOUND";
                    }
                    // return super.find(id);
                });
        }
        
        else {
            return pool.execute(`SELECT ID FROM users WHERE login='${this.login}'`)
                .then((res) =>{
                    if(res[0].length > 0){
                        // console.log(res)
                        return super.find(res[0][0]['ID']);
                    }
                    else
                        return "NOT FOUND";
                });
        }
    }
    delete() {
        super.delete();
    }
    save() {
        if(this.ID == null) {
            //INSERT
                return pool.execute(`INSERT INTO users (login, email, password) VALUES('${this.login}', '${this.email}', '${this.password}')`)
                .then(res => {
                    this.ID = res[0].insertId;
                    console.log("INSERTED");
                })
                .catch(err => {

                    console.log("\noshibka: " + err);
                    //console.error(err.message);
                    return err.message;
                });
        }
        else {
            //UPDATE
            return pool.execute(`UPDATE users SET 
            login='${this.login}',
            password='${this.password}',
            email='${this.email}'
            WHERE ID=${this.ID} `)

                .then(res => {
                    console.log("UPDATED");
                })
                .catch(err => {
                    console.error(err);
                    pool.end();
                });
        }
    }
    updatePassword(id, password){
        return pool.execute(`UPDATE users SET password ='${password}' WHERE id=${id}`)
        .then(res => {
            this.password = res[0].insertPassword;
            console.log(id + " Password updated");
        })
        .catch(err => {
            console.error(err);
            return "FAIL";
        });

    }
    updateAvatar(id, avatar){
        return pool.execute(`UPDATE users SET avatar ='${avatar}' WHERE id=${id}`)
        .then(res => {
            this.avatar = res[0].insertAvatar;
            //console.log(" Avatar updated");
        })
        .catch(err => {
            console.error(err);
            return "FAIL";
        });

    }
}

module.exports = User;
