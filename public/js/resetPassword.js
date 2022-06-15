console.log("reseter");


function check_data(){
    let OK = true;
    let data;
    let message = '';
    let field;
    //Password check
    data = document.getElementById("password").value;
    document.getElementById("password").style = "border-color: white";
    if(data.length == 0){
        field = document.getElementById("password");
        console.log("Password feeld is empty");
        message = "Password feeld is empty";
        OK = false;
        return {status: OK, error: message, field: field};
    }
    else if(data.length > 24 || data.length < 8){
        field = document.getElementById("password");
        console.log("Password data error");
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
    let res = await fetch(url, {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify(body)
    });
    let resp = await res.json();//Otvet ot servera
    return resp;
}

const delay = ms => {
    return new Promise(r => setTimeout(() => r(), ms));
}

function clear_form() {
    document.getElementById("error_label").innerHTML = "";
    let fields = document.getElementsByTagName("input");
    for(let el of fields) {
        el.style = "border-color: white";
        el.value = "";
    }
}

function redirect(){
    window.location.replace("/login")
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
    else{
        let password = document.getElementById("password").value;
        let res = await send_post_req("/reminder/:id/:remindToken", {
            password: password
        });
        if(!res.success){
            document.getElementById("login").style = "border-color: red"
            document.getElementById("error_label").innerHTML = res.error;
            document.getElementById("error_label").style = "display: block"
        }
        else{
            clear_form();
            document.getElementById("error_label").innerHTML = "Success";
            document.getElementById("error_label").style = "display: block"
            delay(1000).then(() => {
                // clear_form();
                redirect();
            });
        }
    }

});