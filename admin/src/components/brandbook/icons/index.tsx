import { BrandbookIcon, type BrandbookIconProps } from "./BrandbookIcon";

export { BrandbookIcon, type BrandbookIconProps, type BrandbookIconComponent } from "./BrandbookIcon";

/* ── Foundation & structure ───────────────────────────────────── */

export function ColumnsIcon(props: BrandbookIconProps) {
  return (
    <BrandbookIcon {...props}>
      <rect x="3" y="4" width="18" height="2.5" rx="0.5" />
      <line x1="6.5" y1="6.5" x2="6.5" y2="19.5" />
      <line x1="12" y1="6.5" x2="12" y2="19.5" />
      <line x1="17.5" y1="6.5" x2="17.5" y2="19.5" />
      <rect x="3" y="19.5" width="18" height="2.5" rx="0.5" />
    </BrandbookIcon>
  );
}

export function PillarIcon(props: BrandbookIconProps) {
  return <ColumnsIcon {...props} />;
}

export function HeritageIcon(props: BrandbookIconProps) {
  return (
    <BrandbookIcon {...props}>
      <path d="M4 20h16" />
      <path d="M6 20V9.5L12 6l6 3.5V20" />
      <path d="M9 20v-5h6v5" />
      <path d="M6 9.5h12" />
    </BrandbookIcon>
  );
}

export function HomeIcon(props: BrandbookIconProps) {
  return (
    <BrandbookIcon {...props}>
      <rect x="5" y="10" width="14" height="11" />
      <path d="M3.5 10.5 12 5l8.5 5.5" />
      <rect x="10" y="15" width="4" height="6" />
    </BrandbookIcon>
  );
}

/* ── Visual & creative ────────────────────────────────────────── */

export function PaletteIcon(props: BrandbookIconProps) {
  return (
    <BrandbookIcon {...props}>
      <path d="M12 3a9 9 0 1 0 8.2 12.6c0-.8-.7-1.4-1.5-1.4H16a2 2 0 0 1-2-2v-.4a2 2 0 0 0-2-2h-.4a2 2 0 0 1-2-2V9.2A2 2 0 0 0 9.2 7H9a2 2 0 0 1-2-2 2 2 0 0 0-.8-1.6A9 9 0 0 0 12 3Z" />
      <circle cx="8" cy="9" r="0.75" fill="currentColor" stroke="none" />
      <circle cx="12" cy="7" r="0.75" fill="currentColor" stroke="none" />
      <circle cx="16" cy="10" r="0.75" fill="currentColor" stroke="none" />
    </BrandbookIcon>
  );
}

export function ArtIcon(props: BrandbookIconProps) {
  return (
    <BrandbookIcon {...props}>
      <rect x="4" y="4" width="16" height="16" rx="1" />
      <path d="M8 16l3-4 3 2 4-6" />
      <circle cx="9" cy="9" r="1.25" />
    </BrandbookIcon>
  );
}

export function BrushIcon(props: BrandbookIconProps) {
  return (
    <BrandbookIcon {...props}>
      <path d="M16.5 3.5 20.5 7.5 10 18H6v-4z" />
      <path d="M6 18 3 21" />
    </BrandbookIcon>
  );
}

export function SparkleIcon(props: BrandbookIconProps) {
  return (
    <BrandbookIcon {...props}>
      <path d="M12 3v3M12 18v3M3 12h3M18 12h3" />
      <path d="m5.6 5.6 2.1 2.1M16.3 16.3l2.1 2.1M18.4 5.6l-2.1 2.1M7.7 16.3l-2.1 2.1" />
    </BrandbookIcon>
  );
}

/* ── Values & meaning ─────────────────────────────────────────── */

export function HeartIcon(props: BrandbookIconProps) {
  return (
    <BrandbookIcon {...props}>
      <path d="M12 20.5s-6.5-4-6.5-9.5A3.5 3.5 0 0 1 12 9a3.5 3.5 0 0 1 6.5 2 6.5 6.5 0 0 1-6.5 9.5Z" />
    </BrandbookIcon>
  );
}

export function ShieldIcon(props: BrandbookIconProps) {
  return (
    <BrandbookIcon {...props}>
      <path d="M12 3 5 6v5.5c0 4.2 3 7.8 7 9.5 4-1.7 7-5.3 7-9.5V6z" />
    </BrandbookIcon>
  );
}

export function QualityIcon(props: BrandbookIconProps) {
  return (
    <BrandbookIcon {...props}>
      <path d="m12 3 2.2 4.5 5 .7-3.6 3.5.9 5L12 14.8 7.5 16.7l.9-5L4.8 8.2l5-.7z" />
    </BrandbookIcon>
  );
}

export function DiamondIcon(props: BrandbookIconProps) {
  return (
    <BrandbookIcon {...props}>
      <path d="M12 3 20 12 12 21 4 12z" />
    </BrandbookIcon>
  );
}

export function CompassIcon(props: BrandbookIconProps) {
  return (
    <BrandbookIcon {...props}>
      <circle cx="12" cy="12" r="9" />
      <polygon points="14.5 9.5 12 12 14.5 14.5 9.5 14.5 12 12 9.5 9.5" />
    </BrandbookIcon>
  );
}

export function LivingIcon(props: BrandbookIconProps) {
  return (
    <BrandbookIcon {...props}>
      <circle cx="12" cy="12" r="9" />
      <path d="M12 7v5l3.5 2" />
      <circle cx="12" cy="12" r="1.25" fill="currentColor" stroke="none" />
    </BrandbookIcon>
  );
}

export function QuoteIcon(props: BrandbookIconProps) {
  return (
    <BrandbookIcon {...props}>
      <path d="M5 18c2.5-2 4-4.5 4-8H5V6h5c0 4-1.5 7-5 12zM15 18c2.5-2 4-4.5 4-8h-4V6h5c0 4-1.5 7-5 12z" />
    </BrandbookIcon>
  );
}

/* ── People & audience ──────────────────────────────────────── */

export function UserIcon(props: BrandbookIconProps) {
  return (
    <BrandbookIcon {...props}>
      <circle cx="12" cy="8" r="3.5" />
      <path d="M5 20v-1a5 5 0 0 1 5-5h4a5 5 0 0 1 5 5v1" />
    </BrandbookIcon>
  );
}

export function UsersIcon(props: BrandbookIconProps) {
  return (
    <BrandbookIcon {...props}>
      <circle cx="9" cy="8" r="3" />
      <path d="M3 20v-1a4 4 0 0 1 4-4h4" />
      <path d="M16 4.5a3 3 0 0 1 0 5.5" />
      <path d="M19 20v-1a4 4 0 0 0-3-3.87" />
    </BrandbookIcon>
  );
}

export function TargetIcon(props: BrandbookIconProps) {
  return (
    <BrandbookIcon {...props}>
      <circle cx="12" cy="12" r="9" />
      <circle cx="12" cy="12" r="5.5" />
      <circle cx="12" cy="12" r="2" />
    </BrandbookIcon>
  );
}

/* ── Product & material ───────────────────────────────────────── */

export function EyeIcon(props: BrandbookIconProps) {
  return (
    <BrandbookIcon {...props}>
      <path d="M2.5 12s4-6.5 9.5-6.5S21 12 21 12s-4 6.5-9.5 6.5S2.5 12 2.5 12Z" />
      <circle cx="12" cy="12" r="2.5" />
    </BrandbookIcon>
  );
}

export function InfinityIcon(props: BrandbookIconProps) {
  return (
    <BrandbookIcon {...props}>
      <path d="M7 12c0-2.8 1.8-5 4-5s4 2.2 4 5-1.8 5-4 5H7c-2.2 0-4-2.2-4-5s1.8-5 4-5h4c2.2 0 4 2.2 4 5" />
    </BrandbookIcon>
  );
}

export function TreeIcon(props: BrandbookIconProps) {
  return (
    <BrandbookIcon {...props}>
      <path d="M12 21V11" />
      <path d="M8 11h8" />
      <path d="M9 11 12 6l3 5" />
      <path d="M10 15h4" />
      <path d="M10.5 15 12 12l1.5 3" />
    </BrandbookIcon>
  );
}

export function StarIcon(props: BrandbookIconProps) {
  return (
    <BrandbookIcon {...props}>
      <path d="m12 3 2 4.5 5 .8-3.6 3.4.9 4.9L12 17.5 7.7 16.6l.9-4.9L5 8.3l5-.8z" />
    </BrandbookIcon>
  );
}

export function SquareIcon(props: BrandbookIconProps) {
  return (
    <BrandbookIcon {...props}>
      <rect x="5" y="5" width="14" height="14" rx="1" />
    </BrandbookIcon>
  );
}

export function SettingsIcon(props: BrandbookIconProps) {
  return (
    <BrandbookIcon {...props}>
      <circle cx="12" cy="12" r="2.75" />
      <path d="M12 3v2M12 19v2M3 12h2M19 12h2M5.6 5.6l1.4 1.4M17 17l1.4 1.4M18.4 5.6 17 7M7 17l-1.4 1.4" />
    </BrandbookIcon>
  );
}

/* ── Experience & nature ────────────────────────────────────── */

export function LeafIcon(props: BrandbookIconProps) {
  return (
    <BrandbookIcon {...props}>
      <path d="M11.5 20.5a6.5 6.5 0 0 1-1-12.2C15 6.5 17 5 19 4c.5 1.5 1.5 4 1.5 7a8.5 8.5 0 0 1-9 9.5Z" />
      <path d="M3 21c0-2.5 1.5-4.5 4-5.5" />
    </BrandbookIcon>
  );
}

export function HeartHandIcon(props: BrandbookIconProps) {
  return (
    <BrandbookIcon {...props}>
      <path d="M12 20.5s-6-3.8-6-9A3.5 3.5 0 0 1 12 9a3.5 3.5 0 0 1 6 2.5c0 5.2-6 9-6 9Z" />
      <path d="M8 18.5 5.5 21" />
    </BrandbookIcon>
  );
}

/* ── Communication ────────────────────────────────────────────── */

export function MessageIcon(props: BrandbookIconProps) {
  return (
    <BrandbookIcon {...props}>
      <path d="M5 5h14a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H9l-4 3V7a2 2 0 0 1 2-2Z" />
    </BrandbookIcon>
  );
}

/* ── UI actions ───────────────────────────────────────────────── */

export function CheckIcon(props: BrandbookIconProps) {
  return (
    <BrandbookIcon {...props}>
      <path d="m5 12.5 4 4L19 7.5" />
    </BrandbookIcon>
  );
}

export function CheckCircleIcon(props: BrandbookIconProps) {
  return (
    <BrandbookIcon {...props}>
      <circle cx="12" cy="12" r="9" />
      <path d="m8 12.5 2.5 2.5L16 9.5" />
    </BrandbookIcon>
  );
}

export function XIcon(props: BrandbookIconProps) {
  return (
    <BrandbookIcon {...props}>
      <path d="M7 7l10 10M17 7 7 17" />
    </BrandbookIcon>
  );
}

export function XCircleIcon(props: BrandbookIconProps) {
  return (
    <BrandbookIcon {...props}>
      <circle cx="12" cy="12" r="9" />
      <path d="M9 9l6 6M15 9l-6 6" />
    </BrandbookIcon>
  );
}

export function ChevronDownIcon(props: BrandbookIconProps) {
  return (
    <BrandbookIcon {...props}>
      <path d="m6 9 6 6 6-6" />
    </BrandbookIcon>
  );
}

export function ChevronLeftIcon(props: BrandbookIconProps) {
  return (
    <BrandbookIcon {...props}>
      <path d="m15 18-6-6 6-6" />
    </BrandbookIcon>
  );
}

export function DownloadIcon(props: BrandbookIconProps) {
  return (
    <BrandbookIcon {...props}>
      <path d="M12 4v10M8.5 10.5 12 14l3.5-3.5" />
      <path d="M5 19h14" />
    </BrandbookIcon>
  );
}

export function CopyIcon(props: BrandbookIconProps) {
  return (
    <BrandbookIcon {...props}>
      <rect x="9" y="9" width="11" height="11" rx="1.5" />
      <path d="M6 15H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v1" />
    </BrandbookIcon>
  );
}

export function ExpandIcon(props: BrandbookIconProps) {
  return (
    <BrandbookIcon {...props}>
      <path d="M9 4H4v5M20 4h-5v5M4 15v5h5M15 20h5v-5" />
    </BrandbookIcon>
  );
}

export function CloseIcon(props: BrandbookIconProps) {
  return <XIcon {...props} />;
}

export function AlertCircleIcon(props: BrandbookIconProps) {
  return (
    <BrandbookIcon {...props}>
      <circle cx="12" cy="12" r="9" />
      <path d="M12 8.5v4.5" />
      <circle cx="12" cy="16.25" r="0.75" fill="currentColor" stroke="none" />
    </BrandbookIcon>
  );
}

/* ── Chat panel ───────────────────────────────────────────────── */

export function ToolsIcon(props: BrandbookIconProps) {
  return (
    <BrandbookIcon {...props}>
      <line x1="4" y1="7" x2="20" y2="7" />
      <line x1="4" y1="12" x2="14" y2="12" />
      <line x1="4" y1="17" x2="10" y2="17" />
      <circle cx="17" cy="7" r="2" />
      <circle cx="11" cy="17" r="2" />
    </BrandbookIcon>
  );
}

export function AttachIcon(props: BrandbookIconProps) {
  return (
    <BrandbookIcon {...props}>
      <path d="M16.5 6.5a4 4 0 0 0-5.7 5.7l-5.8 5.8a2.5 2.5 0 0 0 3.5 3.5l5.8-5.8a4 4 0 0 0-5.7-5.7L4.5 14.5" />
    </BrandbookIcon>
  );
}

export function SendIcon(props: BrandbookIconProps) {
  return (
    <BrandbookIcon {...props}>
      <path d="M5 12h12M13 7l5 5-5 5" />
    </BrandbookIcon>
  );
}

export function HistoryIcon(props: BrandbookIconProps) {
  return (
    <BrandbookIcon {...props}>
      <circle cx="12" cy="12" r="9" />
      <path d="M12 7v5l3 2" />
    </BrandbookIcon>
  );
}

export function PlusIcon(props: BrandbookIconProps) {
  return (
    <BrandbookIcon {...props}>
      <path d="M12 5v14M5 12h14" />
    </BrandbookIcon>
  );
}

/* ── Aliases for semantic naming in sections ──────────────────── */

export const IconColumns = ColumnsIcon;
export const IconPalette = PaletteIcon;
export const IconHome = HomeIcon;
export const IconCheck = CheckIcon;
export const IconChevron = ChevronDownIcon;
export const IconHeart = HeartIcon;
export const IconCompass = CompassIcon;
export const IconShield = ShieldIcon;
export const IconUsers = UsersIcon;
export const IconDiamond = DiamondIcon;
export const IconHeritage = HeritageIcon;
export const IconArt = ArtIcon;
export const IconQuality = QualityIcon;
export const IconLiving = LivingIcon;
export const IconCog = SettingsIcon;
export const IconPillar = PillarIcon;
export const IconQuote = QuoteIcon;
export const IconSparkle = SparkleIcon;
export const IconBrush = BrushIcon;
export const IconUser = UserIcon;
export const IconTarget = TargetIcon;
export const IconAlertCircle = AlertCircleIcon;
