export interface Testimonial {
  quote: string;
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
      "Honestly it was absolutely amazing service! The travel agency went above and beyond to find us a great deal on our flight to Pakistan, saving us both time and money. From start to finish, the process was smooth, professional, and stress-free.",
  },
  {
    quote:
      "From the very first interaction, the staff were friendly, attentive, and incredibly knowledgeable. They took the time to understand exactly what I was looking for and found options that fit my budget perfectly.",
  },
  {
    quote:
      "Thank you to Heckmondwike Travel & Tours for all the efforts they went through to make our Hajj journey the best.",
    context: "Hajj booking",
  },
  {
    quote:
      "Booked a flight to Turkey, very friendly staff, would definitely be booking again through this business!",
    context: "Turkey booking",
  },
];
