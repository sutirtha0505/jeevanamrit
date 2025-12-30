export interface NavLink {
  id: number;
  label: string;
  type: string;
  href: string;
}

export interface HerbItem {
  image: string;
  title: string;
  subtitle: string;
  handle: string;
  borderColor: string;
  gradient: string;
  url: string;
}

export const navLinks: NavLink[] = [
  {
    id: 1,
    label: "Home",
    type: "home",
    href: "/",
  },
  {
    id: 2,
    label: "Capture",
    type: "capture",
    href: "/capture",
  },
  {
    id: 3,
    label: "Plant Heal",
    type: "plantHeal",
    href: "/plantHeal",
  },
  {
      id: 4,
      label: "Maps",
      type: "maps",
      href: "/maps",
    },
    {
      id: 5,
      label: "About Us",
      type: "about",
      href: "/about",
    },
];

export const herbItems: HerbItem[] = [
  {
    image: "https://plus.unsplash.com/premium_photo-1673728254015-9a437bdb44aa?q=80&w=765&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    title: "Lavender",
    subtitle: "Soothing and aromatic herb",
    handle: "@lavender",
    borderColor: "#3B82F6",
    gradient: "linear-gradient(145deg, #3B82F6, #000)",
    url: "https://linkedin.com/in/tirtharaj-karmakar",
  },
  {
    image: "https://images.unsplash.com/photo-1586161665517-0325578c2784?q=80&w=687&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    title: "Rosemary",
    subtitle: "Fragrant and medicinal herb",
    handle: "@rosemary",
    borderColor: "#10B981",
    gradient: "linear-gradient(180deg, #10B981, #000)",
    url: "https://linkedin.com/in/ranju-mallik",
  },
  {
    image: "https://images.unsplash.com/photo-1687246493079-1361abc6d875?q=80&w=687&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    title: "Chamomile",
    subtitle: "Calming and healing herb",
    handle: "@chamomile",
    borderColor: "#F59E0B",
    gradient: "linear-gradient(225deg, #F59E0B, #000)",
    url: "https://x.com/Sutirtha_05",
  },
  {
    image: "https://plus.unsplash.com/premium_photo-1673264303561-de2ab31df03c?q=80&w=687&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    title: "Mint",
    subtitle: "Refreshing and versatile herb",
    handle: "@mint",
    borderColor: "#EF4444",
    gradient: "linear-gradient(135deg, #EF4444, #000)",
    url: "https://www.instagram.com/192.168.63.1/",
  },
  {
    image: "https://images.unsplash.com/photo-1558070510-504a0db43997?q=80&w=687&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    title: "Basil",
    subtitle: "Aromatic and flavorful herb",
    handle: "@basil",
    borderColor: "#8B5CF6",
    gradient: "linear-gradient(160deg, #8B5CF6, #000)",
    url: "https://github.com/sutirtha0505",
  },
  {
    image: "https://plus.unsplash.com/premium_photo-1675802754634-3e0967bd3fab?q=80&w=686&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    title: "Thyme",
    subtitle: "Earthy and medicinal herb",
    handle: "@thyme",
    borderColor: "#F43F5E",
    gradient: "linear-gradient(200deg, #F43F5E, #000)",
    url: "https://github.com/Captain-Per0xide",
  }
];

export const timelineData: TimelineData[] = [
  {
    step: "Step 1",
    events: [
      "Conceptualized the idea of Jeevanamrit",
      "Conducted initial research on Ayurvedic herbs",
    ],
  },
  {
    step: "Step 2",
    events: [
      "Developed the first prototype of the app",
      "Collaborated with Ayurvedic experts for content validation",
    ],
  },
  {
    step: "Step 3",
    events: [
      "Launched beta version to a select group of users",
      "Gathered user feedback and made improvements",
    ],
  },
  {
    step: "Step 4",
    events: [
      "Officially launched Jeevanamrit to the public",
      "Began partnerships with herbal farms and Ayurvedic practitioners",
    ],
  },
];

export interface TimelineData {
  step?: string;
  events: string[];
}
