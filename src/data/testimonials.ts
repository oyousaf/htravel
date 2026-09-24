export interface Testimonial {
  quote: string;
  rating: number;
  context?: string;
}

// Sourced manually from the business's public Google reviews (4.7★, 14 reviews)
// as a one-time snapshot — not a live feed. Refresh periodically by checking
// Google Maps directly; re-scraping Google automatically isn't reliable or
// permitted by their terms of service.
export const googleRating = 4.7;
export const googleReviewCount = 14;
export const googleMapsUrl =
  "https://www.google.com/maps/search/?api=1&query=Heckmondwike+Travel+%26+Tours+36+Oldfield+Ln+Heckmondwike+WF16+0JD";

export const testimonials: Testimonial[] = [
  {
    quote:
      "Booking through Heckmondwike Travel & Tours has, on every occasion, been an unequivocal pleasure. I have consistently found the company to be genuinely compassionate and conscientious, ensuring that every pilgrim receives the care and support they require, whenever and wherever it may be needed.",
    rating: 5,
    context: "Hajj 2026",
  },
  {
    quote:
      "My inaugural Hajj in 2026 with Heckmondwike Travel & Tours was, without reservation, a five-star experience — truly the journey of a lifetime.",
    rating: 5,
    context: "Hajj 2026",
  },
  {
    quote:
      "We booked our Hajj 2026 package with Heckmondwike Travel & Tours, and the entirety of the experience surpassed our expectations. Every aspect was organised with meticulous care, allowing us to devote our full attention to worship rather than logistical concerns.",
    rating: 5,
    context: "Hajj 2026",
  },
  {
    quote:
      "The service was truly exceptional — the agency went above and beyond to secure an excellent fare for our flight to Pakistan, saving us considerable time and expense. The entire process was seamless, professional, and thoroughly stress-free.",
    rating: 5,
    context: "Pakistan trip",
  },
  {
    quote:
      "The finest in the business — I am thoroughly impressed by the swiftness of their money transfer service and the impeccable organisation of everything they offer.",
    rating: 5,
    context: "Money transfer",
  },
  {
    quote:
      "I recently booked my trip through this agency and could not have been more satisfied. From our very first interaction, the staff were friendly, attentive, and remarkably knowledgeable, tailoring every detail to my budget, schedule, and interests. Their communication was swift, lucid, and consistently reassuring, rendering the whole process wonderfully stress-free. I recommend them unreservedly to anyone seeking a seamless, meticulously planned travel experience, and shall certainly be booking with them again.",
    rating: 5,
  },
];
