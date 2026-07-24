const loginForm = document.getElementById("loginForm");

loginForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    const email = document.getElementById("email").value.trim();
    const password = document.getElementById("password").value.trim();

    try {

        const response = await fetch("https://my-freshmart-3.onrender.com/api/users/login", {
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

        console.log("Response:", data);

        if (response.ok) {

            // Save token
            localStorage.setItem("token", data.token);

            // Save admin status
            localStorage.setItem("isAdmin", data.isAdmin);

            // Save user details
            localStorage.setItem("user", JSON.stringify({
                name: data.name,
                email: data.email,
                isAdmin: data.isAdmin
            }));

            alert("✅ Login Successful");

            if (data.isAdmin) {
                window.location.href = "admin.html";
            } else {
                window.location.href = "product.html";
            }

        } else {

            alert(data.message || "Login Failed");

        }

    } catch (error) {

        console.error("Login Error:", error);
        alert("❌ Unable to connect to the server.");

    }
});