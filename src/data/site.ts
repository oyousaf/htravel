export const site = {
  name: "Heckmondwike Travel & Tours",
  tagline: "Turning Dreams Into Memories",
  phone: "01924 409933",
  phoneHref: "tel:+441924409933",
  whatsappHref: "https://wa.me/441924409933",
  address: {
    line1: "36 Oldfield Ln",
    line2: "Heckmondwike WF16 0JD, UK",
    full: "36 Oldfield Ln, Heckmondwike WF16 0JD, UK",
  },
  mapsEmbedSrc:
    "https://www.google.com/maps?q=36+Oldfield+Ln,+Heckmondwike+WF16+0JD,+UK&output=embed",
  hours: [
    { day: "Monday", time: "10:00 AM – 6:00 PM" },
    { day: "Tuesday", time: "10:00 AM – 6:00 PM" },
    { day: "Wednesday", time: "10:00 AM – 4:00 PM" },
    { day: "Thursday", time: "10:00 AM – 6:00 PM" },
    { day: "Friday", time: "10:00 AM – 6:00 PM" },
    { day: "Saturday", time: "11:00 AM – 4:00 PM" },
    { day: "Sunday", time: "Closed" },
  ],
  nav: [
    { label: "Destinations", href: "/destinations" },
    { label: "Hajj & Umrah", href: "/packages/hajj-umrah" },
    { label: "Visa Info", href: "/visa-info" },
    { label: "About", href: "/about" },
    { label: "Contact", href: "/contact" },
  ],
};

export type DayHours = (typeof site.hours)[number];
