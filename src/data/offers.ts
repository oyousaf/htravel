export interface Offer {
  title: string;
  items: { label: string; price: string; unit?: string }[];
  deal?: string;
  theme: "green" | "brown" | "maroon";
  image: string;
}

export const offers: Offer[] = [
  {
    title: "Ihram & Shoe Bag",
    items: [
      { label: "Ihram", price: "£22" },
      { label: "Shoe bag", price: "£5" },
    ],
    deal: "Buy both for only £25",
    theme: "green",
    image: "/images/offers/ihram.jpg",
  },
  {
    title: "Fresh Dates",
    items: [
      { label: "Ajwa dates", price: "£15", unit: "per kg" },
      { label: "Mabroom dates", price: "£13", unit: "per kg" },
    ],
    deal: "Limited stock available",
    theme: "brown",
    image: "/images/offers/dates.jpg",
  },
  {
    title: "Tasbih",
    items: [
      { label: "Digital tasbih", price: "£10" },
      { label: "Normal tasbih", price: "£2", unit: "each" },
    ],
    deal: "Normal tasbih: 3 for £5",
    theme: "maroon",
    image: "/images/offers/tasbih.jpg",
  },
];
