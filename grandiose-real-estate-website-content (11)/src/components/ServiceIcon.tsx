import {
  Building2,
  Compass,
  Construction,
  FileCheck,
  Hammer,
  Handshake,
  MapPin,
  Megaphone,
  ShieldCheck,
  ShoppingBag,
  Store,
  TrendingUp,
  Users,
  Wrench,
  type LucideIcon,
} from "lucide-react";

/**
 * Icon registry for service cards.
 * Admins pick a key from this list in the CMS, so a stored value always
 * resolves to a real icon without any dynamic import guesswork.
 */
export const SERVICE_ICONS: Record<string, LucideIcon> = {
  ShoppingBag,
  Store,
  Megaphone,
  TrendingUp,
  FileCheck,
  Compass,
  Building2,
  ShieldCheck,
  Handshake,
  Users,
  Construction,
  Hammer,
  MapPin,
  Wrench,
};

export const SERVICE_ICON_KEYS = Object.keys(SERVICE_ICONS);

export const SERVICE_ICON_LABELS: Record<string, string> = {
  ShoppingBag: "Sales bag",
  Store: "Store",
  Megaphone: "Megaphone",
  TrendingUp: "Growth trend",
  FileCheck: "Verified document",
  Compass: "Compass / surveying",
  Building2: "Commercial building",
  ShieldCheck: "Shield check",
  Handshake: "Handshake / agency",
  Users: "People / intermediary",
  Construction: "Construction",
  Hammer: "Hammer",
  MapPin: "Map pin",
  Wrench: "Tools",
};

export function resolveServiceIcon(icon?: string | null): LucideIcon {
  if (icon && SERVICE_ICONS[icon]) return SERVICE_ICONS[icon];
  return ShoppingBag;
}

export default function ServiceIcon({
  icon,
  className = "h-7 w-7",
}: {
  icon?: string | null;
  className?: string;
}) {
  const Icon = resolveServiceIcon(icon);
  return <Icon className={className} aria-hidden strokeWidth={1.6} />;
}
