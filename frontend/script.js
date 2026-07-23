// =========================
// FRESHMART CART SYSTEM
// =====



// ======================================
// FRESHMART SCRIPT.JS (PART 1)
// Products + Cart + Add To Cart
// ======================================

async function loadProducts() {

    const productGrid = document.getElementById("productGrid");

    if (!productGrid) return;

    try {

        const response = await fetch("http://localhost:5000/api/products");

        const products = await response.json();

        productGrid.innerHTML = "";

        products.forEach(product => {

            productGrid.innerHTML += `
                <div class="product-card ${product.category}">

                    <span class="badge">Fresh</span>

                    <img src="${product.image}" alt="${product.name}">

                    <h3>${product.name}</h3>

                    <p class="product-description">${product.description || ""}</p>

                    <p>₹${product.price} / ${product.unit}</p>

                    <p><b>Stock:</b> ${product.stock} ${product.unit}</p>

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
                        `<button class="btn" disabled style="background:red;cursor:not-allowed;">
                            Out Of Stock
                        </button>`
                    }

                </div>
            `;

        });

    } catch (error) {

        console.log(error);

    }

}

// ----------------------------
// CART FUNCTIONS
// ----------------------------

function getCart() {

    return JSON.parse(localStorage.getItem("cart")) || [];

}

function saveCart(cart) {

    localStorage.setItem("cart", JSON.stringify(cart));

}

function updateCartCount() {

    const cartCount = document.getElementById("cartCount");

    if (!cartCount) return;

    let total = 0;

    getCart().forEach(item => {

        total += item.quantity;

    });

    cartCount.innerText = total;

}

// ----------------------------
// ADD TO CART
// ----------------------------

document.addEventListener("click", function(e){

    if(!e.target.classList.contains("addCart")) return;

    const button = e.target;

    const id = button.dataset.id;

    const name = button.dataset.name;

    const price = Number(button.dataset.price);

    const image = button.dataset.image;

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

    alert("Product Added Successfully ✅");

});

// ----------------------------
// START
// ----------------------------

loadProducts();

updateCartCount();

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

        cartItems.innerHTML = "<h2>Your Cart is Empty 🛒</h2>";

        if (orderSummary) {
            orderSummary.innerHTML = "<h3>Total : ₹0</h3>";
        }

        return;
    }

    cart.forEach((item, index) => {

        subtotal += item.price * item.quantity;

        cartItems.innerHTML += `

        <div class="cart-item">

            <img src="${item.image}" width="80">

            <div>

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

    if(orderSummary){

        orderSummary.innerHTML = `

            <p>Items : ₹${subtotal}</p>

            <p>Delivery : ₹${delivery}</p>

            <h3>Total : ₹${total}</h3>

        `;

    }

}

// ----------------------------
// INCREASE QUANTITY
// ----------------------------

function increaseQty(index){

    let cart = getCart();

    cart[index].quantity++;

    saveCart(cart);

    loadCartPage();

    updateCartCount();

}

// ----------------------------
// DECREASE QUANTITY
// ----------------------------

function decreaseQty(index){

    let cart = getCart();

    if(cart[index].quantity > 1){

        cart[index].quantity--;

    }else{

        cart.splice(index,1);

    }

    saveCart(cart);

    loadCartPage();

    updateCartCount();

}

// ----------------------------
// REMOVE ITEM
// ----------------------------

function removeItem(index){

    let cart = getCart();

    cart.splice(index,1);

    saveCart(cart);

    loadCartPage();

    updateCartCount();

}

// ----------------------------
// LOAD CART
// ----------------------------

loadCartPage();
// ======================================
// FRESHMART SCRIPT.JS (PART 3)
// SEARCH + FILTER + CHECKOUT
// ======================================

// ----------------------------
// SEARCH
// ----------------------------

const searchInput = document.getElementById("searchInput");

if (searchInput) {

    searchInput.addEventListener("keyup", function () {

        const value = this.value.toLowerCase();

        document.querySelectorAll(".product-card").forEach(card => {

            const text = card.innerText.toLowerCase();

            if (text.includes(value)) {

                card.style.display = "block";

            } else {

                card.style.display = "none";

            }

        });

    });

}

// ----------------------------
// FILTER
// ----------------------------

const filterButtons = document.querySelectorAll(".filter-btn");

if (filterButtons.length) {

    filterButtons.forEach(button => {

        button.addEventListener("click", () => {

            filterButtons.forEach(btn => btn.classList.remove("active"));

            button.classList.add("active");

            const filter = button.dataset.filter;

            document.querySelectorAll(".product-card").forEach(card => {

                if (filter === "all" || card.classList.contains(filter)) {

                    card.style.display = "block";

                } else {

                    card.style.display = "none";

                }

            });

        });

    });

}

// ----------------------------
// CATEGORY FROM URL
// ----------------------------

const urlParams = new URLSearchParams(window.location.search);

const selectedCategory = urlParams.get("category");

if (selectedCategory) {

    document.querySelectorAll(".filter-btn").forEach(btn => {

        btn.classList.remove("active");

    });

    const activeBtn = document.querySelector(`[data-filter="${selectedCategory}"]`);

    if (activeBtn) activeBtn.classList.add("active");

    document.querySelectorAll(".product-card").forEach(card => {

        if (card.classList.contains(selectedCategory)) {

            card.style.display = "block";

        } else {

            card.style.display = "none";

        }

    });

}

// ----------------------------
// CHECKOUT
// ----------------------------

const checkoutBtn = document.querySelector(".checkout-btn");

if (checkoutBtn) {

    checkoutBtn.addEventListener("click", async () => {

        const token = localStorage.getItem("token");

        if (!token) {
            alert("Please login first");
            window.location.href = "login.html";
            return;
        }

        const cart = getCart();

        if (cart.length === 0) {
            alert("Cart is Empty");
            return;
        }

        // Customer Details
        const customerName = document.getElementById("customerName").value.trim();
        const phone = document.getElementById("phone").value.trim();
        const address = document.getElementById("address").value.trim();

        const paymentMethod = document.querySelector(
            'input[name="payment"]:checked'
        ).value;

        if (!customerName || !phone || !address) {
            alert("Please fill all delivery details.");
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

        } catch (err) {

            console.log(err);

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

        const res = await fetch("http://localhost:5000/api/orders/myorders", {

            headers: {
                Authorization: `Bearer ${token}`
            }

        });

        const orders = await res.json();

        container.innerHTML = "";

        if (orders.length === 0) {

            container.innerHTML = "<h2>No Orders Found 🛒</h2>";

            return;

        }

        orders.forEach(order => {

            let productsHTML = "";

            order.products.forEach(item => {

                productsHTML += `
                    <p>
                        <strong>${item.productId.name || "Product"}</strong><br>
                        Qty : ${item.quantity}<br>
                        Price : ₹${item.productId.price || 0}
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

                    ${productsHTML}

                    <p><strong>Total :</strong> ₹${order.totalPrice}</p>

                    <p><strong>Status :</strong> ${order.status}</p>

                    <p><strong>Date :</strong> ${new Date(order.createdAt).toLocaleDateString()}</p>

                </div>

                <br>

            `;

        });

    } catch (err) {

        console.log(err);

    }

}

loadMyOrders();


// ==========================
// MOBILE MENU
// ==========================

const menuBtn = document.getElementById("menuBtn");
const navMenu = document.getElementById("navMenu");

if (menuBtn && navMenu) {

    menuBtn.addEventListener("click", () => {

        navMenu.classList.toggle("active");

    });

}