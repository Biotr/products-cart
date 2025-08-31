const getProduct = require("./getProduct");

function mockScriptInBody(jsonObjects) {
    document.body.innerHTML = jsonObjects.map((obj) => `<script type="application/ld+json">${JSON.stringify(obj)}</script>`);
}

describe("getProduct", () => {
    beforeEach(() => {
        document.body.innerHTML = "";
    });

    describe("valid JSON", () => {
        test("price as float", () => {
            mockScriptInBody([{ "@type": "Product", name: "ProductName", image: "https://url.com/image.jpg", offers: { price: 319.99, priceCurrency: "PLN" } }]);
            const product = getProduct('script[type="application/ld+json"]');

            expect(product).toEqual({
                name: "ProductName",
                imageUrl: "https://url.com/image.jpg",
                url: "http://localhost/",
                price: 319.99,
                priceCurrency: "PLN",
            });
        });

        test("price as string", () => {
            mockScriptInBody([{ "@type": "Product", name: "ProductName", image: "https://url.com/image.jpg", offers: { price: "319.99", priceCurrency: "PLN" } }]);
            const product = getProduct('script[type="application/ld+json"]');
            expect(product.price).toBe(319.99);
        });

        test("offers and image as arrays", () => {
            mockScriptInBody([{ "@type": "Product", name: "ProductName", image: ["https://url.com/image.jpg"], offers: [{ price: "319.99", priceCurrency: "PLN" }] }]);
            const product = getProduct('script[type="application/ld+json"]');
            expect(product.imageUrl).toBe("https://url.com/image.jpg");
        });

        test("multiple script tags with one valid product", () => {
            mockScriptInBody([{ "@type": "WebSite" }, { "@type": "Product", name: "X", image: ["url"], offers: [{ price: "10", priceCurrency: "PLN" }] }, { "@type": "WebSite" }]);
            const product = getProduct('script[type="application/ld+json"]');
            expect(product.name).toBe("X");
        });
    });

    describe("invalid JSON", () => {
        test("missing '@type'", () => {
            mockScriptInBody([{ name: "X", image: "url", offers: { price: "10", priceCurrency: "PLN" } }]);
            expect(getProduct('script[type="application/ld+json"]')).toBeNull();
        });

        test("missing 'name'", () => {
            mockScriptInBody([{ "@type": "Product", image: "url", offers: { price: "10", priceCurrency: "PLN" } }]);
            expect(getProduct('script[type="application/ld+json"]')).toBeNull();
        });

        test("missing 'image'", () => {
            mockScriptInBody([{ "@type": "Product", name: "X", offers: { price: "10", priceCurrency: "PLN" } }]);
            expect(getProduct('script[type="application/ld+json"]')).toBeNull();
        });

        test("missing 'offers'", () => {
            mockScriptInBody([{ "@type": "Product", name: "X", image: "url" }]);
            expect(getProduct('script[type="application/ld+json"]')).toBeNull();
        });

        test("missing 'price' in offers", () => {
            mockScriptInBody([{ "@type": "Product", name: "X", image: "url", offers: { priceCurrency: "PLN" } }]);
            expect(getProduct('script[type="application/ld+json"]')).toBeNull();
        });

        test("missing 'priceCurrency' in offers", () => {
            mockScriptInBody([{ "@type": "Product", name: "X", image: "url", offers: { price: "10" } }]);
            expect(getProduct('script[type="application/ld+json"]')).toBeNull();
        });

        test("invalid JSON in script", () => {
            document.body.innerHTML = `<script type="application/ld+json">no json</script>`;
            expect(getProduct('script[type="application/ld+json"]')).toBeNull();
        });

        test("no script tags in body", () => {
            expect(getProduct('script[type="application/ld+json"]')).toBeNull();
        });

        test("offers and image as empty arrays", () => {
            mockScriptInBody([{ "@type": "Product", name: "X", image: [], offers: [] }]);
            expect(getProduct('script[type="application/ld+json"]')).toBeNull();
        });

        test("price as string with comma", () => {
            mockScriptInBody([{ "@type": "Product", name: "X", image: "url", offers: { price: "319,99", priceCurrency: "PLN" } }]);
            expect(getProduct('script[type="application/ld+json"]')).toBeNull();
        });
    });
});
