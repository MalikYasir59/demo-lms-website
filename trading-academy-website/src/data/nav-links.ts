import { NavLink } from "@/types";

export const MAIN_NAV_LINKS: NavLink[] = [
  { label: "Home", href: "/" },
  { label: "Courses", href: "/courses/price-action-mastery" },
  { label: "Client & Testimonials", href: "/testimonials" },
  { label: "About Us", href: "/about-us" },
  { label: "Contact", href: "/contact" },
];

export const FOOTER_COMPANY_LINKS: NavLink[] = [
  { label: "About Us", href: "/about-us" },
  { label: "Client & Testimonials", href: "/testimonials" },
  { label: "Careers", href: "/contact?subject=careers" },
  { label: "Press & Media", href: "/contact?subject=media" },
];

export const FOOTER_TRADING_LINKS: NavLink[] = [
  { label: "Masterclass Courses", href: "/courses/price-action-mastery" },
  { label: "Trading Desk", href: "/trading-desk" },
  { label: "Institutional Feed", href: "/contact?subject=feed" },
  { label: "Risk Disclosure", href: "/terms-conditions#risk" },
];

export const ANNOUNCEMENT_INFO = {
  statusText: "Live London/NY Desk Active",
  hours: "08:00 - 22:00 EST",
  phone: "+1 (800) 555-TRICK",
  phoneTel: "tel:+18005558742",
  feedStatus: "Connected",
  terminalPortalHref: "/contact?subject=terminal",
  riskDisclosureHref: "/terms-conditions#risk",
};

export const DESK_CONTACT_INFO = {
  address: "12 Financial District, Level 34, Canary Wharf, London",
  email: "desk@tradingtricks.institute",
  phone: "+1 (800) 555-TRICK",
  hours: "08:00 - 22:00 EST (Monday - Friday)",
  discordHref: "https://discord.gg/tradingtricks",
  whatsappHref: "https://wa.me/18005558742",
};

