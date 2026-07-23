const loginForm = document.getElementById("loginForm");

loginForm.addEventListener("submit", async (e) => {

    e.preventDefault();

    const email = document.getElementById("email").value.trim();
    const password = document.getElementById("password").value.trim();

    try {

        const response = await fetch("http://localhost:5000/api/users/login", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                email,
                password
            })
        });

        const data = await response.json();

        console.log("Response =", data);
        console.log("Status =", response.status);
        console.log("OK =", response.ok);

        if (response.ok) {

            localStorage.setItem("token", data.token);
            localStorage.setItem("isAdmin", data.isAdmin);

            localStorage.setItem("user", JSON.stringify({
                name: data.name,
                email: data.email
            }));

            console.log("Saved User =", localStorage.getItem("user"));

            alert("Login Successful ✅");

            if (data.isAdmin) {
                window.location.href = "admin.html";
            } else {
                window.location.href = "product.html";
            }

        } else {

            alert(data.message);

        }

    } catch (error) {

        console.error(error);
        alert("Server Error");

    }

});