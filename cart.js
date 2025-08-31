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
module.exports = { insertProduct, removeProduct };
