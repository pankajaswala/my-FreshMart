// ===============================
// ADMIN PANEL
// ===============================

// Token Check
const token = localStorage.getItem("token");
const isAdmin = localStorage.getItem("isAdmin");

if (!token || isAdmin !== "true") {
    alert("Access Denied!");
    window.location.href = "login.html";
}

// ===============================
// LOAD DASHBOARD
// ===============================

async function loadDashboard() {

    try {

        const productRes = await fetch("http://http://localhost:5000/api/products");
        const products = await productRes.json();

        document.getElementById("totalProducts").innerText = products.length;

        loadProducts(products);

    } catch (error) {

        console.log(error);

    }

}

// ===============================
// SHOW PRODUCTS
// ===============================

function loadProducts(products) {

    const container = document.getElementById("adminProducts");

    container.innerHTML = "";

    products.forEach(product => {

        container.innerHTML += `

        <div class="product-card">

            <img src="${product.image}" width="120">

            <h3>${product.name}</h3>

            <p><b>Category:</b> ${product.category}</p>

            <p><b>Price:</b> ₹${product.price}</p>

            <p><b>Unit:</b> ${product.unit}</p>

            <p><b>Stock:</b> ${product.stock}</p>

            <p>${product.description || ""}</p>

            ${
                product.stock > 0
                ? `<button style="background:green;color:white;">In Stock</button>`
                : `<button style="background:red;color:white;" disabled>Out Of Stock</button>`
            }

            <br><br>

            <button onclick="deleteProduct('${product._id}')">
                Delete
            </button>

        </div>

        `;

    });

}

// ===============================
// ADD PRODUCT
// ===============================

async function addProduct() {

console.log(document.getElementById("name"));
console.log(document.getElementById("category"));
console.log(document.getElementById("weight"));
console.log(document.getElementById("price"));
console.log(document.getElementById("unit"));
console.log(document.getElementById("stock"));
console.log(document.getElementById("image"));
console.log(document.getElementById("description"));

const name = document.getElementById("name").value.trim();
const category = document.getElementById("category").value;
const weight = Number(document.getElementById("weight").value);
const price = Number(document.getElementById("price").value);
const unit = document.getElementById("unit").value;
const stock = Number(document.getElementById("stock").value);
const image = document.getElementById("image").value.trim();
const description = document.getElementById("description").value.trim();
    try {

        const response = await fetch("http://http://localhost:5000/api/products", {

            method: "POST",

            headers: {

                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`

            },

           body: JSON.stringify({
              name,
             category,
             weight,
             price,
             unit,
             stock,
             image,
             description

            })

        })

        const data = await response.json();

        if (response.ok) {

            alert("✅ Product Added Successfully");

            document.getElementById("productForm").reset();

            loadDashboard();

        } else {

            alert(data.message);

        }

    } catch (error) {

        console.log(error);

        alert("❌ Server Error");

    }

}

// ===============================
// FORM SUBMIT
// ===============================

const productForm = document.getElementById("productForm");

if (productForm) {

    productForm.addEventListener("submit", function (e) {

        e.preventDefault();

        addProduct();

    });

}
// ===============================
// DELETE PRODUCT
// ===============================

async function deleteProduct(id) {

    const confirmDelete = confirm("Are you sure you want to delete this product?");

    if (!confirmDelete) return;

    try {

        const response = await fetch(`http://http://localhost:5000/api/products/${id}`, {

            method: "DELETE",

            headers: {

                Authorization: `Bearer ${token}`

            }

        });

        const data = await response.json();

        if (response.ok) {

            alert("✅ Product Deleted Successfully");

            loadDashboard();

        } else {

            alert(data.message);

        }

    } catch (error) {

        console.log(error);

        alert("❌ Server Error");

    }

}

// ===============================
// LOGOUT
// ===============================

const logoutBtn = document.getElementById("logoutBtn");

if (logoutBtn) {

    logoutBtn.addEventListener("click", () => {

        localStorage.removeItem("token");
        localStorage.removeItem("isAdmin");

        window.location.href = "login.html";

    });

}

// ===============================
// START APP
// ===============================

loadDashboard();

// ===============================
// LOAD TOTAL ORDERS
// ===============================

async function loadTotalOrders() {

    try {

        const res = await fetch("http://http://localhost:5000/api/orders");

        const orders = await res.json();

        const totalOrders = document.getElementById("totalOrders");

        if (totalOrders) {
            totalOrders.innerText = orders.length;
        }

    } catch (err) {

        console.log(err);

    }

}

// ===============================
// LOAD ORDERS
// ===============================

async function loadOrders() {

    const table = document.getElementById("orderTable");

    if (!table) return;

    try {

        const res = await fetch("http://http://localhost:5000/api/orders");

        const orders = await res.json();

        table.innerHTML = "";

        orders.forEach((order, index) => {

            let products = "";

            order.products.forEach(item => {

                products += `
                    <div>

                        <strong>${item.productId.name}</strong><br>

                        Price : ₹${item.productId.price}<br>

                        Qty : ${item.quantity}

                    </div>

                    <hr>
                `;

            });

            table.innerHTML += `

            <tr>

                <td>#${1001 + index}</td>

                <td>

                    <strong>${order.userId.name}</strong><br>

                    ${order.userId.email}

                    <br><br>

                    📞 ${order.phone || "-"}

                    <br>

                    📍 ${order.address || "-"}

                </td>

                <td>

                    ${products}

                </td>

                <td>

                    ₹${order.totalPrice}

                </td>

                <td>

                    ${order.status}

                </td>

                <td>

                    ${new Date(order.createdAt).toLocaleDateString()}

                </td>

                <td>

                    ${
                        order.status === "Pending"

                        ?

                        `<button onclick="completeOrder('${order._id}')">
                            Complete
                        </button>`

                        :

                        `<span style="color:green;font-weight:bold;">
                            Completed
                        </span>`
                    }

                </td>

            </tr>

            `;

        });

    } catch (err) {

        console.log(err);

    }

}

// ===============================
// COMPLETE ORDER
// ===============================

async function completeOrder(id) {

    if (!confirm("Complete this order?")) return;

    try {

        const res = await fetch(`http://http://localhost:5000/api/orders/${id}`, {

            method: "PUT",

            headers: {
                "Content-Type": "application/json"
            },

            body: JSON.stringify({
                status: "Completed"
            })

        });

        const data = await res.json();

        alert(data.message);

        loadOrders();

    } catch (err) {

        console.log(err);

    }

}

loadDashboard();
loadTotalOrders();
loadOrders();