const cartContainerStyling = {
    position: "fixed",
    right: "10px",
    bottom: "10px",
    width: "500px",
    zIndex: "2000",
    border: "1px solid gray",
    borderRadius: "8px",
    boxShadow: "0 2px 10px rgba(0,0,0,0.2)",
    overflowY: "auto",
    backgroundColor: "white",
    padding: "10px",
    color: "black",
    fontFamily: "Arial, sans-serif",
};

const totalDivStyling = {
    marginTop: "10px",
    fontWeight: "bold",
    textAlign: "right",
};

const productsContainerStyling = {
    width: "100%",
    maxHeight: "300px",
    overflowY: "auto",
};

const rowStyling = {
    display: "flex",
    alignItems: "center",
    padding: "6px",
    fontSize: "12px",
};

function getProduct(element) {
    const allJsonData = document.querySelectorAll(element);
    let product;
    for (const jsonData of allJsonData) {
        try {
            const schema = JSON.parse(jsonData.innerHTML);
            if (schema["@type"] === "Product") {
                product = schema;
                break;
            }
        } catch {
            continue;
        }
    }
    if (!product || !product["name"] || !product["offers"] || !product["image"]) return null;

    const offer = Array.isArray(product.offers) ? product.offers[0] : product.offers;
    const image = Array.isArray(product.image) ? product.image[0] : product.image;

    if (!offer || !offer["price"] || isNaN(offer["price"]) || !offer["priceCurrency"] || !image) return null;

    return {
        name: product.name,
        imageUrl: image,
        url: window.location.href,
        price: parseFloat(offer.price),
        priceCurrency: offer.priceCurrency,
    };
}

function insertProduct(newProduct) {
    const cart = JSON.parse(localStorage.getItem("cart") ?? "[]");
    const product = cart.find((item) => item.url == newProduct.url);

    if (product) {
        product.quantity += 1;
    } else {
        cart.push({ ...newProduct, quantity: 1 });
    }

    localStorage.setItem("cart", JSON.stringify(cart));
}

function removeProduct(url) {
    const cart = JSON.parse(localStorage.getItem("cart") ?? "[]");
    const newCart = cart.filter((item) => item.url !== url);

    localStorage.setItem("cart", JSON.stringify(newCart));
}

function createCartContainer() {
    const cartContainer = document.createElement("div");

    cartContainer.id = "cart-container";
    document.body.appendChild(cartContainer);
    Object.assign(cartContainer.style, cartContainerStyling);

    return cartContainer;
}

function createProductsContainer() {
    const productsContainer = document.createElement("div");

    productsContainer.addEventListener("click", (e) => {
        if (e.target.tagName == "INPUT") {
            const productUrl = e.target.dataset.url;
            removeProduct(productUrl);
            displayCart();
        }
    });

    Object.assign(productsContainer.style, productsContainerStyling);

    return productsContainer;
}

function createProductRow(product) {
    const rowDiv = document.createElement("div");
    const productTotalPrice = product.price * product.quantity;

    rowDiv.innerHTML = `
        <input type="button" style="color:red; background:none; border:none; cursor:pointer;" value="X" data-url=${product.url}>
        <img src="${product.imageUrl}" alt="${product.name}" style="margin:0 8px; width:50px; height:auto;">
        <a href="${product.url}" target="_blank" style="flex:1; color:black; text-decoration:none; overflow:hidden;">
           ${product.name}
        </a>
        <span style="margin:0 8px;">x${product.quantity}</span>
        <span style="margin:0 8px;">${product.price.toFixed(2)}</span>
        <span style="margin:0 8px; font-weight:bold;">${productTotalPrice.toFixed(2)}</span>
        <span>${product.priceCurrency}</span>
    `;

    Object.assign(rowDiv.style, rowStyling);

    return rowDiv;
}

function createTotalDiv(totalPrice, priceCurrency) {
    const totalDiv = document.createElement("div");

    totalDiv.textContent = `Total: ${totalPrice.toFixed(2)} ${priceCurrency}`;
    Object.assign(totalDiv.style, totalDivStyling);

    return totalDiv;
}

function displayCart() {
    const cartData = JSON.parse(localStorage.getItem("cart") ?? "[]");
    const cartContainer = document.getElementById("cart-container") ?? createCartContainer();
    const productsContainer = createProductsContainer();

    cartContainer.innerHTML = "<strong style='font-size:30px; padding:10px;'>Cart</strong>";

    let cartTotalPrice = 0;

    for (const product of cartData) {
        const rowDiv = createProductRow(product);
        productsContainer.appendChild(rowDiv);

        cartTotalPrice += product.quantity * product.price;
    }

    const currency = cartData.length ? cartData[0].priceCurrency : "";
    const totalDiv = createTotalDiv(cartTotalPrice, currency);

    cartContainer.appendChild(productsContainer);
    cartContainer.appendChild(totalDiv);
}

function initializeCart() {
    const productData = getProduct('script[type="application/ld+json"]');

    if (!productData) {
        console.error("Unable to get product info");
        return;
    }

    insertProduct(productData);
    displayCart();
}
initializeCart();
