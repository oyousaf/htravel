export interface PackageTier {
  name: string;
  price: string;
  duration: string;
  features: string[];
  featured?: boolean;
}

export const umrahPackages: PackageTier[] = [
  {
    name: "Umrah Economy",
    price: "From £799 pp",
    duration: "10 nights",
    features: [
      "Return flights",
      "Shared room in 3* hotel, Makkah & Madinah",
      "Airport transfers & Ziyarat tour",
      "Visa processing included",
    ],
  },
  {
    name: "Umrah Premium",
    price: "From £1,299 pp",
    duration: "12 nights",
    features: [
      "Return flights (direct where available)",
      "4*/5* hotels close to Haram",
      "Private transfers & guided Ziyarat",
      "Visa processing & 24/7 group leader support",
    ],
    featured: true,
  },
  {
    name: "Umrah Family",
    price: "Custom quote",
    duration: "Flexible",
    features: [
      "Tailored group sizes and dates",
      "Family room configurations",
      "Ramadan & school-holiday availability",
      "Flexible payment plans",
    ],
  },
];

export const hajjPackages: PackageTier[] = [
  {
    name: "Hajj Standard",
    price: "From £5,499 pp",
    duration: "14 nights",
    features: [
      "Full Hajj rites guidance & group leader",
      "3*/4* accommodation in Makkah & Madinah",
      "Mina & Arafat camp packages",
      "All transfers and visa processing",
    ],
  },
  {
    name: "Hajj VIP",
    price: "From £8,999 pp",
    duration: "16 nights",
    features: [
      "5* accommodation, closest available to Haram",
      "Premium Mina & Arafat camps",
      "Private transfers throughout",
      "Dedicated scholar-led guidance",
    ],
    featured: true,
  },
];
