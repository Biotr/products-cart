const { insertProduct, removeProduct } = require("./cart");
const localStorageMocked = {
    storage: {},
    getItem(key) {
        return this.storage[key] ?? null;
    },
    setItem(key, data) {
        this.storage[key] = data;
    },
    clear() {
        this.storage = {};
    },
};

beforeEach(() => {
    Object.defineProperty(window, "localStorage", {
        value: localStorageMocked,
    });
    localStorage.clear();
});

describe("test insertProduct", () => {
    test("test product in cart in localstorage", () => {
        const product = { name: "ProductName", url: "https://producturl.com/1" };
        insertProduct(product);

        const storage = JSON.parse(localStorage.getItem("cart"));

        expect(storage).toHaveLength(1);
        expect(storage[0]).toEqual({ ...product, quantity: 1 });
    });

    test("test adding different product", () => {
        const firstProduct = { name: "ProductName1", url: "https://producturl.com/1" };
        const secondProduct = { name: "ProductName2", url: "https://producturl.com/2" };
        insertProduct(firstProduct);
        insertProduct(secondProduct);

        const storage = JSON.parse(localStorage.getItem("cart"));

        expect(storage).toHaveLength(2);
        expect(storage[0]).toEqual({ ...firstProduct, quantity: 1 });
        expect(storage[1]).toEqual({ ...secondProduct, quantity: 1 });
    });

    test("test adding same products", () => {
        const product = { name: "ProductName", url: "https://producturl.com/1" };
        insertProduct(product);
        insertProduct(product);

        const storage = JSON.parse(localStorage.getItem("cart"));

        expect(storage).toHaveLength(1);
        expect(storage[0]).toEqual({ ...product, quantity: 2 });
    });
});

describe("test removeProduct", () => {
    test("removing product that exist", () => {
        const cart = [
            { name: "ProductName1", url: "https://producturl.com/1" },
            { name: "ProductName2", url: "https://producturl.com/2" },
        ];
        localStorage.setItem("cart", JSON.stringify(cart));

        removeProduct("https://producturl.com/1");

        const storage = JSON.parse(localStorage.getItem("cart"));

        expect(storage).toHaveLength(1);
        expect(storage[0].url).toBe("https://producturl.com/2");
    });

    test("removing product that doesnt exist", () => {
        const cart = [{ name: "ProductName1", url: "https://producturl.com/1" }];
        localStorage.setItem("cart", JSON.stringify(cart));

        removeProduct("https://producturl.com/2");

        const storage = JSON.parse(localStorage.getItem("cart"));

        expect(storage).toHaveLength(1);
        expect(storage[0].url).toBe("https://producturl.com/1");
    });

    test("removing product but cart doesnt exist", () => {
        localStorage.setItem("cart", JSON.stringify([]));

        removeProduct("https://producturl.com/2");

        const storage = JSON.parse(localStorage.getItem("cart"));

        expect(storage).toEqual([]);
    });
});
