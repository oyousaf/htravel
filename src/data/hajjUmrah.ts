export const octoberUmrah = {
  name: "October Umrah Package",
  nights: 12,
  departs: "2026-10-18T00:00:00+01:00",
  dates: "18 – 30 October 2026",
  leader: "Al-Hajj Tahir Nawaz",
  hotels: [
    {
      city: "Makkah",
      name: "Emaar Grand Hotel",
      stars: 4,
      board: "Breakfast",
      checkIn: "18 Oct",
      checkOut: "25 Oct",
      nights: 7,
    },
    {
      city: "Madinah",
      name: "Emaar Royal Hotel Madinah",
      stars: 5,
      board: "Breakfast",
      checkIn: "25 Oct",
      checkOut: "30 Oct",
      nights: 5,
    },
  ],
  rooms: [
    { label: "Quad sharing", price: "£1,350" },
    { label: "Triple sharing", price: "£1,450" },
    { label: "Double sharing", price: "£1,650" },
  ],
  youthChildDiscount: "£100",
  nonBritishSurcharge: "£110",
  deposit: "£200",
  flights: [
    { date: "Sun 18 Oct", flight: "SV124", from: "Manchester (MAN)", departs: "2:45 pm", to: "Jeddah (JED)", arrives: "11:15 pm", duration: "6h 30m" },
    { date: "Fri 30 Oct", flight: "SV1421", from: "Madinah (MED)", departs: "3:35 am", to: "Jeddah (JED)", arrives: "4:50 am", duration: "1h 15m" },
    { date: "Fri 30 Oct", flight: "SV123", from: "Jeddah (JED)", departs: "8:00 am", to: "Manchester (MAN)", arrives: "11:55 am", duration: "6h 55m" },
  ],
  airline: "Saudia",
  transport: [
    "Jeddah Airport to Makkah hotel",
    "Makkah hotel to Madinah hotel",
    "Madinah hotel to Madinah Airport",
  ],
  includes: ["Visa waiver on British passport", "Flights", "Transport", "Ziyarat", "Hotels"],
};

export const hajj2027 = {
  leader: "Al-Hajj Tahir Nawaz",
  departs: "2027-05-04T00:00:00+01:00",
  maktab: "Maktab B, Zone 2",
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
      departure: "4th or 5th May 2027",
      return: "23rd – 25th May 2027",
      hotels: [
        { city: "Makkah", name: "Hilton Convention" },
        { city: "Madinah", name: "Mysk Touch" },
      ],
      rooms: [
        { label: "Quad", price: "£7,300" },
        { label: "Triple", price: "£7,700" },
        { label: "Double", price: "£8,500" },
      ],
    },
    {
      name: "14-Day Hajj",
      departure: "7th – 10th May 2027",
      return: "23rd – 25th May 2027",
      hotels: [
        { city: "Makkah", name: "Azizia", detail: "3★, full board" },
        { city: "Madinah", name: "Mysk Touch Al Balad Hotel", detail: "3★, full board" },
      ],
      rooms: [
        { label: "Quad", price: "£7,000" },
        { label: "Triple", price: "£7,400" },
        { label: "Double", price: "£8,100" },
      ],
    },
  ],
};
