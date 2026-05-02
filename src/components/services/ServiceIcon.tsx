import { BarChart3, CloudCog, Code2, Cpu, Globe, Link2, Palette, Smartphone, Users } from "lucide-react";
import type { ServiceEntry } from "@/lib/content/services";

type Props = {
  icon: ServiceEntry["icon"];
  className?: string;
};

const ICONS = {
  code: Code2,
  smartphone: Smartphone,
  globe: Globe,
  link: Link2,
  cloud: CloudCog,
  palette: Palette,
  chart: BarChart3,
  cpu: Cpu,
  users: Users,
} satisfies Record<ServiceEntry["icon"], typeof Code2>;

export default function ServiceIcon({ icon, className = "h-6 w-6" }: Props) {
  const Icon = ICONS[icon];
  return <Icon className={className} />;
}
