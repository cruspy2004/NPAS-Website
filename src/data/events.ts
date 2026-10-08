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
  /** Registration buttons (e.g. separate Google Forms). Empty shows "registration opens soon". */
  register: { label: string; href: string }[];
  /** Optional list of what happens at the event. */
  highlights?: { name: string; note?: string }[];
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
    register: [], // TODO: add registration form links
    photos: [],
  },
  {
    slug: "space-week",
    number: "02",
    title: "Space Week",
    tag: "Flagship",
    date: "TBA", // TODO
    venue: "NUST H-12, Islamabad",
    format: "Three days: Astronomy Night, Apollo's Eye, Movie Night, a guest lecture and research modules",
    summary:
      "Embark on a three-day voyage across the cosmos with NPAS Space Week. For the curious, the dreamers, and everyone who has ever looked up and wondered.",
    description: [
      "NPAS Space Week is a three-day celebration of space and astronomy, featuring a variety of engaging modules and activities for everyone curious about the universe. The event includes our flagship Astronomy Night, the much-anticipated Apollo's Eye, an exciting Movie Night, an insightful guest lecture, and several interactive research and learning modules.",
      "Join us for three days of exploration, discovery, and a closer look at the wonders of the cosmos.",
    ],
    highlights: [
      { name: "Astronomy Night", note: "Flagship" },
      { name: "Apollo's Eye" },
      { name: "Movie Night" },
      { name: "Guest Lecture" },
      { name: "Research and Learning Modules" },
    ],
    register: [
      { label: "Register as a NUSTian", href: "https://forms.gle/ALriqS3rzb6ymVav5" },
      { label: "Register as a non-NUSTian", href: "https://forms.gle/KVMB1z1PmgKYyFzY6" },
    ],
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
    register: [], // TODO: add registration form links
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
    register: [], // TODO: add registration form links
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
    register: [], // TODO: add registration form links
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
    register: [], // TODO: add registration form links
    photos: [],
  },
];

export function getEvent(slug: string) {
  return events.find((e) => e.slug === slug);
}
