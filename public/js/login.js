console.log("login");

function getCookie(cname) {
    let name = cname + "=";
    let decodedCookie = decodeURIComponent(document.cookie);
    let ca = decodedCookie.split(';');
    for(let i = 0; i <ca.length; i++) {
      let c = ca[i];
      while (c.charAt(0) == ' ') {
        c = c.substring(1);
      }
      if (c.indexOf(name) == 0) {
        return c.substring(name.length, c.length);
      }
    }
    return "";
}

function check_data(){
    let OK = true;
    let data;
    let message = '';
    let field;
    //LOGIN check
    data = document.getElementById("login").value;
    document.getElementById("login").style = "border-color: white";
    if(data.length == 0){
        field = document.getElementById("login");
        console.log("login feeld is empty");
        message = "Login feeld is empty";
        OK = false;
        return {status: OK, error: message, field: field};
    }
    else if(data.length > 20 || data.length < 5){
        field = document.getElementById("login");
        console.log("login data error");
        message = "Login must be longer than 4 symbols";
        OK = false;
        return {status: OK, error: message, field: field};
    }
    else{
        console.log("login ok");
    }
    data = document.getElementById("password").value;
    document.getElementById("password").style = "border-color: white";
    if(data.length == 0){
        field = document.getElementById("password");
        console.log("password feeld is empty");
        message = "Password feeld is empty";
        OK = false;
        return {status: OK, error: message, field: field};
    }
    else if(data.length > 20 || data.length < 8){
        field = document.getElementById("password");
        console.log("Passwrd data error");
        message = "Password must be longer than 8 symbols";
        OK = false;
        return {status: OK, error: message, field: field};
    }
    else{
        console.log("password ok");
    }
    if (OK == true){
        return {status: OK, error: message, field: field};
    }
}

async function send_post_req(url, body){
    // let token = getCookie("accessToken");
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

const delay = ms => {
    return new Promise(r => setTimeout(() => r(), ms));
}

function clear_form() {
    document.getElementById("error_label").innerHTML = " ";
    let fields = document.getElementsByTagName("input");
    for(let el of fields) {
        el.style = "border-color: white";
        el.value = "";
    }
}

function redirect(){
    window.location.replace("/home")
}
// document.querySelector("a[type=reminder]").addEventListener("click", async function (e) {
//     e.preventDefault();
//     window.location.replace("/reminder");
// });
function vision(){
    var x = document.getElementById("password");
    if (x.type === "password") {
        x.type = "text";
    } 
    else {
        x.type = "password";
    }
}

document.querySelector("button[type=submit]").addEventListener("click", async function (e) {
    let checking = check_data();
    e.preventDefault();
    if (checking.status == false){
        let fields = document.getElementsByTagName("input");
        for(let el of fields) {
            el.style = "border-color: white";
        }
        checking.field.style = "border-color: red";
        document.getElementById("error_label").innerHTML = checking.error;
        document.getElementById("error_label").style = "display: block"
    }
    else {
        let login = document.getElementById("login").value;
        let pass = document.getElementById("password").value;
        let res = await send_post_req("/login", {
            login: login,
            password: pass
        });
        console.log("resp: "+ res.found)
        if(res.found == true) {
            console.log("success");
            clear_form();
            document.getElementById("error_label").style = "-webkit-text-stroke-color: green";
            document.getElementById("error_label").style = "display: block";
            document.getElementById("error_label").innerHTML = "Success!"
            delay(1000).then(() => {
                // clear_form();
                redirect('');
            });
        }
        else if (res.found == false){
            console.log("error data");
            document.getElementById("error_label").style = "-webkit-text-stroke-color: green";
            document.getElementById("error_label").style = "display: block";
            console.log()
            if(res.error == "login"){
                console.log("login is invalid")
                document.getElementById("error_label").innerHTML = "Login is invalid";
            }
            else if(res.error == "password"){
                console.log("password is invalid")
                document.getElementById("error_label").innerHTML = "Password is invalid";
            }
            
        }
    }
});
