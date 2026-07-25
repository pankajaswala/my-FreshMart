const user = JSON.parse(localStorage.getItem("user"));

if(user){

    document.getElementById("userName").innerText = user.name;

    document.getElementById("userEmail").innerText = user.email;

}

// Logout

document.getElementById("logoutBtn").addEventListener("click",()=>{

    localStorage.removeItem("token");

    localStorage.removeItem("user");

    window.location.href="login.html";

});