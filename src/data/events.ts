// Event content. Everything marked TODO is placeholder copy that must be
// replaced with real NPAS details before launch.

export type NpasEvent = {
  slug: string;
  number: string;
  title: string;
  tag: string;
  date: string;
  venue: string;
  format: string;
  summary: string;
  description: string[];
  /** External registration link. Empty string shows "registration opens soon". */
  registerUrl: string;
  /** Paths under /public. Gallery is hidden while empty. */
  photos: string[];
  flagship?: boolean;
};

export const events: NpasEvent[] = [
  {
    slug: "space-week",
    number: "01",
    title: "Space Week",
    tag: "Flagship",
    date: "TBA", // TODO
    venue: "NUST H-12, Islamabad",
    format: "Talks, exhibitions, competitions, night sky observation",
    summary:
      "A week of talks, telescope nights, competitions and exhibitions. The biggest space event on campus.",
    description: [
      "TODO: Describe Space Week. What happens each day, who it is for, and why someone should not miss it.",
      "TODO: Mention speakers, competitions and anything new this year.",
    ],
    registerUrl: "", // TODO: paste the registration form link
    photos: [],
    flagship: true,
  },
  {
    slug: "stargazing-night",
    number: "02",
    title: "Stargazing Night",
    tag: "Outdoor",
    date: "TBA", // TODO
    venue: "TBA", // TODO
    format: "Telescope session under the night sky",
    summary:
      "Telescopes, a dark sky and people who know where to point them. Planets, the Moon and deep sky objects.",
    description: ["TODO: Describe Stargazing Night."],
    registerUrl: "",
    photos: [],
  },
  {
    slug: "astrophotography-workshop",
    number: "03",
    title: "Astrophotography Workshop",
    tag: "Hands-on",
    date: "TBA", // TODO
    venue: "TBA", // TODO
    format: "Workshop",
    summary:
      "Learn to photograph the night sky with the camera you already have, from settings to stacking.",
    description: ["TODO: Describe the Astrophotography Workshop."],
    registerUrl: "",
    photos: [],
  },
  {
    slug: "guest-lecture-series",
    number: "04",
    title: "Guest Lecture Series",
    tag: "Talks",
    date: "TBA", // TODO
    venue: "TBA", // TODO
    format: "Lectures and Q&A",
    summary:
      "Researchers and scientists on black holes, exoplanets, cosmology and the physics that ties it together.",
    description: ["TODO: Describe the Guest Lecture Series."],
    registerUrl: "",
    photos: [],
  },
  {
    slug: "physics-olympiad",
    number: "05",
    title: "Physics Olympiad",
    tag: "Competition",
    date: "TBA", // TODO
    venue: "TBA", // TODO
    format: "Competition",
    summary:
      "Problem solving under pressure. Test your physics against the best students on campus.",
    description: ["TODO: Describe the Physics Olympiad."],
    registerUrl: "",
    photos: [],
  },
  {
    slug: "observatory-trip",
    number: "06",
    title: "Observatory Trip",
    tag: "Field trip",
    date: "TBA", // TODO
    venue: "TBA", // TODO
    format: "Field trip",
    summary:
      "A trip out of the city lights to see real research telescopes and a sky full of stars.",
    description: ["TODO: Describe the Observatory Trip."],
    registerUrl: "",
    photos: [],
  },
];

export function getEvent(slug: string) {
  return events.find((e) => e.slug === slug);
}
