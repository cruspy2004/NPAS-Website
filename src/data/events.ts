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
    slug: "orientation",
    number: "01",
    title: "Orientation",
    tag: "Welcome",
    date: "TBA", // TODO
    venue: "TBA", // TODO
    format: "Introductory session", // TODO: confirm
    summary:
      "Meet NPAS: who we are, what is planned this year, and how to get involved.", // TODO: confirm
    description: ["TODO: Describe Orientation. What happens, who it is for, and why someone should not miss it."],
    registerUrl: "", // TODO: paste the registration form link
    photos: [],
  },
  {
    slug: "space-week",
    number: "02",
    title: "Space Week",
    tag: "Flagship",
    date: "TBA", // TODO
    venue: "NUST H-12, Islamabad",
    format: "Talks, exhibitions, competitions, night sky observation", // TODO: confirm
    summary:
      "A week of talks, telescope nights, competitions and exhibitions. The biggest space event on campus.", // TODO: confirm
    description: ["TODO: Describe Space Week. What happens, who it is for, and why someone should not miss it."],
    registerUrl: "", // TODO: paste the registration form link
    photos: [],
    flagship: true,
  },
  {
    slug: "qiskit-fall-fest",
    number: "03",
    title: "Qiskit Fall Fest",
    tag: "Quantum",
    date: "TBA", // TODO
    venue: "TBA", // TODO
    format: "Workshops and challenges", // TODO: confirm
    summary:
      "Our part in IBM's global Qiskit Fall Fest: hands-on quantum computing workshops and challenges.", // TODO: confirm
    description: ["TODO: Describe Qiskit Fall Fest. What happens, who it is for, and why someone should not miss it."],
    registerUrl: "", // TODO: paste the registration form link
    photos: [],
  },
  {
    slug: "feynmans-circles",
    number: "04",
    title: "Feynman's Circles",
    tag: "Discussion",
    date: "TBA", // TODO
    venue: "TBA", // TODO
    format: "Discussion sessions", // TODO: confirm
    summary:
      "Open discussions on physics, asked and answered the way Feynman would have liked: with curiosity.", // TODO: confirm
    description: ["TODO: Describe Feynman's Circles. What happens, who it is for, and why someone should not miss it."],
    registerUrl: "", // TODO: paste the registration form link
    photos: [],
  },
  {
    slug: "astrotrek",
    number: "05",
    title: "AstroTrek",
    tag: "Trip",
    date: "TBA", // TODO
    venue: "TBA", // TODO
    format: "Trip", // TODO: confirm
    summary:
      "A trek away from the city lights for a night under a sky full of stars.", // TODO: confirm
    description: ["TODO: Describe AstroTrek. What happens, who it is for, and why someone should not miss it."],
    registerUrl: "", // TODO: paste the registration form link
    photos: [],
  },
  {
    slug: "farewell",
    number: "06",
    title: "Farewell",
    tag: "Send-off",
    date: "TBA", // TODO
    venue: "TBA", // TODO
    format: "Social", // TODO: confirm
    summary:
      "One last night together to send off our graduating members.", // TODO: confirm
    description: ["TODO: Describe Farewell. What happens, who it is for, and why someone should not miss it."],
    registerUrl: "", // TODO: paste the registration form link
    photos: [],
  },
];

export function getEvent(slug: string) {
  return events.find((e) => e.slug === slug);
}
