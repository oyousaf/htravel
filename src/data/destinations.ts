export interface Destination {
  name: string;
  country: string;
  slug: string;
  blurb: string;
  description: string;
  weatherCity: string;
  image: string;
}

// image: seeded Lorem Picsum placeholders — swap for real destination photos
// in public/images/destinations/<slug>.jpg, then point `image` back to that path.
// weatherCity: the city name passed to OpenWeatherMap's API.
export const destinations: Destination[] = [
  {
    name: "Lahore",
    country: "Pakistan",
    slug: "lahore",
    blurb: "Direct and connecting flights, family fares, and excess baggage deals.",
    description:
      "Lahore is our most-booked route — whether you're visiting family, attending a wedding, or heading back for good. We compare direct and connecting fares across the major carriers to find the best combination of price, baggage allowance, and travel time, and can arrange extra baggage for gifts and luggage on the way out.",
    weatherCity: "Lahore,PK",
    image: "https://picsum.photos/seed/lahore-htravel/800/1000",
  },
  {
    name: "Islamabad",
    country: "Pakistan",
    slug: "islamabad",
    blurb: "Competitive return fares with flexible date options.",
    description:
      "For Islamabad and the wider Rawalpindi area, we track fares across the year to find flexible-date deals that work around school holidays and family events, with support choosing the best connection times for older or younger travellers.",
    weatherCity: "Islamabad,PK",
    image: "https://picsum.photos/seed/islamabad-htravel/800/1000",
  },
  {
    name: "Karachi",
    country: "Pakistan",
    slug: "karachi",
    blurb: "Best-value fares from Manchester, Birmingham, and Leeds Bradford.",
    description:
      "We regularly source Karachi fares from Manchester, Birmingham, and Leeds Bradford, so you're not limited to a single departure airport. Get in touch and we'll compare all three for the best combination of price and convenience.",
    weatherCity: "Karachi,PK",
    image: "https://picsum.photos/seed/karachi-htravel/800/1000",
  },
  {
    name: "Dubai",
    country: "UAE",
    slug: "dubai",
    blurb: "City breaks, stopovers, and family holiday packages.",
    description:
      "From short city breaks to full family holiday packages, we put together Dubai trips that include flights, hotels, and transfers. Dubai also works well as a stopover if you're breaking up a longer journey.",
    weatherCity: "Dubai,AE",
    image: "https://picsum.photos/seed/dubai-htravel/800/1000",
  },
  {
    name: "Istanbul",
    country: "Turkey",
    slug: "istanbul",
    blurb: "Culture, history, and all-inclusive holiday options.",
    description:
      "Istanbul is a favourite for travellers wanting culture and history alongside a proper holiday. We can arrange flights only, or a full package with hotels, transfers, and guided extras.",
    weatherCity: "Istanbul,TR",
    image: "https://picsum.photos/seed/istanbul-htravel/800/1000",
  },
  {
    name: "Antalya",
    country: "Turkey",
    slug: "antalya",
    blurb: "Beach resorts and all-inclusive family holidays.",
    description:
      "Antalya is our go-to recommendation for a reliable, good-value all-inclusive family holiday — sun, beach resorts, and a short flight time compared to further-flung destinations.",
    weatherCity: "Antalya,TR",
    image: "https://picsum.photos/seed/antalya-htravel/800/1000",
  },
];
