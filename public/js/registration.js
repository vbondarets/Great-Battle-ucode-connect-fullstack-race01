console.log("regisrtation");

function vision1(){
    var x = document.getElementById("password");
    if (x.type === "password") {
        x.type = "text";
    } 
    else {
        x.type = "password";
    }
}
function vision2(){
    var x = document.getElementById("password_confirm");
    if (x.type === "password") {
        x.type = "text";
    } 
    else {
        x.type = "password";
    }
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

        //Email check
        data = document.getElementById("email").value;
        document.getElementById("email").style = "border-color: white";
        if(data.length == 0){
            field = document.getElementById("email");
            console.log("email feeld is empty");
            message = "Email feeld is empty";
            OK = false;
            return {status: OK, error: message, field: field};
        }
        else{
            console.log("email ok");
        }

        //Password check
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

        //Password confirm check
        document.getElementById("password_confirm").style = "border-color: white";
        if(document.getElementById("password_confirm").value == 0){
            field = document.getElementById("password_confirm");
            console.log("password_confirm feeld is empty");
            message = "Password Confirm feeld is empty";
            OK = false;
            return {status: OK, error: message, field: field};
        }
        else if(document.getElementById("password_confirm").value != document.getElementById("password").value){
            field = document.getElementById("password_confirm");
            console.log("passwords don't match");
            message = "Passwords don't match";
            OK = false;
            return {status: OK, error: message, field: field};
        }
        else{
            console.log("password_confirm ok");
        }
        if (OK == true){
            return {status: OK, error: message, field: field};
        }
}

async function send_post_req(url, body){
    let res = await fetch(url, {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify(body)
    });
    let resp = await res.json();//Otvet ot servera
    //console.log(resp);
    return resp;
}

const delay = ms => {
    return new Promise(r => setTimeout(() => r(), ms));
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
            let email = document.getElementById("email").value;
            let res = await send_post_req("/registration", {
                login: login,
                email: email,
                password: pass
            });
            if(res == 'login') {
                document.getElementById("error_label").innerHTML = "Login already exist";
                document.getElementById("error_label").style = "display: block";
                document.getElementById(res).style = "border-color: red";
            }
            else if (res == 'email') {
                document.getElementById("error_label").innerHTML = "Email already exist";
                document.getElementById("error_label").style = "display: block";
                document.getElementById(res).style = "border-color: red";
            }
            else {
                clear_form();
                document.getElementById("error_label").style = "-webkit-text-stroke-color: green";
                document.getElementById("error_label").style = "display: block";
                document.getElementById("error_label").innerHTML = "Registered succesfuly!"
                delay(1000).then(() => {
                    // clear_form();
                    redirect();
                })
            }
        }
        function redirect(){
            window.location.replace("/login")
        }
        function clear_form() {
            document.getElementById("error_label").innerHTML = "";
            let fields = document.getElementsByTagName("input");
            for(let el of fields) {
                el.style = "border-color: white";
                el.value = "";
            }
        }
    
});