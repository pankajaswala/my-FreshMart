// =========================================
// FRESHMART SCRIPT.JS (PART 1)
// Products + Search + Filter + Cart
// =========================================

const API_URL = "http://localhost:5000/api";

const productGrid = document.getElementById("productGrid");
const searchInput = document.getElementById("searchInput");
const cartCount = document.getElementById("cartCount");

let allProducts = [];

// =======================
// LOAD PRODUCTS
// =======================

async function loadProducts() {

    if (!productGrid) return;

    try {

        const response = await fetch(`${API_URL}/products`);
        const products = await response.json();

        allProducts = products;

        displayProducts(products);

    } catch (error) {

        console.error("Error:", error);

        productGrid.innerHTML = `
            <h2 style="color:red;text-align:center;">
                Failed To Load Products
            </h2>
        `;
    }
}

// =======================
// DISPLAY PRODUCTS
// =======================

function displayProducts(products) {

    productGrid.innerHTML = "";

    if (products.length === 0) {

        productGrid.innerHTML = "<h2>No Products Found</h2>";
        return;

    }

    products.forEach(product => {

        productGrid.innerHTML += `

        <div class="product-card ${product.category}">

            <span class="badge">Fresh</span>

            <img src="${product.image}" alt="${product.name}">

            <h3>${product.name}</h3>

            <p>${product.description || ""}</p>

            <p>
                <strong>₹${product.price}</strong>
                / ${product.weight}${product.unit}
            </p>

            <p>
                Stock :
                ${product.stock}
            </p>

            ${
                product.stock > 0
                ?
                `<button
                    class="btn addCart"
                    data-id="${product._id}"
                    data-name="${product.name}"
                    data-price="${product.price}"
                    data-image="${product.image}">
                    Add To Cart
                </button>`
                :
                `<button
                    class="btn"
                    disabled>
                    Out Of Stock
                </button>`
            }

        </div>

        `;

    });

}

// =======================
// SEARCH
// =======================

if (searchInput) {

    searchInput.addEventListener("keyup", () => {

        const value = searchInput.value.toLowerCase();

        const result = allProducts.filter(product =>

            product.name.toLowerCase().includes(value)

        );

        displayProducts(result);

    });

}

// =======================
// FILTER
// =======================

const filterButtons = document.querySelectorAll(".filter-btn");

filterButtons.forEach(button => {

    button.addEventListener("click", () => {

        filterButtons.forEach(btn =>

            btn.classList.remove("active")

        );

        button.classList.add("active");

        const category = button.dataset.filter;

        if (category === "all") {

            displayProducts(allProducts);

            return;

        }

        const filtered = allProducts.filter(product =>

            product.category.toLowerCase() === category.toLowerCase()

        );

        displayProducts(filtered);

    });

});

// =======================
// CART FUNCTIONS
// =======================

function getCart() {

    return JSON.parse(localStorage.getItem("cart")) || [];

}

function saveCart(cart) {

    localStorage.setItem("cart", JSON.stringify(cart));

}

function updateCartCount() {

    if (!cartCount) return;

    const cart = getCart();

    let total = 0;

    cart.forEach(item => {

        total += item.quantity;

    });

    cartCount.innerText = total;

}

// =======================
// ADD TO CART
// =======================

document.addEventListener("click", function(e){

    if(!e.target.classList.contains("addCart")) return;

    const id = e.target.dataset.id;
    const name = e.target.dataset.name;
    const price = Number(e.target.dataset.price);
    const image = e.target.dataset.image;

    let cart = getCart();

    const existing = cart.find(item => item.id === id);

    if(existing){

        existing.quantity++;

    }else{

        cart.push({

            id,
            name,
            price,
            image,
            quantity:1

        });

    }

    saveCart(cart);

    updateCartCount();

    alert(`${name} Added To Cart ✅`);

});

// =======================
// START
// =======================

updateCartCount();
loadProducts();

// ======================================
// FRESHMART SCRIPT.JS (PART 2)
// CART PAGE
// ======================================

// ----------------------------
// LOAD CART PAGE
// ----------------------------

function loadCartPage() {

    const cartItems = document.getElementById("cartItems");
    const orderSummary = document.getElementById("orderSummary");

    if (!cartItems) return;

    const cart = getCart();

    cartItems.innerHTML = "";

    let subtotal = 0;

    if (cart.length === 0) {

        cartItems.innerHTML = `
            <h2 style="text-align:center;">
                Your Cart is Empty 🛒
            </h2>
        `;

        if (orderSummary) {

            orderSummary.innerHTML = `
                <h3>Total : ₹0</h3>
            `;

        }

        return;
    }

    cart.forEach((item, index) => {

        subtotal += item.price * item.quantity;

        cartItems.innerHTML += `

        <div class="cart-item">

            <img
                src="${item.image}"
                alt="${item.name}"
                width="80"
            >

            <div class="cart-details">

                <h3>${item.name}</h3>

                <p>₹${item.price}</p>

            </div>

            <div class="quantity-controls">

                <button onclick="decreaseQty(${index})">-</button>

                <span>${item.quantity}</span>

                <button onclick="increaseQty(${index})">+</button>

            </div>

            <button
                class="remove-btn"
                onclick="removeItem(${index})">
                Remove
            </button>

        </div>

        `;

    });

    const delivery = 40;
    const total = subtotal + delivery;

    if (orderSummary) {

        orderSummary.innerHTML = `

            <p>Items Total : ₹${subtotal}</p>

            <p>Delivery Charge : ₹${delivery}</p>

            <hr>

            <h2>Total : ₹${total}</h2>

        `;

    }

}

// ----------------------------
// INCREASE QUANTITY
// ----------------------------

function increaseQty(index) {

    let cart = getCart();

    cart[index].quantity++;

    saveCart(cart);

    loadCartPage();

    updateCartCount();

}

// ----------------------------
// DECREASE QUANTITY
// ----------------------------

function decreaseQty(index) {

    let cart = getCart();

    if (cart[index].quantity > 1) {

        cart[index].quantity--;

    } else {

        cart.splice(index, 1);

    }

    saveCart(cart);

    loadCartPage();

    updateCartCount();

}

// ----------------------------
// REMOVE ITEM
// ----------------------------

function removeItem(index) {

    let cart = getCart();

    cart.splice(index, 1);

    saveCart(cart);

    loadCartPage();

    updateCartCount();

}

// ----------------------------
// CLEAR CART
// ----------------------------

function clearCart() {

    localStorage.removeItem("cart");

    loadCartPage();

    updateCartCount();

}

// ----------------------------
// LOAD CART PAGE
// ----------------------------

loadCartPage();

// ======================================
// FRESHMART SCRIPT.JS (PART 3)
// CHECKOUT + MY ORDERS
// ======================================

// ----------------------------
// CHECKOUT
// ----------------------------

const checkoutBtn = document.querySelector(".checkout-btn");

if (checkoutBtn) {

    checkoutBtn.addEventListener("click", async () => {

        const token = localStorage.getItem("token");

        if (!token) {
            alert("Please Login First");
            window.location.href = "login.html";
            return;
        }

        const cart = getCart();

        if (cart.length === 0) {
            alert("Your Cart is Empty");
            return;
        }

        const customerName = document.getElementById("customerName").value.trim();
        const phone = document.getElementById("phone").value.trim();
        const address = document.getElementById("address").value.trim();

        const paymentMethod = document.querySelector(
            'input[name="payment"]:checked'
        )?.value;

        if (!customerName || !phone || !address || !paymentMethod) {
            alert("Please fill all delivery details");
            return;
        }

        const products = cart.map(item => ({
            productId: item.id,
            quantity: item.quantity
        }));

        const totalPrice = cart.reduce((sum, item) => {
            return sum + (item.price * item.quantity);
        }, 0);

        try {

            const response = await fetch("http://localhost:5000/api/orders", {

                method: "POST",

                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                },

                body: JSON.stringify({

                    customerName,
                    phone,
                    address,
                    paymentMethod,
                    products,
                    totalPrice

                })

            });

            const data = await response.json();

            if (response.ok) {

                alert("✅ Order Placed Successfully");

                localStorage.removeItem("cart");

                updateCartCount();

                window.location.href = "myorders.html";

            } else {

                alert(data.message);

            }

        } catch (error) {

            console.error(error);

            alert("Server Error");

        }

    });

}

// ----------------------------
// LOAD MY ORDERS
// ----------------------------

async function loadMyOrders() {

    const container = document.getElementById("ordersContainer");

    if (!container) return;

    const token = localStorage.getItem("token");

    if (!token) {

        container.innerHTML = "<h2>Please Login First</h2>";

        return;

    }

    try {

        const response = await fetch(
            "http://localhost:5000/api/orders/myorders",
            {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            }
        );

        const orders = await response.json();

        container.innerHTML = "";

        if (orders.length === 0) {

            container.innerHTML = "<h2>No Orders Found</h2>";

            return;

        }

        orders.forEach(order => {

            let productHTML = "";

            order.products.forEach(item => {

                productHTML += `

                    <p>

                        <strong>${item.productId?.name || "Product"}</strong>

                        <br>

                        Qty : ${item.quantity}

                        <br>

                        Price : ₹${item.productId?.price || 0}

                    </p>

                    <hr>

                `;

            });

            container.innerHTML += `

                <div class="order-card">

                    <h3>Order ID : ${order._id}</h3>

                    <p><strong>Name :</strong> ${order.customerName}</p>

                    <p><strong>Phone :</strong> ${order.phone}</p>

                    <p><strong>Address :</strong> ${order.address}</p>

                    <p><strong>Payment :</strong> ${order.paymentMethod}</p>

                    ${productHTML}

                    <h3>Total : ₹${order.totalPrice}</h3>

                    <p>Status : ${order.status}</p>

                    <p>Date :
                        ${new Date(order.createdAt).toLocaleDateString()}
                    </p>

                </div>

                <br>

            `;

        });

    } catch (error) {

        console.error(error);

    }

}

loadMyOrders();

// ======================================
// FRESHMART SCRIPT.JS (PART 4)
// FINAL
// ======================================

// ----------------------------
// LOGOUT
// ----------------------------

const logoutBtn = document.getElementById("logoutBtn");

if (logoutBtn) {

    logoutBtn.addEventListener("click", () => {

        localStorage.removeItem("token");
        localStorage.removeItem("user");
        localStorage.removeItem("cart");

        alert("Logged Out Successfully");

        window.location.href = "login.html";

    });

}

// ----------------------------
// LOGIN CHECK
// ----------------------------

function checkLogin() {

    const token = localStorage.getItem("token");

    if (!token) {

        alert("Please Login First");

        window.location.href = "login.html";

    }

}

// ----------------------------
// USER INFO
// ----------------------------

const user = JSON.parse(localStorage.getItem("user"));

const username = document.getElementById("username");

if (username && user) {

    username.innerHTML = `Welcome, ${user.name}`;

}

// ----------------------------
// CART COUNT
// ----------------------------

updateCartCount();

// ----------------------------
// MOBILE MENU
// ----------------------------

const menuBtn = document.getElementById("menuBtn");
const nav = document.querySelector("nav");

if (menuBtn && nav) {

    menuBtn.addEventListener("click", () => {

        nav.classList.toggle("show");

    });

}

// ----------------------------
// PAGE LOADER
// ----------------------------

window.addEventListener("DOMContentLoaded", () => {

    updateCartCount();

    if (document.getElementById("productGrid")) {

        loadProducts();

    }

    if (document.getElementById("cartItems")) {

        loadCartPage();

    }

    if (document.getElementById("ordersContainer")) {

        loadMyOrders();

    }

});
