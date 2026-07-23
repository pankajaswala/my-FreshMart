console.log("✅ Register JS Loaded");

const registerForm = document.getElementById("registerForm");

if (registerForm) {

    registerForm.addEventListener("submit", async (e) => {

        e.preventDefault();

        console.log("✅ Register Button Clicked");

        const name = document.getElementById("name").value.trim();
        const email = document.getElementById("email").value.trim();
        const password = document.getElementById("password").value.trim();

        if (!name || !email || !password) {

            alert("Please fill all fields");

            return;

        }

        try {

            const response = await fetch("http://localhost:5000/api/users/register", {

                method: "POST",

                headers: {
                    "Content-Type": "application/json"
                },

                body: JSON.stringify({
                    name,
                    email,
                    password
                })

            });

            const data = await response.json();

            console.log("Server Response:", data);

            if (response.ok) {

                alert("Registration Successful ✅");

                window.location.href = "login.html";

            } else {

                alert(data.message);

            }

        } catch (error) {

            console.log(error);

            alert("❌ Server Connection Error");

        }

    });

} else {

    console.log("❌ registerForm not found");

}