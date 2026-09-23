export const site = {
  name: "Heckmondwike Travel & Tours",
  tagline: "Turning Dreams Into Memories",
  phone: "01924 409933",
  phoneHref: "tel:+441924409933",
  mobile: "07311 398717",
  mobileHref: "tel:+447311398717",
  whatsappHref: "https://wa.me/447311398717",
  email: "heckmondwiketravelandtours@gmail.com",
  emailHref: "mailto:heckmondwiketravelandtours@gmail.com",
  social: {
    facebook:
      "https://www.facebook.com/people/Heckmondwike-Travel-tours/pfbid0eAtH3DzEiubsDXyfUTLdNDMLZb44iFEKXiUQ71S7v3Y8hjQevHojJ483Rw7UmPBQl/",
    tiktok: "https://www.tiktok.com/@heckmondwike.trav8",
  },
  address: {
    line1: "36 Oldfield Lane",
    line2: "Heckmondwike, WF16 0JD",
    full: "36 Oldfield Lane, Heckmondwike, WF16 0JD",
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
