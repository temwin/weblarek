import "./scss/styles.scss";

import { ProductCatalog } from "./components/base/models/ProductCatalog";
import { Cart } from "./components/base/models/Cart";
import { Customer } from "./components/base/models/Customer";

import { apiProducts } from "./utils/data";

import { Communication } from "./components/base/models/Communication";
import { Api } from "./components/base/Api";
import { API_URL } from "./utils/constants";

// === Проверка ProductCatalog ===
const catalog = new ProductCatalog();
catalog.saveProducts(apiProducts.items);

console.log("Массив товаров из каталога:", catalog.getProducts());
console.log("Товар по ID:", catalog.getProductById(apiProducts.items[0].id));

catalog.saveSelectedProduct(apiProducts.items[1]);
console.log("Выбранный товар:", catalog.getSelectedProduct());

// === Проверка Cart ===
const cart = new Cart();
cart.addItem(apiProducts.items[0]);
cart.addItem(apiProducts.items[1]);

console.log("Товары в корзине:", cart.getItems());
console.log("Общая цена:", cart.getTotalPrice());
console.log("Количество товаров:", cart.getTotalCount());
console.log("Есть ли товар 1:", cart.hasItem(apiProducts.items[0].id));

cart.removeItem(apiProducts.items[0]);
console.log("После удаления:", cart.getItems());

cart.clear();
console.log("После очистки корзины:", cart.getItems());

// === Проверка Customer ===
const customer = new Customer();
customer.saveField("email", "test@example.com");
customer.saveField("phone", "1234567890");

console.log("Данные покупателя:", customer.getData());
console.log("Ошибки валидации:", customer.validate());

customer.clear();
console.log("После очистки:", customer.getData());

// === Работа с сервером ===
const api = new Api(API_URL);
const communication = new Communication(api);

communication.fetchProducts().then((products) => {
  catalog.saveProducts(products);
  console.log("Каталог товаров с сервера:", catalog.getProducts());
});
