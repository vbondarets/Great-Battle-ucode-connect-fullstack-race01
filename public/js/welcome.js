function Choose(src) {
    let expandImg = document.getElementById('expandedImg');
    expandImg.src = src;
    expandImg.style.width =  "80vw";
    expandImg.style.marginLeft =  "6%";
    expandImg.style.display = "inline"
    expandImg.innerHTML = "photo";
    let closeBtn = document.getElementById('closebtn');
    closeBtn.style.display = 'block';
}

function Close(){
    let expandImg = document.getElementById('expandedImg');
    expandImg.src = "";
    expandImg.style.display = "none"
    console.log("close");
    let closeBtn = document.getElementById('closebtn');
    closeBtn.style.display = 'none';
}
function to_news(){
    window.location.replace("/news");
}
function to_home(){
    window.location.replace("/home");
}
// let expandImg = document.getElementById('expandedImg');
// if(expandImg.src == ""){
//     console.log("none");
//     let closeBtn = document.getElementById('closebtn');
//     closeBtn.style.display = 'none';
// }
// else if(expandImg.src != ""){
//     let closeBtn = document.getElementById('closebtn');
//     closeBtn.style.display = 'block';
// }