const PORT = process.env.PORT ?? 3000;
const express = require('express');
const path = require('path');
const nodemailer = require("nodemailer");
const User = require('./models/user');
const Card = require('./models/card');
const Deck = require('./models/deck');
const jwt = require('jsonwebtoken');
const bodyParser = require('body-parser');
var bcrypt = require('bcryptjs');
const multer = require('multer');
const PlayServer = require('./playserver')
const http = require('http')

const app = express();

const urlencodedParser = express.urlencoded({ extended: true });
const upload = multer({ dest: "./public/resources/img/users_avatars" });
app.use(bodyParser.json());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

const delay = ms => {
    return new Promise(r => setTimeout(() => r(), ms));
}

function getCookie(cname, cookie) {
    let name = cname + "=";
    let decodedCookie = decodeURIComponent(cookie);
    let ca = decodedCookie.split(';');
    for (let i = 0; i < ca.length; i++) {
        let c = ca[i];
        while (c.charAt(0) == ' ') {
            c = c.substring(1);
        }
        if (c.indexOf(name) == 0) {
            return c.substring(name.length, c.length);
        }
    }
    return "null";
}

const accessTokenSecret = 'vbondaretskpostavnyiezubovych';
const authenticateJWT = (req, res, next) => {
    const token = getCookie("accessToken", req.headers.cookie);
    jwt.verify(token, accessTokenSecret, (err, user) => {
        if (err) {
            res.redirect('/login');
        }

        req.user = user;
        next();
    });
};

app.get('/', function(req, res) {
    res.sendFile(path.join(__dirname, 'public', '/html/welcome.html'));
});

app.get('/news', function(req, res) {
    res.sendFile(path.join(__dirname, 'public', '/html/news.html'));
});

app.get('/about', function(req, res) {
    res.sendFile(path.join(__dirname, 'public', '/html/about.html'));
});
app.get('/rules', function(req, res) {
    res.sendFile(path.join(__dirname, 'public', '/html/rules.html'));
});
app.get('/our_team', function(req, res) {
    res.sendFile(path.join(__dirname, 'public', '/html/our_team.html'));
});

app.get('/registration', function(req, res) {
    res.sendFile(path.join(__dirname, 'public', '/html/registration.html'));
});
app.post('/registration', (req, res) => {
    let salt = bcrypt.genSaltSync(10);
    let passwordToSave = bcrypt.hashSync(req.body.password, salt);
    let new_user = new User(
        req.body.login,
        passwordToSave,
        req.body.email
        
    );
    new_user.save().then(err => {
        let error_info = "ok";
        if (err != undefined) {
            error_info = err.indexOf('login') != -1 ? 'login' : 'email';
        }
        res.json(error_info);
    });
});

app.get('/login', function(req, res) {
    res.sendFile(path.join(__dirname, 'public', '/html/login.html'));
});
app.post('/login', function(req, res) {
    console.log('logined');
    let user = new User(req.body.login, req.body.password);
    // console.log(user);
    user.find(null).then(resp => {
        if (resp == "NOT FOUND") {
            res.json({ found: false, error: "login" });
            return;
        }
        let checking = bcrypt.compareSync(req.body.password, user.password, function(err, res) {
            if (err) {
                return console.log(err);
            }
            if (res == true) {
                return true;
            } else if (res == false) {
                return false;
            }
        })
        if (checking == false) {
            res.json({ found: false, error: "password" });
        } else if (checking == true) {
            const accessToken = jwt.sign({ id: user.ID, login: user.login, email: user.email }, accessTokenSecret);
            res.cookie('accessToken', accessToken, { maxAge: 12 * 60 * 60 * 1000, httpOnly: false }).json({
                found: true
            });;

        }
    });
});

app.get('/home', authenticateJWT, function(req, res) {
    res.sendFile(path.join(__dirname, 'public', '/html/home.html'));
});
app.get('/play', authenticateJWT, function(req, res) {
    res.sendFile(path.join(__dirname, 'public', '/html/play.html'));
});

async function send_to_mail(email, data, link) {
    let transporter = nodemailer.createTransport({
        service: 'Gmail',
        auth: {
            user: "noreply1greatebattle@gmail.com",
            pass: "securepass12062022",
        },
    });
    let info = await transporter.sendMail({
        from: '"Greate Battle Password Reminder" <noreply1greatbattle@gmail.com>',
        to: email,
        subject: "Password Reminder",
        html: `<b style = "font-size: 40px; color: black;">Reset your password:</b>
                <br><a style = "font-size: 30px; color: black;" href = ${link}> Click here </a>
                <br><b style = "font-size: 30px; color: black;">Link stops working after 10 minutes</b>`, // html body
    });
}

app.get('/reminder', function(req, res) {
    res.sendFile(path.join(__dirname, 'public', '/html/reminder.html'));
});
app.post('/reminder', function(req, res) {
    let user = new User(req.body.login);
    user.find(null).then(resp => {
        if (resp == "NOT FOUND") {
            res.json({ found: false, error: "User no found" });
        } else {
            let remindTokenSecret = user.password + user.email;
            let remindToken = jwt.sign({ id: user.ID, login: user.login, email: user.email }, remindTokenSecret, { expiresIn: '10m' });
            link = "https://great-battle.herokuapp.com"+"/reminder/" + user.ID + "/" + remindToken;
            send_to_mail(user.email, user.password, link).catch(console.error);
            console.log("sended: " + link + "\nto: " +user.email)
            res.json({
                found: true,
            });
        }
    });
});

app.get('/reminder/:id/:remindToken', function(req, res) {
    let id = req.params.id
    let user = new User(id);
    user.find(id).then(resp => {
        if (resp == "NOT FOUND") {
            console.log("user found \n");
            return res.sendStatus(403);
        } else {
            let remindToken = req.params.remindToken;
            let remindTokenSecret = user.password + user.email;
            let decode = jwt.verify(remindToken, remindTokenSecret, (err, data) => {
                if (err) {
                    return id = 0;
                } else {
                    return data;
                }
            });
            if (decode.id != user.ID || decode.login != user.login) {
                return res.sendStatus(403);
            } else {
                return res.cookie('id', id, { maxAge: 10 * 60000, httpOnly: false }).cookie('remindToken', remindToken, { maxAge: 10 * 60000, httpOnly: false }).sendFile(path.join(__dirname, 'public', '/html/resetPassword.html'));
            }
        }
    });
});
app.post('/reminder/:id/:remindToken', function(req, res) {
    let id = getCookie("id", req.headers.cookie)
    if (id == null || id == undefined || id == "null") {
        res.status(403)
    } else {
        let user = new User(id);
        user.find(id).then(resp => {
            if (resp == "NOT FOUND") {
                res.sendStatus(403);
            }
            let remindToken = getCookie("remindToken", req.headers.cookie);
            let remindTokenSecret = user.password + user.email;
            let decode = jwt.verify(remindToken, remindTokenSecret, (err, data) => {
                if (err) {
                    return res.status(403);
                } else {
                    return data;
                }
            });
            if (decode.id == user.ID || decode.login == user.login) {
                let salt = bcrypt.genSaltSync(10);
                let passwordToSave = bcrypt.hashSync(req.body.password, salt);
                user.updatePassword(id, passwordToSave).then(resp => {
                    if (resp == "FAIL") {
                        res.json({ success: false, error: "Fail" });
                    } else {
                        res.json({ success: true });
                    }
                });
            } else {
                return res.sendStatus(403)
            }
        });
    }

});

app.post('/userdata', authenticateJWT, function(req, res) {
    const token = getCookie("accessToken", req.headers.cookie);
    let decode = jwt.verify(token, accessTokenSecret, (err, data) => {
        if (err) {
            return id = 0;
        } else {
            return data;
        }
    });
    let user = new User(decode.login);
    user.find(null).then(resp => {
        if (resp == "NOT FOUND") {
            res.redirect('/login');
        } else {
            res.json({
                login: user.login,
                avatar: user.avatar
            });
        }
    });

});
app.post('/upload', authenticateJWT, upload.single("upload_Image"), function(req, res) {
    let filedata = req.file;
    const token = getCookie("accessToken", req.headers.cookie);
    let decode = jwt.verify(token, accessTokenSecret, (err, data) => {
        if (err) {
            return id = 0;
        } else {
            return data;
        }
    });
    let user = new User(decode.login);
    if (!filedata || filedata == undefined) {} else {
        user.updateAvatar(decode.id, filedata.filename).then(resp => {
            if (resp == "FAIL") {
                res.json({ success: false, error: "Fail" });
            } else {
                console.log("success")
                res.redirect('/home');
            }
        });
    }
});
app.post('/get_card', function(req, res) {
    let id = req.body.id;
    let card = new Card(id);
    card.find(id).then(resp => {
        if (resp == "NOT FOUND") {
            // console.log("error")
            res.json({ error: "NOT FOUND" })
        } else {
            res.json(card)
        }
    });
});
app.post('/save_deck', authenticateJWT, function(req, res) {
    const token = getCookie("accessToken", req.headers.cookie);
    let decode = jwt.verify(token, accessTokenSecret, (err, data) => {
        if (err) {
            return id = 0;
        } else {
            return data;
        }
    });
    let check = new Deck(decode.id);
    check.find(decode.id).then(resp => {
        if (resp == "NOT FOUND") {
            console.log("creating new deck")
            let deck = new Deck(
                decode.id,
                req.body.slot1,
                req.body.slot2,
                req.body.slot3,
                req.body.slot4,
                req.body.slot5,
                req.body.slot6,
                req.body.slot7,
                req.body.slot8
            );
            deck.save().then(resp => {
                if (resp == "ERROR") {
                    console.log("ERROR")
                    res.json({ error: "FAIL" })
                } else {
                    console.log("DECK SAVED")
                    res.json({ status: "OK" })
                }
            });
        } else {
            let deck = new Deck(
                decode.id,
                req.body.slot1,
                req.body.slot2,
                req.body.slot3,
                req.body.slot4,
                req.body.slot5,
                req.body.slot6,
                req.body.slot7,
                req.body.slot8
            );
            deck.update().then(resp => {
                if (resp == "FAIL") {
                    console.log("update failed")
                    res.json({ error: "FAIL" })
                } else {
                    console.log("DECK UPDATED")
                    res.json({ status: "OK" })
                }
            });
        }
    });

});

app.post('/get_deck', function(req, res) {
    const token = getCookie("accessToken", req.headers.cookie);
    let decode = jwt.verify(token, accessTokenSecret, (err, data) => {
        if (err) {
            return id = 0;
        } else {
            return data;
        }
    });
    if(decode.id == 0 || decode.id== undefined && req.body.id != undefined){
        decode.id = req.body.id;
    }
    // console.log("id = "+decode.id)
    let check = new Deck (decode.id);
    check.find(decode.id).then(resp => {
        if (resp == "NOT FOUND") {
            console.log("no deck(")
            res.json({ error: "NO DECK" })
        } else {
            let deck = new Deck(
                decode.id
            );
            deck.get().then(resp => {
                if (resp == "FAIL") {
                    console.log("deck pull failed")
                    res.json({ error: "FAIL" })
                } else {
                    console.log("DECK SENDED")
                    res.json(deck)
                }
            });
        }
    });

});
app.post('/get_users', function(req, res) {
    let id1 = req.body.id1;
    let id2 = req.body.id2;
    let user1 = new User();
    let user2 = new User();
    user1.find(id1).then(resp => {
        if (resp == "NOT FOUND") {
            res.redirect('/login');
        } else {
            user2.find(id2).then(resp => {
                if (resp == "NOT FOUND") {
                    res.redirect('/login');
                } else {
                    res.json({
                        login1: user1.login,
                        avatar1: user1.avatar,
                        login2: user2.login,
                        avatar2: user2.avatar
                    });
                }
            });
        }
    });

});

app.post('/logout', function(req, res) {
    let token = getCookie("accessToken", req.headers.cookie);
    token = "aboba";
    res.cookie('accessToken', token, { maxAge: 1, httpOnly: false }).json({ status: true });
});
app.get('/404', function(req, res) {
    res.status(404).sendFile(path.join(__dirname, 'public', '/html/404.html'));
});
app.use((req, res, next) => {
    res.redirect('/404')
});

const server = http.createServer(app);
server.listen(PORT, () => console.log('Server start on http://localhost:${PORT}'));

new PlayServer({ server: server });

// app.listen(PORT, () => console.log(`Server start on http://localhost:${PORT}`));

// new PlayServer({ port: 5000 });