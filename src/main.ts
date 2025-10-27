import "./scss/styles.scss";

import { ProductCatalog } from "./components/models/ProductCatalog";
import { Communication } from "./components/models/Communication";
import { Api } from "./components/api/Api";
import { API_URL } from "./utils/constants";

import { EventEmitter } from "./components/events/Events";
import { Gallery } from "./components/view/Gallery";
import { IProduct } from "./types";
import { Cart } from "./components/models/Cart";
import { Modal } from "./components/view/Modal";
import { Basket } from "./components/view/Basket";
import { Customer } from "./components/models/Customer";
import { OrderForm } from "./components/view/OrderForm";
import { CardCatalog } from "./components/view/CardCatalog";
import { ContactsForm } from "./components/view/ContactsForm";
import { Success } from "./components/view/Success";
import { Header } from "./components/view/Header";
import { cloneTemplate } from "./utils/utils";

// === Инициализация компонентов ===
const events = new EventEmitter();
const api = new Api(API_URL);
const communication = new Communication(api);

const catalog = new ProductCatalog(events);
const cart = new Cart(events);
const customer = new Customer(events);

// === Контейнеры для UI ===
const galleryContainer = document.querySelector('main.gallery') as HTMLElement;
const gallery = new Gallery(galleryContainer);

const modalContainer = document.getElementById("modal-container")!;
const modal = new Modal(modalContainer, events);

const basketTemplate = document.getElementById("basket") as HTMLTemplateElement;
const basketElement = basketTemplate.content.firstElementChild!.cloneNode(true) as HTMLElement;
const basket = new Basket(basketElement, events);
basket.setItemsData(cart.getItems());

const headerContainer = document.querySelector('.header') as HTMLElement;
const header = new Header(events, headerContainer);

// === Статичные компоненты создаем один раз ===
const successElement = cloneTemplate("#success");
const successModal = new Success(successElement, events);

const renderCatalog = (products: IProduct[]) => {
  const cards: HTMLElement[] = products.map(product => {
    const cardElement = cloneTemplate("#card-catalog")
    const card = new CardCatalog(cardElement, events);

    card.render({
      id: product.id,
      title: product.title,
      price: product.price ?? null,
      image: product.image,
      category: product.category,
    });

    return cardElement;
  });

  gallery.catalog = cards;
};

// === Подписки на события корзины ===
events.on('cart:add', (product: IProduct) => {
  cart.addItem(product);                  
  modal.content = null;
  events.emit("basket:changed", cart.getItems());
});

events.on('cart:remove', (product: IProduct) => {
  cart.removeItem(product);
  events.emit("basket:changed", cart.getItems());
});

events.on("basket:changed", (items: IProduct[]) => {
  basket.setItemsData(items);
  header.counter = items.length;
  events.emit("catalog:update", items.map(i => i.id));
});

events.on('basket:toggle', () => {
  modal.content = basketElement;
})

// === Выбор товара для модалки ===
events.on("product:selected", (product: IProduct) => {
  const cardElement = cloneTemplate("#card-preview");
  const card = new CardCatalog(cardElement, events);

  const inCart = cart.hasItem(product.id);

  card.render({
    id: product.id,
    title: product.title,
    price: product.price ?? null,
    image: product.image,
    category: product.category || '',
  });

  card.setInCart(inCart);
  modal.content = cardElement;
});

// === Оформление заказа ===
basket.checkoutButton.addEventListener('click', () => {  
  if (!cart.getItems().length) return;

  const orderFormElement = cloneTemplate("#order") as HTMLFormElement;
  modal.content = orderFormElement;

  new OrderForm(orderFormElement, events, customer);
});

events.on('order:submit', () => {
  const contactsFormElement = cloneTemplate('#contacts') as HTMLFormElement;
  modal.content = contactsFormElement;

  new ContactsForm(contactsFormElement, events, customer);
});

events.on('contacts:submit', (data: { email: string; phone: string }) => {
  customer.saveField('email', data.email);
  customer.saveField('phone', data.phone);

  const total = cart.getTotalPrice();
  cart.clear();
  customer.clear();
  successModal.render({ total })
  modal.content = successElement;
});

// === Закрытие модалки успеха ===
events.on('success:close', () => {
  modal.content = null;
});

// === Обновление каталога ===
events.on("products:changed", renderCatalog);

// === Загрузка данных с сервера ===
communication.fetchProducts()
  .then((products) => catalog.saveProducts(products))
  .catch((error: unknown) => console.error("Ошибка при получении данных с сервера:", error));