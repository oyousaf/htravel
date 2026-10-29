// Default package details. The admin dashboard saves edits to the fields
// marked "editable" in Redis; everything else comes from here.

export interface UmrahHotel {
  city: string;
  name: string; // editable
  stars: number; // editable
  nights: number; // editable
  board: string;
}

export interface UmrahFlight {
  leg: "outbound" | "return"; // dated from the package's departure or return date
  flight: string;
  from: string;
  departs: string;
  to: string;
  arrives: string;
  duration: string;
}

export interface UmrahPackage {
  name: string; // editable
  departDate: string; // editable, YYYY-MM-DD
  returnDate: string; // editable, YYYY-MM-DD
  leader: string;
  hotels: UmrahHotel[];
  rooms: { label: string; price: number }[]; // price editable
  youthChildDiscount: number;
  nonBritishSurcharge: number;
  deposit: number; // editable
  airline: string;
  flights: UmrahFlight[];
  flightNote: string;
  transport: string[];
  includes: string[];
}

// Hajj flights are quoted as a window, e.g. "4th or 5th May" or "7th – 10th May".
export interface DateWindow {
  from: string; // YYYY-MM-DD, earliest
  to: string; // YYYY-MM-DD, latest (same as from for a single date)
}

export interface HajjPackage {
  name: string;
  departure: DateWindow; // editable
  return: DateWindow; // editable
  hotels: { city: string; name: string; detail?: string }[]; // name editable
  rooms: { label: string; price: number }[]; // price editable
}

// The season's title ("Hajj 2027") and the day it drops off the packages page
// are worked out from the earliest departure; see getHajj().
export interface HajjSeason {
  leader: string;
  maktab: string; // editable, one of maktabOptions
  eligibility: string;
  includes: string[];
  contacts: { number: string; href: string }[];
  packages: HajjPackage[];
}

// Mina tent categories and zones offered in the admin dropdown.
export const maktabOptions = ["A", "B", "C", "D"].flatMap((maktab) =>
  [1, 2, 3, 4, 5].map((zone) => `Maktab ${maktab}, Zone ${zone}`)
);

export const defaultUmrah: UmrahPackage = {
  name: "October Umrah Package",
  departDate: "2026-10-18",
  returnDate: "2026-10-30",
  leader: "Al-Hajj Tahir Nawaz",
  hotels: [
    { city: "Makkah", name: "Emaar Grand Hotel", stars: 4, nights: 7, board: "Breakfast" },
    { city: "Madinah", name: "Emaar Royal Hotel Madinah", stars: 5, nights: 5, board: "Breakfast" },
  ],
  rooms: [
    { label: "Quad sharing", price: 1350 },
    { label: "Triple sharing", price: 1450 },
    { label: "Double sharing", price: 1650 },
  ],
  youthChildDiscount: 100,
  nonBritishSurcharge: 110,
  deposit: 200,
  airline: "Saudia",
  flights: [
    { leg: "outbound", flight: "SV124", from: "Manchester (MAN)", departs: "2:45 pm", to: "Jeddah (JED)", arrives: "11:15 pm", duration: "6h 30m" },
    { leg: "return", flight: "SV1421", from: "Madinah (MED)", departs: "3:35 am", to: "Jeddah (JED)", arrives: "4:50 am", duration: "1h 15m" },
    { leg: "return", flight: "SV123", from: "Jeddah (JED)", departs: "8:00 am", to: "Manchester (MAN)", arrives: "11:55 am", duration: "6h 55m" },
  ],
  flightNote: "Local times shown. Return connects in Jeddah (3h 10m transit).",
  transport: [
    "Jeddah Airport to Makkah hotel",
    "Makkah hotel to Madinah hotel",
    "Madinah hotel to Madinah Airport",
  ],
  includes: ["Visa waiver on British passport", "Flights", "Transport", "Ziyarat", "Hotels"],
};

export const defaultHajj: HajjSeason = {
  leader: "Al-Hajj Tahir Nawaz",
  maktab: "Maktab A, Zone 1",
  eligibility: "Travelling from the UK on a Pakistani passport",
  includes: ["Visas", "Flights", "Hotels", "Ziyarat", "Private transport", "Qurbani"],
  contacts: [
    { number: "01924 409933", href: "tel:+441924409933" },
    { number: "07311 398717", href: "tel:+447311398717" },
    { number: "07988 743672", href: "tel:+447988743672" },
  ],
  packages: [
    {
      name: "17-Day Hajj",
      departure: { from: "2027-05-04", to: "2027-05-05" },
      return: { from: "2027-05-23", to: "2027-05-25" },
      hotels: [
        { city: "Makkah", name: "Hilton Convention" },
        { city: "Makkah", name: "Azizia" },
        { city: "Madinah", name: "Mysk Touch" },
      ],
      rooms: [
        { label: "Quad", price: 7950 },
        { label: "Triple", price: 8350 },
        { label: "Double", price: 9150 },
      ],
    },
    {
      name: "14-Day Hajj",
      departure: { from: "2027-05-07", to: "2027-05-10" },
      return: { from: "2027-05-23", to: "2027-05-25" },
      hotels: [
        { city: "Makkah", name: "Azizia", detail: "3★, full board" },
        { city: "Madinah", name: "Mysk Touch Al Balad Hotel", detail: "3★, full board" },
      ],
      rooms: [
        { label: "Quad", price: 7650 },
        { label: "Triple", price: 8050 },
        { label: "Double", price: 8750 },
      ],
    },
  ],
};
