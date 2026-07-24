const API_URL = "http://http://localhost:5000/api/orders";

async function loadOrders() {
    try {

        const userId = localStorage.getItem("userId");

        if (!userId) {
            alert("Please login first.");
            window.location.href = "login.html";
            return;
        }

        const response = await fetch(API_URL);
        const orders = await response.json();

        const userOrders = orders.filter(order => order.userId == userId);

        const container = document.getElementById("ordersContainer");

        container.innerHTML = "";

        if (userOrders.length === 0) {
            container.innerHTML = "<h3>No Orders Found</h3>";
            return;
        }

        userOrders.forEach(order => {

            let productsHTML = "";

            order.products.forEach(item => {
                productsHTML += `
                    <p>
                        <strong>Product ID:</strong> ${item.productId}<br>
                        <strong>Quantity:</strong> ${item.quantity}
                    </p>
                    <hr>
                `;
            });

            container.innerHTML += `

                <div class="order-card">

                    <h3>Order ID: ${order._id}</h3>

                    ${productsHTML}

                    <p><strong>Total:</strong> ₹${order.totalPrice}</p>

                    <p>
                        <strong>Status:</strong>
                        ${order.status}
                    </p>

                    <p>
                        <strong>Date:</strong>
                        ${new Date(order.createdAt).toLocaleDateString()}
                    </p>

                </div>

                <br>

            `;

        });

    } catch (error) {

        console.error(error);

        alert("Failed to load orders.");

    }
}

loadOrders();