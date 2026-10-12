import type { ThemeContent } from "../types";
import { THEME } from "./config";

/**
 * Evoke help and company pages. Written for customers and for search: each
 * page answers the questions people actually search for, in plain words.
 * Policies come from THEME.brand.policies so they stay consistent.
 */

const { exchangeDays, deliveryDhaka, deliveryOutside, payment } = THEME.brand.policies;

const faqs: ThemeContent["faqs"] = [
  {
    group: "Orders & payment",
    items: [
      {
        q: "How do I place an order?",
        a: "Choose your pieces, add them to your bag and go to checkout. Enter your name, mobile number and delivery address, then place the order. We call or message you to confirm it before it ships.",
      },
      {
        q: "Which payment methods do you accept?",
        a: `We currently accept ${payment.toLowerCase()} only. You pay the delivery person in cash when your order arrives, so there's nothing to pay online.`,
      },
      {
        q: "Do I need an account to order?",
        a: "No. You can check out as a guest. With a free account your details are saved and you can follow every order and its status from My account.",
      },
      {
        q: "Can I change or cancel my order?",
        a: "Yes, as long as it hasn't been handed to the courier. Call or WhatsApp us with your order number and we'll update or cancel it for you.",
      },
    ],
  },
  {
    group: "Delivery",
    items: [
      {
        q: "Do you deliver all over Bangladesh?",
        a: `Yes. We deliver to every district. Orders inside Dhaka usually arrive in ${deliveryDhaka}, and orders outside Dhaka in ${deliveryOutside}.`,
      },
      {
        q: "How much is the delivery charge?",
        a: "The delivery charge depends on your location and is confirmed with you when we confirm your order, before anything ships.",
      },
      {
        q: "How can I track my order?",
        a: "If you ordered with an account, open My account to see each order and its status: placed, processing, on the way and delivered. You can also call us with your order number.",
      },
    ],
  },
  {
    group: "Returns & exchange",
    items: [
      {
        q: "What is your exchange policy?",
        a: `You can exchange an item within ${exchangeDays} days of delivery for another size or style, as long as it's unworn, unwashed and has its tags attached.`,
      },
      {
        q: "Can I check the product before paying?",
        a: "Yes. You can check your parcel in front of the delivery person before paying. If something is wrong, don't accept it and let us know right away.",
      },
      {
        q: "What if I receive a damaged or wrong item?",
        a: "Contact us within 48 hours of delivery with your order number and a photo. We'll replace it or refund you at no extra cost.",
      },
    ],
  },
  {
    group: "Products & sizing",
    items: [
      {
        q: "How do I find my size?",
        a: "Use our size guide for body measurements and tips on measuring yourself. If you're between sizes, size up for a relaxed fit or message us for advice.",
      },
      {
        q: "Are the colours true to the photos?",
        a: "We photograph every piece in natural light to keep colours accurate. Screens differ slightly, so a small difference in shade is possible.",
      },
    ],
  },
];

const pages: ThemeContent["pages"] = {
  about: {
    slug: "about",
    title: "Our story",
    metaTitle: "About Evoke | Premium Fashion Brand in Bangladesh",
    description:
      "Evoke is a Bangladeshi fashion label making refined, wearable pieces from considered fabrics. Learn about our story, our craft and our promise to you.",
    eyebrow: "About Evoke",
    intro:
      "Evoke began with a simple idea: everyday clothing should feel as considered as an occasion piece. We design refined, wearable fashion for people who value quality over noise.",
    sections: [
      {
        heading: "Made with intention",
        body: [
          "Every Evoke piece starts with the fabric. We choose materials for how they feel, how they wear and how they last, then cut them into clean silhouettes that work season after season.",
          "We keep our collections focused. Fewer, better pieces that sit well together, so building a wardrobe you love is simple.",
        ],
      },
      {
        heading: "Crafted for Bangladesh",
        body: [
          "We design for the climate, the occasions and the pace of life here: breathable fabrics for warm days, polished pieces for work and celebrations, and easy fits for everything in between.",
        ],
      },
      {
        heading: "Our promise",
        body: ["Shopping with Evoke should feel as good as wearing it. That's why we offer:"],
        list: [
          `${payment} everywhere in Bangladesh: pay only when your order arrives.`,
          `Easy exchanges within ${exchangeDays} days if the size or style isn't right.`,
          "Quality checks on every piece before it leaves us.",
          "Real people on the phone and WhatsApp when you need help.",
        ],
      },
    ],
  },
  shipping: {
    slug: "shipping",
    title: "Shipping & delivery",
    metaTitle: "Shipping & Delivery in Bangladesh | Cash on Delivery",
    description: `Evoke delivers across Bangladesh with cash on delivery. Inside Dhaka in ${deliveryDhaka}, outside Dhaka in ${deliveryOutside}. See how delivery works.`,
    eyebrow: "Help",
    intro: `We deliver to every district in Bangladesh, and you pay in cash when your order arrives. Here's how delivery works.`,
    sections: [
      {
        heading: "Delivery times",
        body: ["Delivery times start from the day we confirm your order:"],
        list: [
          `Inside Dhaka: ${deliveryDhaka}.`,
          `Outside Dhaka: ${deliveryOutside}.`,
          "During sales, holidays and Eid, deliveries can take a little longer. We'll let you know if yours will.",
        ],
      },
      {
        heading: "Delivery charges",
        body: [
          "The delivery charge depends on where you are. We confirm the exact amount with you by phone or message when we confirm your order, before it ships, so there are no surprises at the door.",
        ],
      },
      {
        heading: "Cash on delivery",
        body: [
          "Pay the delivery person in cash when your parcel arrives. You're welcome to check the items in front of them before paying. Please keep the exact amount ready if you can.",
        ],
      },
      {
        heading: "Order confirmation",
        body: [
          "After you place an order, our team calls or messages you on the mobile number you gave to confirm the items, your address and the delivery charge. Orders we can't reach you about may be delayed, so please keep your phone nearby.",
        ],
      },
      {
        heading: "Following your order",
        body: [
          "If you ordered with an account, open My account to see every order and its status: placed, processing, on the way and delivered. Guests can call or WhatsApp us with their order number at any time.",
        ],
      },
    ],
  },
  returns: {
    slug: "returns",
    title: "Returns & exchange",
    metaTitle: `Easy ${exchangeDays}-Day Exchange & Returns Policy`,
    description: `Exchange Evoke items within ${exchangeDays} days of delivery. Read our exchange, returns and refund policy, and how to start an exchange.`,
    eyebrow: "Help",
    intro: `Not the right size or style? Exchange it within ${exchangeDays} days of delivery. Here's everything you need to know.`,
    sections: [
      {
        heading: "Exchange policy",
        body: [`You can exchange any item within ${exchangeDays} days of delivery for a different size, colour or style, as long as it is:`],
        list: ["Unworn, unwashed and unaltered.", "In its original condition with all tags attached.", "Returned with its original packaging where possible."],
      },
      {
        heading: "Items we can't exchange",
        body: ["For hygiene reasons, innerwear and accessories that have been used can't be exchanged, and neither can items bought at a final-sale discount unless they're faulty."],
      },
      {
        heading: "Damaged or wrong items",
        body: [
          "Check your parcel when it arrives. If an item is damaged, faulty or not what you ordered, contact us within 48 hours of delivery with your order number and a photo. We'll replace it or refund you in full, and cover the delivery cost.",
        ],
      },
      {
        heading: "How to exchange",
        body: [],
        list: [
          "Call or WhatsApp us with your order number and the item you'd like to exchange.",
          "We'll confirm the replacement and arrange collection or tell you where to send it.",
          "Once we receive and check the item, we'll send out your replacement.",
        ],
      },
      {
        heading: "Refunds",
        body: [
          "When a refund is due (for example for a faulty item we can't replace), we refund you by bKash, Nagad or bank transfer within 7 working days of receiving the item back.",
        ],
      },
    ],
  },
  "size-guide": {
    slug: "size-guide",
    title: "Size guide",
    metaTitle: "Size Guide | Find Your Perfect Fit",
    description: "Find your Evoke size with our size chart and simple tips for measuring chest, waist, hips and length at home.",
    eyebrow: "Help",
    intro: "Our pieces are cut to standard sizes. Measure yourself with a soft tape and compare with the chart below to find your best fit.",
    sections: [
      {
        heading: "How to measure",
        body: ["Measure over light clothing and keep the tape comfortably snug, not tight."],
        list: [
          "Chest: around the fullest part of your chest, under the arms.",
          "Waist: around your natural waistline, the narrowest part of your torso.",
          "Hips: around the fullest part of your hips.",
          "Length: from the highest point of the shoulder down to where you'd like the garment to end.",
        ],
      },
      {
        heading: "Between sizes?",
        body: [
          "Size up for a relaxed fit or size down for a closer fit. Each product page may also note how that piece fits. Still unsure? Message us your measurements and we'll recommend a size.",
        ],
      },
    ],
  },
  privacy: {
    slug: "privacy",
    title: "Privacy policy",
    metaTitle: "Privacy Policy",
    description: "How Evoke collects, uses and protects your personal information when you shop with us.",
    eyebrow: "Legal",
    intro: "Your privacy matters to us. This policy explains what information we collect when you shop at Evoke, why we collect it and how we keep it safe.",
    updated: "2026-10-12",
    sections: [
      {
        heading: "Information we collect",
        body: ["When you place an order or create an account, we collect:"],
        list: [
          "Your name, email address and mobile number.",
          "Your delivery address and any notes you add to an order.",
          "Your order history with us.",
          "Basic technical information such as your browser type, used to keep the site working and secure.",
        ],
      },
      {
        heading: "How we use it",
        body: ["We use your information only to run the store and serve you:"],
        list: [
          "To confirm, deliver and support your orders.",
          "To manage your account and let you see your order history.",
          "To answer your questions and handle exchanges.",
          "To improve our products and website.",
        ],
      },
      {
        heading: "Sharing",
        body: [
          "We never sell your personal information. We share only what's needed with the courier delivering your order (your name, phone number and address), and with service providers who help us run the store, under confidentiality.",
        ],
      },
      {
        heading: "Cookies",
        body: [
          "We use a small number of essential cookies, for example to keep you logged in. Your shopping bag is saved in your own browser. We don't use advertising cookies.",
        ],
      },
      {
        heading: "Keeping it safe",
        body: [
          "Passwords are stored encrypted and never visible to our staff, and the site is served over a secure connection. You can ask us to update or delete your information at any time.",
        ],
      },
      {
        heading: "Contact",
        body: ["Questions about your privacy? Contact us using the details on our Contact page."],
      },
    ],
  },
  terms: {
    slug: "terms",
    title: "Terms & conditions",
    metaTitle: "Terms & Conditions",
    description: "The terms that apply when you browse and buy from the Evoke online store.",
    eyebrow: "Legal",
    intro: "These terms apply when you use the Evoke website and place an order with us. Please read them before you shop.",
    updated: "2026-10-12",
    sections: [
      {
        heading: "Orders",
        body: [
          "Placing an order is an offer to buy. Your order is accepted once we confirm it with you by phone or message. We may decline an order, for example if an item is out of stock or the details can't be confirmed.",
        ],
      },
      {
        heading: "Prices and payment",
        body: [
          `Prices are shown in Bangladeshi Taka (BDT). The delivery charge is confirmed before your order ships. Payment is by ${payment.toLowerCase()}.`,
          "We work hard to keep prices and stock accurate. If an error is found, we'll contact you before completing your order.",
        ],
      },
      {
        heading: "Delivery, exchanges and returns",
        body: ["Delivery, exchanges and returns are covered by our Shipping & Delivery and Returns & Exchange pages, which form part of these terms."],
      },
      {
        heading: "Your account",
        body: ["Keep your password private. You're responsible for orders placed through your account. Tell us right away if you think someone else has used it."],
      },
      {
        heading: "Content",
        body: ["All photos, designs, text and the Evoke name and logo belong to Evoke and may not be used without our permission."],
      },
      {
        heading: "Changes",
        body: ["We may update these terms from time to time. The version on this page when you place an order applies to that order."],
      },
    ],
  },
};

/** Size chart (inches), shown on the size guide */
const sizeChart = {
  headers: ["Size", "Chest", "Waist", "Hips"],
  rows: [
    ["XS", "32–34", "26–28", "34–36"],
    ["S", "34–36", "28–30", "36–38"],
    ["M", "38–40", "32–34", "40–42"],
    ["L", "42–44", "36–38", "44–46"],
    ["XL", "46–48", "40–42", "48–50"],
    ["XXL", "50–52", "44–46", "52–54"],
  ],
};

export const CONTENT = { pages, faqs, sizeChart } satisfies ThemeContent;
