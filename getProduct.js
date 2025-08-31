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

module.exports = getProduct;
