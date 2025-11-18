//Mock data for backend API
const events = [
  {
    id: 1,
    city: "Helsinki",
    title: "Helsinki Christmas Market – Senate Square",
    publisher: "Tuomaan Markkinat",
    category: "Family",
    description:
      "Finland’s oldest outdoor Christmas market with artisan stalls, festive food and a vintage carousel under Helsinki Cathedral.",
    date: "1 Dec – 22 Dec 2025",
    location: "Senate Square, Helsinki",
    link: "https://en.wikipedia.org/wiki/Helsinki_Christmas_Market",
    image:
      "https://tuomaanmarkkinat.fi/app/uploads/sites/2/2024/04/2023_Tuomaan_Markkinat_Print-78-1024x683.jpg",
    tags: "Christmas, Outdoor",
  },
  {
    id: 2,
    city: "Helsinki",
    title: "World Village Festival",
    publisher: "World Village Festival",
    category: "Art & Culture",
    description:
      "A free, vibrant multicultural festival in Helsinki showcasing music, theatre, dance and food from around the world.",
    date: "May 2026",
    location: "Helsinki",
    link: "https://www.helsinki.com/v/festivals/",
    image:
      "https://www.helsinki.com/media/public/ketki/World%20Village%20Festival.jpg",
    tags: "Multicultural, Outdoor"
  },
  {
    id: 3,
    city: "Espoo",
    title: "PianoEspoo Festival",
    publisher: "PianoEspoo",
    category: "Art & Culture",
    description:
      "Renowned piano music festival in Espoo featuring top international pianists and young Finnish talents.",
    date: "19 Sept – 5 Oct 2025",
    location: "Espoo",
    link: "https://www.visitespoo.fi/en/category/events",
    image:
      "https://www.visitespoo.fi/sites/default/files/styles/1_1_s/public/2025-09/550660845_18519453604053277_8756413863435097288_n%20%281%29.jpg?h=8296598c&itok=71pWqMkS",
    tags: "Classical Music, Indoor"
  },
  {
    id: 4,
    city: "Espoo",
    title: "Weekend Festival Espoo",
    publisher: "Weekend Festival",
    category: "Music",
    description:
      "One of the summer’s biggest electronic-music festivals held at Vermo Arena in Espoo – top DJs, festival vibes, fun outdoors.",
    date: "1-2 Aug 2025",
    location: "Vermo Arena, Espoo",
    link: "https://www.visitespoo.fi/en/category/events",
    image:
      "https://www.visitespoo.fi/sites/default/files/styles/1_1_s/public/2025-04/WKND_Day1_221249_HenriJuvonen_6403-768x512%20%281%29.jpg?h=8296598c&itok=fYHkM3of",
    tags: "Electronic Music, Outdoor"
  },
  {
    id: 5,
    city: "Vantaa",
    title: "BRQ Vantaa Festival",
    publisher: "BRQ Vantaa Festival",
    category: "Music",
    description:
      "Classical and baroque music festival in Vantaa, with concerts in historic churches and modern venues.",
    date: "8–14 Aug 2026",
    location: "Vantaa",
    link: "https://festivals.fi/en/festivals/brq-vantaa-festival/",
    image:
      "https://festivals.fi/wp-content/uploads/2013/04/BRQ-Vantaa-Festival-photo-Vantaan-Fotokerho-Eero-Kukkonen-1-913x515.jpeg",
    tags: "Classical Music, Indoor"
  },
  {
    id: 6,
    city: "Vantaa",
    title: "Arctic Open Badminton Tournament",
    publisher: "Arctic Open",
    category: "Sports",
    description:
      "Top-level international badminton tournament held at Energia Areena, Vantaa – world-tour level players compete.",
    date: "7–12 Oct 2025",
    location: "Energia Areena, Vantaa",
    link: "https://www.arcticopen.fi/theevent/",
    image:
      "https://www.arcticopen.fi/site/assets/files/1173/20210924_1912_sudirmancup2021_bprs1949-2.2000x700-u1i0s1q90f1t450l748z0.jpg",
    tags: "Badminton, Indoor"
  }
];

const users = [
  {
    id: 1,
    name: "Alice Johnson",
    email: "alice.johnson@example.com",
    password: "alicepassword",
    dateOfBirth: "1993-05-15",
    favouriteEvents: [1, 3],
    preferences: {
      categories: ["Music"],
      tags: ["Outdoor"],
      cities: ["Helsinki"],
    }
  },
  {
    id: 2,
    name: "Bob Smith",
    email: "bob.smith@example.com",
    password: "bobpassword",
    dateOfBirth: "1998-02-20",
    favouriteEvents: [2],
    preferences: {
      categories: ["Art & Culture"],
      tags: ["Indoor"],
      cities: ["Helsinki"],
    }
  },
  {
    id: 3,
    name: "Charlie Brown",
    email: "charlie.brown@example.com",
    password: "charliepassword",
    dateOfBirth: "1995-08-30",
    favouriteEvents: [3],
    preferences: {
      categories: ["Music", "Sports"],
      tags: ["Outdoor"],
      cities: ["Espoo"],
    }
  },
  {
    id: 4,
    name: "Diana Prince",
    email: "diana.prince@example.com",
    password: "dianapassword",
    dateOfBirth: "1991-12-01",
    favouriteEvents: [4],
    preferences: {
      categories: ["Art & Culture"],
      tags: ["Indoor", "classical music"],
      cities: ["Helsinki"],
    }
  },
];

const transports = [
  {
    id: 1,
    type: "Bus",
    lines: ["200", "57", "554"],
  },
  {
    id: 2,
    type: "Tram",
    lines: ["15", "13", "10"],
  },
  {
    id: 3,
    type: "Metro",
    lines: ["M1", "M2"],
  },
  {
    id: 4,
    type: "Train",
    lines: ["A", "U", "T"],
  },
];

module.exports = { events, users, transports };