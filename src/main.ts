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

// === Инициализация компонентов ===
const events = new EventEmitter();
const catalog = new ProductCatalog(events);
const api = new Api(API_URL);
const communication = new Communication(api);
const cart = new Cart(events);
const customer = new Customer(events);

const galleryContainer = document.querySelector('main.gallery') as HTMLElement;
const gallery = new Gallery(galleryContainer);

const modalContainer = document.getElementById("modal-container")!;
const modal = new Modal(modalContainer, events);

const basketTemplate = document.getElementById("basket") as HTMLTemplateElement;
const basketElement = basketTemplate.content.firstElementChild!.cloneNode(true) as HTMLElement;
const basket = new Basket(basketElement);

const headerContainer = document.querySelector('.header') as HTMLElement;
const header = new Header(events, headerContainer);

header.counter = cart.getItems().length;

// === Инициализация состояния корзины ===
basket.checkoutButton.disabled = cart.getItems().length === 0;

// === Вспомогательные функции ===
const updateAddButton = (btn: HTMLButtonElement, product: IProduct) => {
  if (!product.price) {
    btn.disabled = true;
    btn.textContent = "Недоступно";
  } else {
    btn.disabled = false;
    btn.textContent = cart.hasItem(product.id) ? "Удалить из корзины" : "Купить";
  }
};

const completeOrder = () => {
  cart.clear();
  customer.clear();
};

const showSuccessModal = (total: number) => {
  const template = document.getElementById('success') as HTMLTemplateElement;
  const element = template.content.firstElementChild!.cloneNode(true) as HTMLElement;
  const successModal = new Success(element, events);
  successModal.render({
    title: 'Заказ оформлен',
    description: `Списано ${total} синапсов`
  });
  modal.content = element;

  events.on('success:close', () => {
    modal.content = null;
  });
};

// === Рендер каталога ===
const renderCatalog = (products: IProduct[]) => {
  const cardTemplate = document.getElementById("card-catalog") as HTMLTemplateElement;

  const cards: HTMLElement[] = products.map(product => {
    const cardElement = cardTemplate.content.firstElementChild!.cloneNode(true) as HTMLElement;
    const card = new CardCatalog(cardElement);

    card.render({
      title: product.title,
      price: product.price ?? null,
      image: product.image,
      category: product.category,
    });

    cardElement.addEventListener("click", () => catalog.saveSelectedProduct(product));
    return cardElement;
  });

  gallery.catalog = cards;
};

// === Обновление корзины ===
events.on("basket:changed", (items: IProduct[]) => {
  const list = basketElement.querySelector(".basket__list") as HTMLElement;
  list.innerHTML = "";

  if (items.length === 0) {
    const emptyMessage = document.createElement("p");
    emptyMessage.className = "basket__empty";
    emptyMessage.textContent = "Корзина пуста";
    list.appendChild(emptyMessage);
    basket.checkoutButton.disabled = true;
  } else {
    items.forEach((product, index) => {
      const itemTemplate = document.getElementById("card-basket") as HTMLTemplateElement;
      const itemElement = itemTemplate.content.firstElementChild!.cloneNode(true) as HTMLElement;

      itemElement.querySelector(".basket__item-index")!.textContent = (index + 1).toString();
      itemElement.querySelector(".card__title")!.textContent = product.title;
      itemElement.querySelector(".card__price")!.textContent = product.price ? `${product.price} синапсов` : "Бесценно";

      const deleteBtn = itemElement.querySelector(".basket__item-delete") as HTMLButtonElement;
      deleteBtn.addEventListener("click", () => cart.removeItem(product));

      list.appendChild(itemElement);
    });
    basket.checkoutButton.disabled = false;
  }
  basket.setTotalPrice(items.reduce((sum, item) => sum + (item.price ?? 0), 0));
  header.counter = items.length;
});

events.on('basket:toggle', () => {
  modal.content = basketElement;
})

// === Выбор товара ===
events.on("product:selected", (product: IProduct) => {
  const previewTemplate = document.getElementById("card-preview") as HTMLTemplateElement;
  const cardElement = previewTemplate.content.firstElementChild!.cloneNode(true) as HTMLElement;
  const card = new CardCatalog(cardElement);

  card.render({
    title: product.title,
    price: product.price ?? null,
    image: product.image,
    category: product.category || '',
  });

  const addBtn = cardElement.querySelector(".card__button") as HTMLButtonElement;
  if (addBtn) {
    updateAddButton(addBtn, product);
    addBtn.addEventListener("click", (e) => {
      e.stopPropagation();
      cart.hasItem(product.id) ? cart.removeItem(product) : cart.addItem(product);
      modal.content = null;
    });
  }
  
  modal.content = cardElement;
});

// === Оформление заказа ===
basket.checkoutButton.addEventListener('click', () => {
  if (basket.checkoutButton.disabled) return;

  const orderTemplate = document.getElementById('order') as HTMLTemplateElement;
  const orderFormElement = orderTemplate.content.firstElementChild!.cloneNode(true) as HTMLFormElement;
  modal.content = orderFormElement;

  const orderForm = new OrderForm(orderFormElement, events);

  // === Подписка на сабмит формы заказа ===
  orderFormElement.addEventListener('submit', (e) => {
    e.preventDefault();
    const payment = orderForm.getPayment();
    const address = orderForm.addressInput.value.trim();

    if (!payment || !address) {
      orderForm.setError('Выберите способ оплаты и укажите адрес');
      return;
    }

    customer.saveField('payment', payment);
    customer.saveField('address', address);

    events.emit('order:submit', customer.getData());
  });
});

// === Подписки на события ===
events.on('order:submit', () => {
  const contactsTemplate = document.getElementById('contacts') as HTMLTemplateElement;
  const contactsFormElement = contactsTemplate.content.firstElementChild!.cloneNode(true) as HTMLFormElement;
  modal.content = contactsFormElement;

  new ContactsForm(contactsFormElement, events);
});

events.on('contacts:submit', (data: { email: string; phone: string }) => {
  customer.saveField('email', data.email);
  customer.saveField('phone', data.phone);

  const total = cart.getTotalPrice();
  completeOrder();
  showSuccessModal(total);
});

// === Обновление каталога ===
events.on("products:changed", renderCatalog);

// === Загрузка данных с сервера ===
communication.fetchProducts()
  .then((products) => catalog.saveProducts(products))
  .catch((error: unknown) => console.error("Ошибка при получении данных с сервера:", error));
