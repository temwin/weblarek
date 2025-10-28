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
import { CardBasket } from "./components/view/CardBasket";
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

const headerContainer = document.querySelector('.header') as HTMLElement;
const header = new Header(events, headerContainer);

// === Статичные компоненты создаем один раз ===
const successElement = cloneTemplate("#success");
const successModal = new Success(successElement, events);

const orderFormElement = cloneTemplate("#order") as HTMLFormElement;
const orderForm = new OrderForm(orderFormElement, events);

const contactsFormElement = cloneTemplate('#contacts') as HTMLFormElement;
const contactsForm = new ContactsForm(contactsFormElement, events);

// === Функции для рендеринга ===
const renderCatalog = (products: IProduct[]) => {
  const cartItems = cart.getItems();
  const cartIds = cartItems.map(item => item.id);
  
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

    card.setInCart(cartIds.includes(product.id));

    return cardElement;
  });

  gallery.catalog = cards;
};

const renderBasket = () => {
  const items = cart.getItems();
  
  // Если корзина пуста, просто обновляем состояние
  if (items.length === 0) {
    basket.render({
      items: [],
      totalPrice: 0,
    });
    return;
  }

  const basketItems = items.map((item, index) => {
    const cardElement = cloneTemplate("#card-basket");
    const card = new CardBasket(cardElement, events);
    
    return card.render({
      title: item.title,
      price: item.price ?? null,
      index: index + 1,
      product: item,
    });
  });

  basket.render({
    items: basketItems,
    totalPrice: cart.getTotalPrice(),
  });
};

const updateHeader = () => {
  header.counter = cart.getTotalCount();
};

// === Первоначальная отрисовка ===
renderBasket();
updateHeader();

// === Подписки на события корзины ===
events.on('cart:add', (data: { id: string }) => {
  const product = catalog.getProductById(data.id);
  if (product) {
    cart.addItem(product);
  };
  modal.content = null; 
  
});

events.on('cart:remove', (data: { id: string }) => {
  const product = catalog.getProductById(data.id);
  if (product) {
    cart.removeItem(product);
  };
  modal.content = null; 
});

events.on("basket:changed", () => {
  renderBasket();
  updateHeader();
  renderCatalog(catalog.getProducts());
});

events.on('basket:toggle', () => {
  modal.content = basketElement;
});

events.on('basket:checkout', () => {
  if (cart.getItems().length === 0) return;
  orderForm.render(customer.getData());
  modal.content = orderFormElement;
});

// === Выбор товара для модалки ===
events.on("product:selected", (data: { id: string }) => {
  const product = catalog.getProductById(data.id);
  if (!product) return;

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

// === Обработчики форм ===
events.on('order:paymentChange', (data: { payment: "card" | "cash" }) => {
  customer.saveField('payment', data.payment);
  const errors = customer.validate();
  orderForm.setErrors(errors);
});

events.on('order:addressChange', (data: { address: string }) => {
  customer.saveField('address', data.address);
  const errors = customer.validate();
  orderForm.setErrors(errors);
});

events.on('order:submit', () => {
  const errors = customer.validate();
  if (!errors.payment && !errors.address) {
    modal.content = contactsFormElement;
    contactsForm.render(customer.getData());
  } else {
    orderForm.setErrors(errors);
  }
});

events.on('contacts:emailChange', (data: { value: string }) => {
  customer.saveField('email', data.value);
  const errors = customer.validate();
  contactsForm.setErrors(errors);
});

events.on('contacts:phoneChange', (data: { value: string }) => {
  customer.saveField('phone', data.value);
  const errors = customer.validate();
  contactsForm.setErrors(errors);
});

events.on('contacts:submit', async (data: { email: string; phone: string }) => {
  customer.saveField('email', data.email);
  customer.saveField('phone', data.phone);

  const errors = customer.validate();
  if (errors.email || errors.phone) {
    contactsForm.setErrors(errors);
    return;
  }

  const customerData = customer.getData();
  const items = cart.getItems();

  const orderData = {
    payment: customerData.payment,
    email: customerData.email,
    phone: customerData.phone,
    address: customerData.address,
    total: cart.getTotalPrice(),
    items: items.map(item => item.id)
  };

  try {
    await communication.sendOrder(orderData);
    cart.clear();
    customer.clear();
    successModal.render({ total: orderData.total });
    modal.content = successElement;
  } catch (error) {
    console.error("Ошибка при отправке заказа:", error);
  }
});

// === Закрытие модалки успеха ===
events.on('success:close', () => {
  modal.content = null;
});

// === Обновление каталога ===
events.on("products:changed", (products: IProduct[]) => {
  renderCatalog(products);
});

// === Загрузка данных с сервера ===
communication.fetchProducts()
  .then((products) => catalog.saveProducts(products))
  .catch((error: unknown) => console.error("Ошибка при получении данных с сервера:", error));