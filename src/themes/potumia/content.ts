import type { ThemeContent } from "../types";
import { THEME } from "./config";

/**
 * Potumia Shop help and company pages: a general online store (no size
 * guide). Policies come from THEME.brand.policies so they stay consistent.
 */

// {name}, {exchangeDays}, {deliveryDhaka} and {deliveryOutside} are filled in with the shop's (lib/site.ts)
const { payment } = THEME.brand.policies;

const faqs: ThemeContent["faqs"] = [
  {
    group: "Orders & payment",
    items: [
      {
        q: "How do I place an order?",
        a: "Add the products you want to your bag and go to checkout. Enter your name, mobile number and delivery address, then place the order. We call or message you to confirm it before it ships.",
      },
      {
        q: "Which payment methods do you accept?",
        a: `We accept ${payment.toLowerCase()} only, for now. You pay the delivery person in cash when your order arrives, so there's nothing to pay online.`,
      },
      {
        q: "Do I need an account to order?",
        a: "No, you can check out as a guest. A free account saves your details and lets you follow every order and its status from My account.",
      },
      {
        q: "Can I change or cancel my order?",
        a: "Yes, until it's handed to the courier. Call or WhatsApp us with your order number and we'll update or cancel it.",
      },
    ],
  },
  {
    group: "Delivery",
    items: [
      {
        q: "Where do you deliver?",
        a: `Everywhere in Bangladesh. Orders inside Dhaka usually arrive in {deliveryDhaka}, and orders outside Dhaka in {deliveryOutside}.`,
      },
      {
        q: "How much is the delivery charge?",
        a: "It depends on your location. We confirm the exact charge with you when we confirm your order, before anything ships.",
      },
      {
        q: "How can I track my order?",
        a: "With an account, open My account to see each order and its status: placed, processing, on the way and delivered. You can also call us with your order number.",
      },
    ],
  },
  {
    group: "Returns & exchange",
    items: [
      {
        q: "Can I exchange a product?",
        a: `Yes, within {exchangeDays} days of delivery, as long as it's unused, in its original packaging and with all accessories.`,
      },
      {
        q: "Can I check my order before paying?",
        a: "Yes. Check your parcel in front of the delivery person before you pay. If anything is wrong, don't accept it and let us know right away.",
      },
      {
        q: "What if a product arrives damaged or wrong?",
        a: "Contact us within 48 hours of delivery with your order number and a photo. We'll replace it or refund you at no extra cost.",
      },
    ],
  },
  {
    group: "Products & stock",
    items: [
      {
        q: "Is the stock on the website up to date?",
        a: `Yes. {name} runs on Potumia, the same system we use in the shop, so stock and prices update as products are sold and restocked.`,
      },
      {
        q: "Are your products genuine?",
        a: "Yes. We buy from trusted suppliers and brands, and every order is checked before it's packed.",
      },
    ],
  },
];

const pages: ThemeContent["pages"] = {
  about: {
    slug: "about",
    title: "About us",
    metaTitle: `About {name} | Online Shopping in Bangladesh`,
    description: `{name} is an online store for everyday products in Bangladesh, with cash on delivery, real-time stock and friendly support. Learn how we work.`,
    eyebrow: `About {name}`,
    intro: `{name} makes everyday shopping simple: clear prices, honest stock, and delivery to your door. You pay only when your order arrives.`,
    sections: [
      {
        heading: "Who we are",
        body: [
          `{name} is an online shop serving customers across Bangladesh. We stock the everyday products people need and deliver them quickly, with the care of a neighbourhood shop.`,
        ],
      },
      {
        heading: "Powered by Potumia",
        body: [
          "Our store runs on Potumia, the point-of-sale and inventory system we use every day. That means the stock and prices you see online are the same as in our shop, and your order reaches our team the moment you place it.",
        ],
      },
      {
        heading: "Our promise",
        body: ["Shopping with us should be easy and worry-free:"],
        list: [
          `${payment} everywhere in Bangladesh: pay only when your order arrives.`,
          `Easy exchanges within {exchangeDays} days.`,
          "Every order checked before it's packed.",
          "Real people on the phone and WhatsApp when you need help.",
        ],
      },
    ],
  },
  shipping: {
    slug: "shipping",
    title: "Shipping & delivery",
    metaTitle: "Shipping & Delivery in Bangladesh | Cash on Delivery",
    description: `{name} delivers across Bangladesh with cash on delivery. Inside Dhaka in {deliveryDhaka}, outside Dhaka in {deliveryOutside}. See how delivery works.`,
    eyebrow: "Help",
    intro: "We deliver to every district in Bangladesh, and you pay in cash when your order arrives. Here's how it works.",
    sections: [
      {
        heading: "Delivery times",
        body: ["Times start from the day we confirm your order:"],
        list: [`Inside Dhaka: {deliveryDhaka}.`, `Outside Dhaka: {deliveryOutside}.`, "Holidays and sales can add a little time. We'll tell you if your order will take longer."],
      },
      {
        heading: "Delivery charges",
        body: ["The charge depends on your location. We confirm the exact amount by phone or message when we confirm your order, so there are no surprises at the door."],
      },
      {
        heading: "Cash on delivery",
        body: ["Pay the delivery person in cash when your parcel arrives. You can check the products before paying. Please keep the exact amount ready if you can."],
      },
      {
        heading: "Order confirmation",
        body: ["After you order, our team calls or messages the number you gave to confirm the products, address and delivery charge. Please keep your phone nearby so your order isn't delayed."],
      },
      {
        heading: "Following your order",
        body: ["With an account, My account shows every order and its status. Guests can call or WhatsApp us with their order number at any time."],
      },
    ],
  },
  returns: {
    slug: "returns",
    title: "Returns & exchange",
    metaTitle: `Easy {exchangeDays}-Day Exchange & Returns Policy`,
    description: `Exchange products from {name} within {exchangeDays} days of delivery. Read our exchange, returns and refund policy and how to start an exchange.`,
    eyebrow: "Help",
    intro: `Something not right? Exchange it within {exchangeDays} days of delivery. Here's everything you need to know.`,
    sections: [
      {
        heading: "Exchange policy",
        body: [`You can exchange a product within {exchangeDays} days of delivery, as long as it is:`],
        list: ["Unused and in the same condition you received it.", "In its original packaging, with all accessories, manuals and tags."],
      },
      {
        heading: "Products we can't exchange",
        body: ["For hygiene and safety, opened food, personal care products and items marked as final sale can't be exchanged unless they're faulty."],
      },
      {
        heading: "Damaged or wrong products",
        body: ["Check your parcel when it arrives. If a product is damaged, faulty or not what you ordered, contact us within 48 hours with your order number and a photo. We'll replace it or refund you in full, delivery included."],
      },
      {
        heading: "How to exchange",
        body: [],
        list: [
          "Call or WhatsApp us with your order number and the product you'd like to exchange.",
          "We'll confirm the replacement and arrange pickup, or tell you where to send it.",
          "Once we receive and check it, we send your replacement.",
        ],
      },
      {
        heading: "Refunds",
        body: ["When a refund is due, we pay it by bKash, Nagad or bank transfer within 7 working days of receiving the product back."],
      },
    ],
  },
  privacy: {
    slug: "privacy",
    title: "Privacy policy",
    metaTitle: "Privacy Policy",
    description: `How {name} collects, uses and protects your personal information when you shop with us.`,
    eyebrow: "Legal",
    intro: `This policy explains what information {name} collects when you shop with us, why, and how we keep it safe.`,
    updated: "2026-10-12",
    sections: [
      {
        heading: "Information we collect",
        body: ["When you order or create an account, we collect:"],
        list: [
          "Your name, email address and mobile number.",
          "Your delivery address and any notes you add.",
          "Your order history with us.",
          "Basic technical information, such as your browser type, to keep the site working and secure.",
        ],
      },
      {
        heading: "How we use it",
        body: ["Only to run the store and serve you:"],
        list: ["To confirm, deliver and support your orders.", "To manage your account and order history.", "To answer questions and handle exchanges.", "To improve our products and website."],
      },
      {
        heading: "Sharing",
        body: ["We never sell your information. We share only what's needed with the courier delivering your order (name, phone and address) and with service providers who help run the store, under confidentiality."],
      },
      {
        heading: "Cookies",
        body: ["We use a few essential cookies, for example to keep you logged in. Your shopping bag is saved in your own browser. We don't use advertising cookies."],
      },
      {
        heading: "Keeping it safe",
        body: ["Passwords are stored encrypted and never visible to our staff, and the site uses a secure connection. You can ask us to update or delete your information at any time."],
      },
      {
        heading: "Contact",
        body: ["Questions about your privacy? Use the details on our Contact page."],
      },
    ],
  },
  terms: {
    slug: "terms",
    title: "Terms & conditions",
    metaTitle: "Terms & Conditions",
    description: `The terms that apply when you browse and buy from {name}.`,
    eyebrow: "Legal",
    intro: `These terms apply when you use the {name} website and place an order. Please read them before you shop.`,
    updated: "2026-10-12",
    sections: [
      {
        heading: "Orders",
        body: ["Placing an order is an offer to buy. It's accepted once we confirm it by phone or message. We may decline an order, for example if a product is out of stock or details can't be confirmed."],
      },
      {
        heading: "Prices and payment",
        body: [
          `Prices are in Bangladeshi Taka (BDT). The delivery charge is confirmed before your order ships. Payment is by ${payment.toLowerCase()}.`,
          "We keep prices and stock accurate. If we find an error, we'll contact you before completing your order.",
        ],
      },
      {
        heading: "Delivery, exchanges and returns",
        body: ["These are covered by our Shipping & Delivery and Returns & Exchange pages, which form part of these terms."],
      },
      {
        heading: "Your account",
        body: ["Keep your password private. You're responsible for orders placed through your account. Tell us straight away if you think someone else has used it."],
      },
      {
        heading: "Changes",
        body: ["We may update these terms from time to time. The version on this page when you order applies to that order."],
      },
    ],
  },
};

export const CONTENT = { pages, faqs } satisfies ThemeContent;
