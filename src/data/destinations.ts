export interface Destination {
  name: string;
  country: string;
  slug: string;
  blurb: string;
  image: string;
}

// image: seeded Lorem Picsum placeholders — swap for real destination photos
// in public/images/destinations/<slug>.jpg, then point `image` back to that path.
export const destinations: Destination[] = [
  {
    name: "Lahore",
    country: "Pakistan",
    slug: "lahore",
    blurb: "Direct and connecting flights, family fares, and excess baggage deals.",
    image: "https://picsum.photos/seed/lahore-htravel/800/1000",
  },
  {
    name: "Islamabad",
    country: "Pakistan",
    slug: "islamabad",
    blurb: "Competitive return fares with flexible date options.",
    image: "https://picsum.photos/seed/islamabad-htravel/800/1000",
  },
  {
    name: "Karachi",
    country: "Pakistan",
    slug: "karachi",
    blurb: "Best-value fares from Manchester, Birmingham, and Leeds Bradford.",
    image: "https://picsum.photos/seed/karachi-htravel/800/1000",
  },
  {
    name: "Dubai",
    country: "UAE",
    slug: "dubai",
    blurb: "City breaks, stopovers, and family holiday packages.",
    image: "https://picsum.photos/seed/dubai-htravel/800/1000",
  },
  {
    name: "Istanbul",
    country: "Turkey",
    slug: "istanbul",
    blurb: "Culture, history, and all-inclusive holiday options.",
    image: "https://picsum.photos/seed/istanbul-htravel/800/1000",
  },
  {
    name: "Antalya",
    country: "Turkey",
    slug: "antalya",
    blurb: "Beach resorts and all-inclusive family holidays.",
    image: "https://picsum.photos/seed/antalya-htravel/800/1000",
  },
];
