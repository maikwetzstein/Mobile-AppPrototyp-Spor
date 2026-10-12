import { useCallback, useEffect, useRef, useState, type ReactNode } from "react"
import {
  createBrowserRouter,
  RouterProvider,
  useLocation,
  useNavigate,
} from "react-router"
import {
  ArrowLeft,
  ArrowRight,
  Bookmark,
  Car,
  Check,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  ChevronUp,
  Egg,
  Flower2,
  Image as ImageIcon,
  LocateFixed,
  MapPin,
  Navigation,
  Search,
  Share2,
  ShoppingBasket,
  Signal,
  Sprout,
  Star,
  Store,
  Tractor,
  Wifi,
  X,
  BatteryFull,
  Milk,
  Apple,
  Map as MapIcon,
  Clock,
  CircleUser,
  type LucideIcon,
} from "lucide-react"

type Provider = {
  id: string
  name: string
  type: string
  products: string[]
  distance: string
  km: number
  hours: string
  confirmed: string
  icon: LucideIcon
  point: [number, number]
  stale?: boolean
}
type Outlet = {
  id: string
  provider: string
  name: string
  type: string
  distance: string
  hours: string
  address: string
  confirmations: number
  confirmed: string
  products: string[]
  point: [number, number]
}

const mock: {
  providers: Provider[]
  outlets: Outlet[]
} = {
  providers: [
    {
      id: "meyer",
      name: "Hof Meyer zu Westerhausen",
      type: "Hofladen",
      products: ["Eier", "Kartoffeln", "Milch", "Honig"],
      distance: "4,2 km",
      km: 4.2,
      hours: "Geöffnet bis 18 Uhr",
      confirmed: "12.09.2026",
      icon: Tractor,
      point: [90, 112],
    },
    {
      id: "brinkmann",
      name: "Gärtnerei Brinkmann",
      type: "Hofladen",
      products: ["Gemüse", "Kräuter", "Salat"],
      distance: "6,8 km",
      km: 6.8,
      hours: "Geöffnet bis 17 Uhr",
      confirmed: "24.09.2026",
      icon: Sprout,
      point: [285, 100],
    },
    {
      id: "rulle",
      name: "Geflügelhof Rulle",
      type: "Hofladen",
      products: ["Eier", "Geflügel"],
      distance: "7,6 km",
      km: 7.6,
      hours: "Geöffnet bis 18 Uhr",
      confirmed: "26.09.2026",
      icon: Egg,
      point: [315, 236],
    },
    {
      id: "duetetal",
      name: "Imkerei Dütetal",
      type: "Direktvermarkter",
      products: ["Honig", "Wachs"],
      distance: "9,1 km",
      km: 9.1,
      hours: "Geschlossen · öffnet Sa 9 Uhr",
      confirmed: "02.07.2026",
      icon: Flower2,
      point: [75, 275],
      stale: true,
    },
    {
      id: "lingen",
      name: "Obsthof Lingen-Kamp",
      type: "Hofladen",
      products: ["Äpfel", "Birnen", "Saft"],
      distance: "11,4 km",
      km: 11.4,
      hours: "Geöffnet bis 18:30 Uhr",
      confirmed: "18.09.2026",
      icon: Apple,
      point: [202, 340],
    },
    {
      id: "nortrup",
      name: "Käserei Nortrup",
      type: "Direktvermarkter",
      products: ["Käse", "Joghurt"],
      distance: "14,2 km",
      km: 14.2,
      hours: "Geöffnet bis 16 Uhr",
      confirmed: "20.09.2026",
      icon: Milk,
      point: [195, 76],
    },
  ],
  outlets: [
    {
      id: "rewe",
      provider: "meyer",
      name: "REWE Nahne",
      type: "Supermarkt",
      distance: "1,2 km",
      hours: "Mo–Sa 7–22 Uhr",
      address: "Iburger Straße 212, 49082 Osnabrück",
      confirmations: 4,
      confirmed: "21.09.2026",
      products: ["Eier", "Kartoffeln"],
      point: [250, 70],
    },
    {
      id: "domhof",
      provider: "meyer",
      name: "Wochenmarkt Domhof",
      type: "Wochenmarkt",
      distance: "2,0 km",
      hours: "Do 8–13 Uhr",
      address: "Domhof, 49074 Osnabrück",
      confirmations: 7,
      confirmed: "24.09.2026",
      products: ["Eier", "Kartoffeln", "Honig"],
      point: [308, 182],
    },
    {
      id: "automat",
      provider: "meyer",
      name: "Automat Natruper Straße",
      type: "Automat",
      distance: "3,1 km",
      hours: "24/7",
      address: "Natruper Straße, 49076 Osnabrück",
      confirmations: 2,
      confirmed: "26.09.2026",
      products: ["Eier", "Milch"],
      point: [242, 306],
    },
    {
      id: "edeka",
      provider: "brinkmann",
      name: "EDEKA Schölerberg",
      type: "Supermarkt",
      distance: "1,8 km",
      hours: "Mo–Sa 7–21 Uhr",
      address: "Schölerberg, Osnabrück",
      confirmations: 3,
      confirmed: "24.09.2026",
      products: ["Gemüse", "Kräuter", "Salat"],
      point: [250, 70],
    },
    {
      id: "domhof-brinkmann",
      provider: "brinkmann",
      name: "Wochenmarkt Domhof",
      type: "Wochenmarkt",
      distance: "2,0 km",
      hours: "Do 8–13 Uhr",
      address: "Domhof, 49074 Osnabrück",
      confirmations: 5,
      confirmed: "24.09.2026",
      products: ["Gemüse", "Salat"],
      point: [308, 182],
    },
  ],
}

const iconProps = { size: 20, strokeWidth: 1.5 }
const onboarding = [
  {
    title: "Regionale Anbieter in deiner Nähe.",
    text: "Höfe, Hofläden und Märkte rund um Osnabrück, auf einer Karte.",
  },
  {
    title: "Und wo ihre Produkte sonst noch stehen.",
    text: "Im Supermarkt, auf dem Wochenmarkt, am Automaten. Dort, wo du ohnehin einkaufst.",
  },
  {
    title: "Aktuell statt perfekt.",
    text: "Wir zeigen, wann eine Angabe zuletzt bestätigt wurde — lieber ehrlich ungenau als still veraltet.",
  },
]

function IconButton({
  children,
  label,
  onClick,
  className = "",
  pressed,
}: {
  children: ReactNode
  label: string
  onClick: () => void
  className?: string
  pressed?: boolean
}) {
  return (
    <button
      type="button"
      aria-label={label}
      aria-pressed={pressed}
      onClick={onClick}
      className={`flex size-touch shrink-0 items-center justify-center rounded-chip text-tinte ${className}`}
    >
      {children}
    </button>
  )
}

function Brand({ small = false }: { small?: boolean }) {
  return (
    <div className="flex items-center gap-2" aria-label="spor">
      <span
        className={`${
          small ? "text-h1" : "brand-size"
        } font-medium tracking-brand`}
      >
        spor
      </span>
      <svg width="40" height="18" viewBox="0 0 40 18" aria-hidden="true">
        <path
          d="M2 12 Q13 2 29 9"
          fill="none"
          className="stroke-tinte"
          strokeWidth="2"
          strokeDasharray="1 5"
          strokeLinecap="round"
        />
        <circle cx="33" cy="10" r="5" className="fill-bernstein" />
      </svg>
    </div>
  )
}

function SpurSymbol() {
  return (
    <svg width="24" height="20" viewBox="0 0 24 20" aria-hidden="true">
      <path
        d="M2 14 Q8 4 17 9"
        className="stroke-tinte"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeDasharray="1 4"
        fill="none"
      />
      <circle cx="20" cy="10" r="3" className="fill-bernstein" />
    </svg>
  )
}

function PrimärButton({
  children,
  onClick,
  className = "",
  disabled = false,
}: {
  children: ReactNode
  onClick: () => void
  className?: string
  disabled?: boolean
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className={`flex h-button w-full items-center justify-center gap-2 rounded-button bg-tinte px-4 text-body font-medium text-papier transition-opacity hover:opacity-85 disabled:opacity-40 ${className}`}
    >
      {children}
    </button>
  )
}

function SekundärButton({
  children,
  onClick,
  className = "",
}: {
  children: ReactNode
  onClick: () => void
  className?: string
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`flex min-h-button w-full items-center justify-center gap-2 rounded-button border border-tinte bg-papier px-3 py-2 text-body font-medium text-tinte transition-colors hover:bg-grund ${className}`}
    >
      {children}
    </button>
  )
}

function Chip({
  children,
  active = false,
  onClick,
  dropdown = false,
}: {
  children: ReactNode
  active?: boolean
  onClick?: () => void
  dropdown?: boolean
}) {
  const content = (
    <>
      <span>{children}</span>
      {dropdown && <ChevronDown size={14} strokeWidth={1.5} />}
    </>
  )
  const classes = `flex h-chip shrink-0 items-center justify-center gap-1 rounded-chip border px-3 text-label tracking-label ${
    active
      ? "border-tinte bg-tinte text-papier"
      : "border-rahmen bg-papier text-tinte"
  }`
  return onClick ? (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      className="flex min-h-touch shrink-0 items-center rounded-chip"
    >
      <span className={classes}>{content}</span>
    </button>
  ) : (
    <span className={classes}>{content}</span>
  )
}

function BestätigtBadge({
  date,
  stale = false,
  children,
}: {
  date?: string
  stale?: boolean
  children?: ReactNode
}) {
  return (
    <span className="inline-flex max-w-full items-center gap-1 rounded-chip border border-rahmen bg-grund px-2 py-1 text-label tracking-label text-nebel">
      {!stale && <Check size={12} strokeWidth={1.5} />}
      <span>
        {children ||
          (stale ? "seit 91 Tagen nicht bestätigt" : `bestätigt ${date}`)}
      </span>
    </span>
  )
}

function AnbieterPin({
  icon: Icon = Tractor,
  selected = false,
  small = false,
}: {
  icon?: LucideIcon
  selected?: boolean
  small?: boolean
}) {
  return (
    <span
      className={`flex shrink-0 items-center justify-center rounded-chip border-2 border-papier bg-tinte text-papier ${
        selected
          ? "size-selected-pin ring-4 ring-tinte/20"
          : small
            ? "size-outlet-pin"
            : "size-provider-pin"
      }`}
    >
      <Icon size={small ? 15 : selected ? 23 : 18} strokeWidth={1.5} />
    </span>
  )
}

function VerkaufsortPin({
  type = "Supermarkt",
  selected = false,
}: {
  type?: string
  selected?: boolean
}) {
  const Icon =
    type === "Wochenmarkt"
      ? ShoppingBasket
      : type === "Automat"
        ? Store
        : ShoppingBasket
  return (
    <span
      className={`flex size-outlet-pin shrink-0 items-center justify-center rounded-chip border-2 border-papier bg-bernstein text-tinte ring-1 ring-tinte ${
        selected ? "outline-4 outline-offset-2 outline-tinte/20" : ""
      }`}
    >
      <Icon size={16} strokeWidth={1.5} />
    </span>
  )
}

function StandortPunkt() {
  return (
    <span className="flex size-selected-pin items-center justify-center rounded-chip bg-tinte/8">
      <span className="size-location rounded-chip border-2 border-papier bg-tinte" />
    </span>
  )
}

function ListItem({
  provider,
  onClick,
}: {
  provider: Provider
  onClick: () => void
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="flex min-h-list w-full items-center gap-2 rounded-card border border-rahmen bg-papier p-3 text-left"
    >
      <span className="flex size-touch shrink-0 items-center justify-center rounded-button bg-grund">
        <AnbieterPin small icon={provider.icon} />
      </span>
      <span className="min-w-0 flex-1">
        <span className="block text-body font-medium">{provider.name}</span>
        <span className="mb-1 block text-body-s text-nebel">
          {provider.type} · {provider.distance}
        </span>
        <BestätigtBadge date={provider.confirmed} stale={provider.stale} />
      </span>
      <ChevronRight size={18} strokeWidth={1.5} className="text-nebel" />
    </button>
  )
}

function VerkaufsortZeile({
  outlet,
  onClick,
  compact = false,
  selected = false,
}: {
  outlet: Outlet
  onClick: () => void
  compact?: boolean
  selected?: boolean
}) {
  const provider = mock.providers.find((item) => item.id === outlet.provider)!
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={selected}
      className={`relative flex min-h-list w-full items-center gap-2 overflow-hidden rounded-card border bg-papier p-3 text-left ${
        selected ? "border-tinte" : "border-rahmen"
      }`}
    >
      <span className="absolute inset-y-0 left-0 w-1 bg-bernstein" />
      <span className="flex size-touch shrink-0 items-center justify-center rounded-button bg-grund">
        <VerkaufsortPin type={outlet.type} selected={selected} />
      </span>
      <span className="min-w-0 flex-1">
        <span className="block text-body font-medium">{outlet.name}</span>
        <span className="block text-body-s text-nebel">
          {compact
            ? `${
                outlet.type === "Supermarkt"
                  ? outlet.distance
                  : `${outlet.hours} · ${outlet.distance}`
              }`
            : `Verkaufsort von ${provider.name} · ${
                outlet.type === "Supermarkt" ? "" : `${outlet.hours} · `
              }${outlet.distance}`}
        </span>
        <span className="block text-caption text-nebel">
          {compact && outlet.id === "rewe"
            ? "seit 08/2026 · 4× bestätigt"
            : `${outlet.confirmations}× bestätigt · ${outlet.confirmed}`}
        </span>
      </span>
      <ChevronRight size={18} strokeWidth={1.5} className="text-nebel" />
    </button>
  )
}

function SpurLinie({
  end,
  index,
  active,
  subdued = false,
}: {
  end: [number, number]
  index: number
  active: boolean
  subdued?: boolean
}) {
  const curve = `M70 190 Q${160 + index * 8} ${end[1] - 46} ${end[0]} ${end[1]}`
  return (
    <g>
      <defs>
        <mask id={`spur-mask-${index}`} maskUnits="userSpaceOnUse" x="0" y="0" width="390" height="400">
          <path d={curve} pathLength="1" fill="none" strokeWidth="8" strokeLinecap="round" className={`stroke-papier spur-mask ${index === 1 ? "spur-delay-one" : index === 2 ? "spur-delay-two" : ""}`} />
        </mask>
      </defs>
      <path
        d={curve}
        fill="none"
        mask={`url(#spur-mask-${index})`}
        className={`stroke-bernstein-dunkel ${subdued ? "opacity-40" : "opacity-100"}`}
        strokeWidth={active ? 3.5 : 2.5}
        strokeDasharray="0.1 6"
        strokeLinecap="round"
      />
    </g>
  )
}

function RouteLinie({ point }: { point: [number, number] }) {
  return (
    <path
      d={`M195 208 Q${point[0] + 75} ${point[1] + 75} ${point[0]} ${point[1]}`}
      pathLength="1"
      fill="none"
      className="stroke-tinte route-reveal"
      strokeWidth="4"
      strokeLinecap="round"
    />
  )
}

function MapCanvas({
  mode = "home",
  provider = mock.providers[0],
  providers = mock.providers,
  outlets = [],
  selectedOutlet,
  onProvider,
  onOutlet,
  className = "",
  labels = true,
  illustrationStep = 0,
}: {
  mode?: "home" | "overview" | "route" | "spur" | "detail" | "illustration" | "location"
  provider?: Provider
  providers?: Provider[]
  outlets?: Outlet[]
  selectedOutlet?: string
  onProvider?: (provider: Provider) => void
  onOutlet?: (outlet: Outlet) => void
  className?: string
  labels?: boolean
  illustrationStep?: number
}) {
  const isSpur =
    mode === "spur" || (mode === "illustration" && illustrationStep === 1)
  const hasProviders =
    ["home", "overview", "route"].includes(mode) ||
    (mode === "illustration" && illustrationStep !== 1)
  const shownOutlets = isSpur
    ? outlets.length
      ? outlets
      : mock.outlets.slice(0, 3)
    : mode === "detail"
      ? outlets
      : []
  const pinPosition = (point: [number, number]) => ({
    left: `${(point[0] / 390) * 100}%`,
    top: `${(point[1] / 400) * 100}%`,
  })
  return (
    <div
      className={`relative isolate overflow-hidden bg-kartengrund ${className}`}
      aria-label={
        isSpur
          ? "Karte mit Anbieter und seinen Verkaufsorten"
          : "Karte der Region Osnabrück"
      }
    >
      <svg
        viewBox="0 0 390 400"
        preserveAspectRatio="none"
        className="absolute inset-0 h-full w-full"
        aria-hidden="true"
      >
        <rect width="390" height="400" className="fill-kartengrund" />
        <path d="M0 0H131L123 64 81 92 0 72Z" className="fill-gruen" />
        <path d="M293 277L390 258V400H284L262 351Z" className="fill-gruen" />
        <path
          d="M265 -20C279 54 175 66 191 146S240 221 212 293 239 361 228 420"
          className="stroke-wasser"
          fill="none"
          strokeWidth="22"
        />
        <g
          className="stroke-rahmen"
          strokeWidth="15"
          fill="none"
          strokeLinejoin="round"
        >
          <path d="M-20 145L96 168 228 126 420 151M76 -20L96 168 52 420M330 -20L281 126 304 253 355 420M-20 314L136 255 304 253 420 215M157 -20L147 90 163 249 187 420M-20 61L147 90 281 73 410 94M-10 383L183 332 325 333 410 314" />
        </g>
        <g
          className="stroke-papier"
          strokeWidth="12"
          fill="none"
          strokeLinejoin="round"
        >
          <path d="M-20 145L96 168 228 126 420 151M76 -20L96 168 52 420M330 -20L281 126 304 253 355 420M-20 314L136 255 304 253 420 215M157 -20L147 90 163 249 187 420M-20 61L147 90 281 73 410 94M-10 383L183 332 325 333 410 314" />
        </g>
        {(mode === "overview" || mode === "location") && (
          <circle
            cx="195"
            cy="208"
            r="144"
            className="stroke-rahmen"
            fill="none"
            strokeWidth="2"
            strokeDasharray="5 6"
          />
        )}
        {mode === "route" && <RouteLinie point={provider.point} />}
        {isSpur &&
          shownOutlets.map((outlet, index) => (
            <SpurLinie
              key={outlet.id}
              end={outlet.point}
              index={index}
              active={outlet.id === selectedOutlet}
              subdued={Boolean(selectedOutlet && outlet.id !== selectedOutlet)}
            />
          ))}
        {mode === "detail" && (
          <path
            d="M-20 310Q110 135 240 185"
            fill="none"
            className="stroke-bernstein-dunkel spur-reveal"
            strokeWidth="2.5"
            strokeDasharray="0.1 6"
            strokeLinecap="round"
          />
        )}
      </svg>
      {hasProviders &&
        providers.map((item, index) => (
          <button
            type="button"
            key={item.id}
            aria-label={item.name}
            onClick={() => onProvider?.(item)}
            className={`absolute z-10 flex size-touch -translate-x-1/2 -translate-y-1/2 items-center justify-center ${
              mode === "route" && item.id !== provider.id ? "opacity-35" : ""
            } ${mode === "illustration" && index > 2 ? "hidden" : ""}`}
            style={pinPosition(item.point)}
          >
            <AnbieterPin
              icon={item.icon}
              selected={mode === "route" && item.id === provider.id}
            />
          </button>
        ))}
      {isSpur && (
        <div
          className="absolute z-10 flex -translate-x-1/2 -translate-y-1/2 flex-col items-center"
          style={pinPosition([70, 190])}
        >
          <button
            type="button"
            className="flex size-touch items-center justify-center"
            aria-label={provider.name}
            onClick={() => onProvider?.(provider)}
          >
            <AnbieterPin selected icon={provider.icon} />
          </button>
          {labels && (
            <span className="map-label absolute top-full mt-1 w-max rounded-button border border-rahmen bg-papier px-2 py-1 text-center text-label tracking-label">
              {provider.name}
            </span>
          )}
        </div>
      )}
      {shownOutlets.map((outlet) => (
        <div
          key={outlet.id}
          className={`absolute z-10 flex -translate-x-1/2 -translate-y-1/2 flex-col items-center transition-transform motion-reduce:transition-none ${
            selectedOutlet === outlet.id ? "scale-110" : ""
          }`}
          style={pinPosition(mode === "detail" ? [240, 185] : outlet.point)}
        >
          <button
            type="button"
            aria-label={outlet.name}
            onClick={() => onOutlet?.(outlet)}
            className="flex size-touch items-center justify-center"
          >
            <VerkaufsortPin
              type={outlet.type}
              selected={outlet.id === selectedOutlet}
            />
          </button>
          {labels && mode !== "detail" && (
            <span className="map-label absolute top-full w-max rounded-chip border border-rahmen bg-papier px-2 py-1 text-center text-label tracking-label">
              {outlet.name === "Automat Natruper Straße"
                ? "Automat Natruper Str."
                : outlet.name}
            </span>
          )}
        </div>
      ))}
      {["home", "overview", "route", "location"].includes(mode) && (
        <div
          className="pointer-events-none absolute z-10 -translate-x-1/2 -translate-y-1/2"
          style={pinPosition([195, 208])}
        >
          <StandortPunkt />
        </div>
      )}
    </div>
  )
}

function TabBar({
  active,
  onChange,
}: {
  active: "karte" | "suche" | "favoriten" | "profil"
  onChange: (tab: "karte" | "suche" | "favoriten" | "profil") => void
}) {
  const tabs = [
    { id: "karte", label: "Karte", icon: MapIcon },
    { id: "suche", label: "Suche", icon: Search },
    { id: "favoriten", label: "Favoriten", icon: Bookmark },
    { id: "profil", label: "Profil", icon: CircleUser },
  ] as const
  return (
    <nav
      aria-label="Hauptnavigation"
      className="grid h-tab shrink-0 grid-cols-4 border-t border-rahmen bg-papier"
    >
      {tabs.map(({ id, label, icon: Icon }) => (
        <button
          key={id}
          type="button"
          onClick={() => onChange(id)}
          aria-current={active === id ? "page" : undefined}
          className={`flex min-h-touch flex-col items-center justify-center gap-1 text-label tracking-label ${
            active === id ? "font-medium text-tinte" : "text-nebel"
          }`}
        >
          <Icon {...iconProps} />
          <span>{label}</span>
        </button>
      ))}
    </nav>
  )
}

function Header({
  title,
  onBack,
  children,
}: {
  title?: string
  onBack: () => void
  children?: ReactNode
}) {
  return (
    <header className="flex min-h-search shrink-0 items-center gap-1 border-b border-rahmen bg-papier px-2">
      <IconButton label="Zurück" onClick={onBack}>
        <ChevronLeft {...iconProps} />
      </IconButton>
      {title && (
        <span className="min-w-0 flex-1 text-body font-medium">{title}</span>
      )}
      {children}
    </header>
  )
}

function SearchField({
  value,
  onChange,
  onClick,
  onClear,
  autofocus = false,
}: {
  value: string
  onChange?: (value: string) => void
  onClick?: () => void
  onClear?: () => void
  autofocus?: boolean
}) {
  return (
    <div className="flex h-search items-center gap-2 rounded-button border border-rahmen bg-papier pl-3">
      <Search {...iconProps} />
      {onChange ? (
        <input
          type="search"
          aria-label="Suche nach Produkt oder Anbieter"
          placeholder="Suche nach Produkt oder Anbieter"
          value={value}
          onChange={(event) => onChange(event.target.value)}
          autoFocus={autofocus}
          className="h-full min-w-0 flex-1 appearance-none bg-transparent text-body text-tinte outline-none placeholder:text-nebel [&::-webkit-search-cancel-button]:hidden"
        />
      ) : (
        <button
          type="button"
          onClick={onClick}
          className="h-full min-w-0 flex-1 truncate pr-3 text-left text-body text-nebel"
        >
          Suche nach Produkt oder Anbieter
        </button>
      )}
      {value && (
        <IconButton
          label="Suche löschen"
          onClick={onClear || (() => onChange?.(""))}
        >
          <X size={18} strokeWidth={1.5} />
        </IconButton>
      )}
    </div>
  )
}

function SheetHandle({
  children,
  expanded,
  onClick,
  onExpand,
  onCollapse,
}: {
  children: ReactNode
  expanded: boolean
  onClick: () => void
  onExpand?: () => void
  onCollapse?: () => void
}) {
  const pointer = useRef<number | null>(null)
  const dragged = useRef(false)
  return (
    <button
      type="button"
      onClick={() => {
        if (!dragged.current) onClick()
        dragged.current = false
      }}
      onPointerDown={(event) => {
        pointer.current = event.clientY
        dragged.current = false
        event.currentTarget.setPointerCapture(event.pointerId)
      }}
      onPointerUp={(event) => {
        if (
          pointer.current !== null &&
          Math.abs(event.clientY - pointer.current) > 25
        ) {
          dragged.current = true
          if (event.clientY < pointer.current) onExpand?.()
          else onCollapse?.()
        }
        pointer.current = null
      }}
      className={`flex w-full touch-none flex-col items-center justify-center gap-3 px-4 ${
        expanded ? "h-16" : "h-sheet-handle"
      }`}
      aria-label={expanded ? "Anbieterliste schließen" : "Anbieterliste öffnen"}
    >
      <span className="h-1 w-9 rounded-chip bg-rahmen" />
      <span className="flex w-full items-center justify-between text-body font-medium">
        {children}
        {expanded ? (
          <ChevronDown {...iconProps} />
        ) : (
          <ChevronUp {...iconProps} />
        )}
      </span>
    </button>
  )
}

function ModalSheet({
  title,
  onClose,
  children,
}: {
  title: string
  onClose: () => void
  children: ReactNode
}) {
  const dialogRef = useRef<HTMLDivElement>(null)
  useEffect(() => {
    const previous = document.activeElement as HTMLElement | null
    const element = dialogRef.current
    element?.querySelector<HTMLButtonElement>("button")?.focus()
    const keyHandler = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose()
      if (event.key === "Tab") {
        const focusables = element?.querySelectorAll<HTMLElement>(
          "button, input, textarea, [tabindex='0']",
        )
        if (!focusables?.length) return
        const first = focusables[0]
        const last = focusables[focusables.length - 1]
        if (event.shiftKey && document.activeElement === first) {
          event.preventDefault()
          last.focus()
        } else if (!event.shiftKey && document.activeElement === last) {
          event.preventDefault()
          first.focus()
        }
      }
    }
    document.addEventListener("keydown", keyHandler)
    return () => {
      document.removeEventListener("keydown", keyHandler)
      previous?.focus()
    }
  }, [onClose])
  return (
    <div className="absolute inset-0 z-50 flex items-end bg-tinte/25 animate-reveal">
      <button
        className="absolute inset-0"
        aria-label="Dialog schließen"
        onClick={onClose}
      />
      <div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-label={title}
        className="relative z-10 max-h-full w-full overflow-y-auto rounded-t-sheet bg-papier p-page pb-8 shadow-sheet"
      >
        <div className="mx-auto mb-3 h-1 w-9 rounded-chip bg-rahmen" />
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-h2">{title}</h2>
          <IconButton label="Schließen" onClick={onClose}>
            <X {...iconProps} />
          </IconButton>
        </div>
        {children}
      </div>
    </div>
  )
}

function SporLogo({ animated = false }: { animated?: boolean }) {
  const points = [
    [7, 31],
    [22, 25],
    [38, 20],
    [54, 17],
    [70, 16],
    [85, 18],
    [99, 22],
  ]
  return (
    <div
      className={`flex flex-col items-center gap-5 ${animated ? "spor-logo-animated" : ""}`}
      aria-label="spor"
    >
      <svg width="120" height="44" viewBox="0 0 120 44" aria-hidden="true">
        {points.map(([cx, cy], index) => (
          <circle
            key={index}
            cx={cx}
            cy={cy}
            r="3"
            className={`fill-tinte spor-logo-dot spor-logo-dot-${index + 1}`}
          />
        ))}
        <circle
          cx="111"
          cy="26"
          r="9"
          className="fill-bernstein spor-logo-end"
        />
      </svg>
      <span className="spor-logo-word font-medium tracking-brand text-tinte">
        spor
      </span>
    </div>
  )
}

function ProfilToggle({
  checked,
  label,
  onChange,
}: {
  checked: boolean
  label: string
  onChange: () => void
}) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      aria-label={label}
      onClick={onChange}
      className={`relative h-7 w-12 shrink-0 rounded-chip transition-colors ${
        checked ? "bg-tinte" : "bg-rahmen"
      }`}
    >
      <span
        className={`absolute left-1 top-1 size-5 rounded-chip bg-papier transition-transform ${
          checked ? "translate-x-5" : "translate-x-0"
        }`}
      />
    </button>
  )
}

function Prototype() {
  const navigate = useNavigate()
  const location = useLocation()
  const screen = location.pathname.split("/")[1] || "start"
  const entityId = location.pathname.split("/")[2]
  const depth = useRef(0)
  const contentRef = useRef<HTMLDivElement>(null)
  const swipe = useRef<{
    x: number
    y: number
  } | null>(null)
  const [step, setStep] = useState(0)
  const [manual, setManual] = useState(false)
  const [place, setPlace] = useState("Osnabrück")
  const [query, setQuery] = useState("")
  const [saved, setSaved] = useState<string[]>(["meyer", "brinkmann"])
  const [category, setCategory] = useState("Alle")
  const [salesType, setSalesType] = useState("Alle")
  const [radius, setRadius] = useState(15)
  const [openOnly, setOpenOnly] = useState(false)
  const [modal, setModal] =
    useState<"Kategorie" | "Verkaufsart" | "Umkreis" | "navigation" | "share" | "review" | null>(
      null,
    )
  const [navigationTarget, setNavigationTarget] = useState("")
  const [highlighted, setHighlighted] = useState<string | undefined>()
  const [confirmedOutlets, setConfirmedOutlets] = useState<string[]>([])
  const [favoriteAnswer, setFavoriteAnswer] = useState<string | null>(null)
  const [stars, setStars] = useState(0)
  const [review, setReview] = useState("")
  const [reviewSent, setReviewSent] = useState(false)
  const [copied, setCopied] = useState(false)
  const [notice, setNotice] = useState("")
  const [profileNotifications, setProfileNotifications] = useState([
    true,
    true,
    false,
  ])
  const provider =
    mock.providers.find((item) => item.id === entityId) || mock.providers[0]
  const outlet =
    mock.outlets.find((item) => item.id === entityId) || mock.outlets[0]
  const providerOutlets = mock.outlets.filter(
    (item) => item.provider === provider.id,
  )
  const filteredProviders = mock.providers.filter(
    (item) =>
      (category === "Alle" || item.products.includes(category)) &&
      (salesType === "Alle" || item.type === salesType || mock.outlets.some(outlet => outlet.provider === item.id && outlet.type === salesType)) &&
      item.km <= radius &&
      (!openOnly || !item.stale),
  )
  const go = (path: string) => {
    if (path !== location.pathname) {
      depth.current += 1
      navigate(path)
    }
    setModal(null)
  }
  const back = () => {
    if (screen === "onboarding" && step > 0) {
      setStep(step - 1)
      return
    }
    if (screen === "standort" && manual) {
      setManual(false)
      return
    }
    if (depth.current > 0) {
      depth.current -= 1
      navigate(-1)
    } else go("/karte")
    setModal(null)
  }
  const closeModal = useCallback(() => setModal(null), [])
  const toggleSave = () => {
    setSaved((current) =>
      current.includes(provider.id)
        ? current.filter((id) => id !== provider.id)
        : [...current, provider.id],
    )
  }
  const tabChange = (
    tab: "karte" | "suche" | "favoriten" | "profil",
  ) => {
    if (tab === "suche") {
      setQuery("Eier")
      go("/suche")
    } else go(`/${tab}`)
  }
  const startNavigation = (name: string) => {
    setNavigationTarget(name)
    setModal("navigation")
  }
  const openSearch = () => {
    setQuery("")
    go("/suche")
  }
  useEffect(() => {
    contentRef.current?.scrollTo(0, 0)
    setHighlighted(undefined)
    setNotice("")
  }, [location.pathname])
  useEffect(() => {
    if (!notice) return
    const timeout = window.setTimeout(() => setNotice(""), 3500)
    return () => clearTimeout(timeout)
  }, [notice])
  useEffect(() => {
    if (screen !== "start") return
    const reducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches
    const timeout = window.setTimeout(
      () => go("/onboarding"),
      reducedMotion ? 1100 : 2400,
    )
    return () => window.clearTimeout(timeout)
  }, [screen])
  const hasTabs = [
    "karte",
    "suche",
    "uebersicht",
    "route",
    "favoriten",
    "profil",
  ].includes(screen)
  const activeTab =
    screen === "suche"
      ? "suche"
      : screen === "favoriten"
        ? "favoriten"
        : screen === "profil"
          ? "profil"
        : "karte"
  const searchRows: (Provider | Outlet)[] =
    query.toLocaleLowerCase("de").trim() === "eier"
      ? [...mock.outlets.slice(0, 3), ...mock.providers.slice(0, 3)]
      : [...mock.providers, ...mock.outlets]
          .filter((item) =>
            `${item.name} ${item.type} ${item.products.join(" ")}`
              .toLocaleLowerCase("de")
              .includes(query.toLocaleLowerCase("de").trim()),
          )
          .sort(
            (first, second) =>
              parseFloat(first.distance.replace(",", ".")) -
              parseFloat(second.distance.replace(",", ".")),
          )

  return (
    <div className="flex min-h-dvh items-center justify-center bg-grund p-0 font-sans text-tinte sm:p-section">
      <div
        className="relative flex h-app-height w-app-width max-w-full flex-col overflow-hidden bg-grund sm:rounded-sheet sm:border sm:border-rahmen"
        aria-label="Spor – klickbarer Mobile-Prototyp"
      >
        {screen !== "start" && (
          <div
            className={`flex h-status shrink-0 items-center justify-between px-6 text-label font-medium ${
              ["profil", "anbieter", "spur"].includes(screen)
                ? "bg-kartengrund"
                : "bg-grund"
            }`}
            aria-hidden="true"
          >
            <span>9:41</span>
            <span className="flex items-center gap-1">
              <Signal size={14} strokeWidth={1.5} />
              <Wifi size={14} strokeWidth={1.5} />
              <BatteryFull size={20} strokeWidth={1.5} />
            </span>
          </div>
        )}

        {screen === "start" && (
          <main
            className="relative min-h-0 flex-1 bg-grund"
            aria-label="Startbildschirm"
            onClick={() => go("/onboarding")}
          >
            <div className="absolute left-1/2 top-[45%] -translate-x-1/2 -translate-y-1/2">
              <SporLogo animated />
            </div>
          </main>
        )}

        {screen === "onboarding" && (
          <main
            className="onboarding-enter flex min-h-0 flex-1 flex-col"
            onTouchStart={(event) => {
              swipe.current = {
                x: event.touches[0].clientX,
                y: event.touches[0].clientY,
              }
            }}
            onTouchEnd={(event) => {
              if (!swipe.current) return
              const delta = event.changedTouches[0].clientX - swipe.current.x
              const vertical = event.changedTouches[0].clientY - swipe.current.y
              if (Math.abs(delta) > 45 && Math.abs(delta) > Math.abs(vertical))
                setStep((current) =>
                  Math.max(0, Math.min(2, current + (delta < 0 ? 1 : -1))),
                )
              swipe.current = null
            }}
          >
            <div className="flex h-20 shrink-0 items-center justify-between px-page">
              <Brand />
              {step > 0 && (
                <IconButton
                  label="Vorheriger Schritt"
                  onClick={() => setStep(step - 1)}
                >
                  <ArrowLeft {...iconProps} />
                </IconButton>
              )}
            </div>
            <div className="relative h-illustration shrink-0 overflow-hidden onboard-image">
              <MapCanvas
                key={step}
                mode="illustration"
                illustrationStep={step}
                className="h-full"
                labels={false}
              />
              {step === 0 && (
                <div className="absolute right-6 top-5 flex items-center gap-2 rounded-chip border border-rahmen bg-papier px-3 py-2 text-label tracking-label">
                  <MapPin size={14} strokeWidth={1.5} />
                  Osnabrück & Umgebung
                </div>
              )}
              {step === 2 && (
                <div className="absolute bottom-10 left-6 rounded-card border border-rahmen bg-papier p-4">
                  <span className="mb-2 block text-body font-medium">
                    Hof Meyer zu Westerhausen
                  </span>
                  <BestätigtBadge date="12.09.2026" />
                </div>
              )}
            </div>
            <div className="flex min-h-0 flex-1 flex-col px-page pt-section">
              <div key={step} className="animate-reveal">
                <span className="mb-3 block text-label tracking-label text-nebel">
                  {step === 0
                    ? "DEINE REGION"
                    : step === 1
                      ? "VOM HOF ZU DIR"
                      : "TRANSPARENTE ANGABEN"}
                </span>
                <h1 className="mb-4 max-w-full text-display">
                  {onboarding[step].title}
                </h1>
                <p className="text-body text-nebel">{onboarding[step].text}</p>
              </div>
              <div
                className="mt-auto flex justify-center gap-0 pb-4 pt-4"
                aria-label="Einführungsschritte"
              >
                {onboarding.map((_, index) => (
                  <button
                    key={index}
                    aria-label={`Schritt ${index + 1}`}
                    aria-current={index === step ? "step" : undefined}
                    onClick={() => setStep(index)}
                    className="flex size-touch items-center justify-center"
                  >
                    <span
                      className={`h-2 rounded-chip ${
                        index === step ? "w-6 bg-tinte" : "w-2 bg-rahmen"
                      }`}
                    />
                  </button>
                ))}
              </div>
              <PrimärButton
                onClick={() => (step < 2 ? setStep(step + 1) : go("/standort"))}
              >
                Weiter
                <ArrowRight {...iconProps} />
              </PrimärButton>
              <button
                className="h-button shrink-0 text-body-s text-nebel"
                onClick={() => go("/standort")}
              >
                Überspringen
              </button>
            </div>
          </main>
        )}

        {screen === "standort" && (
          <main className="flex min-h-0 flex-1 flex-col">
            <Header onBack={back}>
              <div className="ml-auto pr-3">
                <Brand small />
              </div>
            </Header>
            <div className="flex flex-1 flex-col p-page">
              <div className="mb-section mt-section">
                <h1 className="mb-3 text-h1">Wo sollen wir suchen?</h1>
                <p className="text-body text-nebel">
                  Mit deinem Standort zeigen wir dir Anbieter im Umkreis. Du
                  kannst stattdessen auch einen Ort eingeben.
                </p>
              </div>
              <MapCanvas
                mode="location"
                className="h-location-map shrink-0 rounded-card"
              />
              {manual && (
                <div className="mt-section">
                  <label
                    htmlFor="place"
                    className="mb-2 block text-body-s font-medium"
                  >
                    Ort oder Postleitzahl
                  </label>
                  <input
                    id="place"
                    value={place}
                    onChange={(event) => setPlace(event.target.value)}
                    autoFocus
                    className="h-search w-full rounded-button border border-rahmen bg-papier px-3 text-body"
                  />
                  <button
                    onClick={() => setPlace("Osnabrück")}
                    className="mt-1 flex min-h-touch w-full items-center gap-2 text-body-s"
                  >
                    <MapPin {...iconProps} />
                    Osnabrück
                    <ChevronRight className="ml-auto" {...iconProps} />
                  </button>
                </div>
              )}
              <div className="mt-auto space-y-3 pt-section">
                {manual ? (
                  <PrimärButton
                    disabled={!place.trim()}
                    onClick={() => go("/karte")}
                  >
                    In {place.trim() || "deinem Ort"} suchen
                  </PrimärButton>
                ) : (
                  <>
                    <PrimärButton
                      onClick={() => {
                        setPlace("Osnabrück")
                        go("/karte")
                      }}
                    >
                      <LocateFixed {...iconProps} />
                      Standort freigeben
                    </PrimärButton>
                    <SekundärButton onClick={() => setManual(true)}>
                      Ort oder PLZ eingeben
                    </SekundärButton>
                  </>
                )}
                <p className="pt-1 text-center text-caption text-nebel">
                  {manual
                    ? "Die Karte zeigt die Pilotregion Osnabrück."
                    : "Dein Standort bleibt auf deinem Gerät."}
                </p>
              </div>
            </div>
          </main>
        )}

        {screen === "karte" && (
          <main className="flex min-h-0 flex-1 flex-col">
            <div className="flex items-center justify-between px-page pb-2 pt-2">
              <Brand small />
              <span className="flex items-center gap-1 text-caption text-nebel">
                <MapPin size={14} strokeWidth={1.5} />
                Osnabrück
              </span>
            </div>
            <div className="px-page pb-3">
              <SearchField value="" onClick={openSearch} />
            </div>
            <div className="scroll-hidden flex shrink-0 gap-2 overflow-x-auto px-page pb-3">
              <Chip
                active={category !== "Alle"}
                dropdown
                onClick={() => setModal("Kategorie")}
              >
                {category === "Alle" ? "Kategorie" : category}
              </Chip>
              <Chip
                active={salesType !== "Alle"}
                dropdown
                onClick={() => setModal("Verkaufsart")}
              >
                {salesType === "Alle" ? "Verkaufsart" : salesType}
              </Chip>
              <Chip
                active={radius !== 15}
                dropdown
                onClick={() => setModal("Umkreis")}
              >
                Umkreis{radius !== 15 ? ` · ${radius} km` : ""}
              </Chip>
              <Chip active={openOnly} onClick={() => setOpenOnly(!openOnly)}>
                Heute offen
              </Chip>
            </div>
            <div className="relative min-h-0 flex-1">
              <MapCanvas
                providers={filteredProviders}
                className="h-full"
                onProvider={() => go("/uebersicht")}
              />
              <div className="absolute bottom-4 right-4">
                <IconButton
                  label="Karte auf deinen Standort zentrieren"
                  onClick={() => {
                    setCategory("Alle")
                    setSalesType("Alle")
                    setRadius(15)
                    setOpenOnly(false)
                    setNotice("Karte auf deinen Standort zentriert")
                  }}
                  className="border border-rahmen bg-papier"
                >
                  <LocateFixed {...iconProps} />
                </IconButton>
              </div>
              {filteredProviders.length === 0 && (
                <div className="absolute inset-x-4 top-4 rounded-card border border-rahmen bg-papier p-4 text-body-s">
                  Keine Anbieter mit diesen Filtern. Passe deine Auswahl an.
                </div>
              )}
            </div>
            <section className="z-20 shrink-0 rounded-t-sheet bg-papier shadow-sheet">
              <SheetHandle
                expanded={false}
                onClick={() => go("/uebersicht")}
                onExpand={() => go("/uebersicht")}
              >
                {filteredProviders.length} Anbieter im Ausschnitt
              </SheetHandle>
            </section>
          </main>
        )}

        {screen === "suche" && (
          <main className="flex min-h-0 flex-1 flex-col">
            <Header title="Suche" onBack={back} />
            <div className="px-page pt-3">
              <SearchField
                value={query}
                onChange={setQuery}
                autofocus
                onClear={() => setQuery("")}
              />
            </div>
            {query.trim() ? (
              <>
                <p className="px-page py-3 text-body-s text-nebel">
                  {query.toLowerCase().trim() === "eier"
                    ? "12"
                    : searchRows.length}{" "}
                  Treffer · sortiert nach Entfernung
                </p>
                <div
                  ref={contentRef}
                  className="scroll-hidden min-h-0 flex-1 space-y-2 overflow-y-auto px-page pb-4"
                >
                  {searchRows.map((item) =>
                    "provider" in item ? (
                      <VerkaufsortZeile
                        key={item.id}
                        outlet={item}
                        onClick={() => go(`/verkaufsort/${item.id}`)}
                      />
                    ) : (
                      <ListItem
                        key={item.id}
                        provider={item}
                        onClick={() => go(`/anbieter/${item.id}`)}
                      />
                    ),
                  )}
                  {searchRows.length === 0 && (
                    <div className="rounded-card border border-rahmen bg-papier p-4">
                      <h2 className="mb-2 text-h2">Keine Treffer</h2>
                      <p className="text-body-s text-nebel">
                        Versuch es mit einem anderen Produkt oder Anbieter.
                      </p>
                      <button
                        onClick={() => setQuery("")}
                        className="mt-3 min-h-touch text-body font-medium underline underline-offset-4"
                      >
                        Suche zurücksetzen
                      </button>
                    </div>
                  )}
                  <p className="py-3 text-caption text-nebel">
                    Die Entfernungen beziehen sich auf deinen Standort.
                  </p>
                </div>
              </>
            ) : (
              <div className="p-page">
                <h2 className="mb-3 mt-3 text-h2">Was suchst du?</h2>
                <div className="flex flex-wrap gap-2">
                  {["Eier", "Gemüse", "Milch", "Honig"].map((product) => (
                    <Chip key={product} onClick={() => setQuery(product)}>
                      {product}
                    </Chip>
                  ))}
                </div>
                <h2 className="mb-2 mt-section text-h2">
                  Anbieter in deiner Nähe
                </h2>
                <div className="space-y-2">
                  {mock.providers.slice(0, 2).map((item) => (
                    <ListItem
                      key={item.id}
                      provider={item}
                      onClick={() => go(`/anbieter/${item.id}`)}
                    />
                  ))}
                </div>
              </div>
            )}
          </main>
        )}

        {screen === "uebersicht" && (
          <main className="flex min-h-0 flex-1 flex-col">
            <div className="flex items-center gap-1 px-2 pt-2">
              <IconButton label="Zurück zur Karte" onClick={back}>
                <ChevronLeft {...iconProps} />
              </IconButton>
              <div className="min-w-0 flex-1 pr-2">
                <SearchField value="" onClick={openSearch} />
              </div>
            </div>
            <p className="px-page py-3 text-body-s">
              Umkreis {radius} km · {filteredProviders.length} Anbieter gefunden
            </p>
            <MapCanvas
              mode="overview"
              providers={filteredProviders}
              className="h-overview-map shrink-0"
              onProvider={(item) => go(`/route/${item.id}`)}
            />
            <section className="z-20 -mt-4 flex min-h-0 flex-1 flex-col rounded-t-sheet bg-papier shadow-sheet">
              <SheetHandle
                expanded
                onClick={() => go("/karte")}
                onExpand={() => {}}
                onCollapse={() => go("/karte")}
              >
                {filteredProviders.length} Anbieter im Umkreis
              </SheetHandle>
              <div
                ref={contentRef}
                className="scroll-hidden min-h-0 flex-1 space-y-2 overflow-y-auto px-page pb-4"
              >
                {filteredProviders[0] && (
                  <ListItem
                    provider={filteredProviders[0]}
                    onClick={() => go(`/route/${filteredProviders[0].id}`)}
                  />
                )}
                <VerkaufsortZeile
                  outlet={mock.outlets[0]}
                  onClick={() => go("/verkaufsort/rewe")}
                />
                {filteredProviders.slice(1).map((item) => (
                  <ListItem
                    key={item.id}
                    provider={item}
                    onClick={() => go(`/route/${item.id}`)}
                  />
                ))}
              </div>
            </section>
          </main>
        )}

        {screen === "route" && (
          <main className="flex min-h-0 flex-1 flex-col">
            <Header title={provider.name} onBack={back} />
            <div
              ref={contentRef}
              className="scroll-hidden min-h-0 flex-1 overflow-y-auto"
            >
              <MapCanvas
                key={provider.id}
                mode="route"
                provider={provider}
                className="h-route-map"
                onProvider={(item) => go(`/route/${item.id}`)}
              />
              <div className="space-y-3 p-page">
                <div className="flex min-h-route-info items-center gap-3 rounded-card border border-rahmen bg-papier px-4">
                  <Car {...iconProps} />
                  <p className="text-body">
                    {provider.distance} · ca.{" "}
                    {provider.id === "meyer"
                      ? "9"
                      : Math.round(provider.km * 2)}{" "}
                    Min mit dem Auto
                  </p>
                </div>
                <button
                  onClick={() => go(`/anbieter/${provider.id}`)}
                  className="flex min-h-provider-preview w-full items-center gap-3 rounded-card border border-rahmen bg-papier p-4 text-left"
                >
                  <div className="flex-1">
                    <p className="text-body font-medium">{provider.name}</p>
                    <p
                      className={`mt-1 text-body-s ${
                        provider.stale ? "text-nebel" : "text-tinte"
                      }`}
                    >
                      {provider.hours}
                    </p>
                  </div>
                  <ChevronRight {...iconProps} />
                </button>
                <div className="space-y-3 pt-3">
                  <PrimärButton onClick={() => go(`/anbieter/${provider.id}`)}>
                    Profil öffnen
                    <ChevronRight {...iconProps} />
                  </PrimärButton>
                  <SekundärButton
                    onClick={() => startNavigation(provider.name)}
                  >
                    <Navigation {...iconProps} />
                    Navigation starten
                  </SekundärButton>
                </div>
                <p className="py-1 text-center text-caption text-nebel">
                  Die Route ist eine beispielhafte Darstellung.
                </p>
              </div>
            </div>
          </main>
        )}

        {screen === "anbieter" && (
          <main className="flex min-h-0 flex-1 flex-col">
            <div
              ref={contentRef}
              className="scroll-hidden min-h-0 flex-1 overflow-y-auto"
            >
              <div className="relative flex h-profile-photo items-center justify-center bg-kartengrund">
                <ImageIcon size={28} strokeWidth={1.5} className="text-nebel" />
                <div className="absolute inset-x-page top-3 flex justify-between">
                  <IconButton
                    label="Zurück"
                    onClick={back}
                    className="bg-papier"
                  >
                    <ArrowLeft {...iconProps} />
                  </IconButton>
                  <IconButton
                    label={
                      saved.includes(provider.id)
                        ? "Aus Favoriten entfernen"
                        : "Anbieter merken"
                    }
                    onClick={toggleSave}
                    pressed={saved.includes(provider.id)}
                    className="bg-papier"
                  >
                    {saved.includes(provider.id) ? (
                      <>
                        <Bookmark {...iconProps} />
                        <Check
                          size={11}
                          strokeWidth={1.5}
                          className="absolute ml-3 mt-3 rounded-chip bg-papier"
                        />
                      </>
                    ) : (
                      <Bookmark {...iconProps} />
                    )}
                  </IconButton>
                </div>
                <span className="absolute bottom-3 right-4 text-caption text-nebel">
                  Noch kein Foto hinterlegt
                </span>
              </div>
              <div className="space-y-4 p-page">
                <div>
                  <h1 className="mb-2 text-h1">{provider.name}</h1>
                  <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
                    <span
                      className={`text-body ${
                        provider.stale ? "text-nebel" : "text-tinte"
                      }`}
                    >
                      {provider.hours}
                    </span>
                    <span className="text-body-s text-nebel">
                      {provider.type} · {provider.distance}
                    </span>
                  </div>
                </div>
                <div className="rounded-card border border-rahmen bg-papier p-4">
                  <div className="mb-2 flex items-center gap-2 text-body">
                    <Star size={18} strokeWidth={1.5} />
                    4,6 · 24 Bewertungen
                  </div>
                  <BestätigtBadge
                    date={provider.confirmed}
                    stale={provider.stale}
                  />
                </div>
                <section className="rounded-card border border-rahmen bg-papier p-4">
                  <h2 className="mb-3 text-h2">Sortiment</h2>
                  <div className="flex flex-wrap gap-2">
                    {provider.products.map((product) => (
                      <Chip key={product}>{product}</Chip>
                    ))}
                  </div>
                  <p className="mt-3 text-caption text-nebel">
                    Kategorien, keine Tagesverfügbarkeit.
                  </p>
                </section>
                <section className="relative overflow-hidden rounded-card border border-rahmen bg-papier p-3">
                  <span className="absolute inset-y-0 left-0 w-1 bg-bernstein" />
                  <h2 className="mb-3 pl-1 pt-1 text-h2">
                    Produkte gibt es auch hier
                  </h2>
                  {providerOutlets.length ? (
                    <>
                      <div className="space-y-2">
                        {providerOutlets.map((item) => (
                          <VerkaufsortZeile
                            key={item.id}
                            compact
                            outlet={item}
                            onClick={() => go(`/verkaufsort/${item.id}`)}
                          />
                        ))}
                      </div>
                      <SekundärButton
                        className="mt-3 text-body-s"
                        onClick={() => go(`/spur/${provider.id}`)}
                      >
                        <SpurSymbol />
                        <span>Alle Verkaufsorte auf der Karte zeigen</span>
                      </SekundärButton>
                    </>
                  ) : (
                    <p className="p-1 text-body-s text-nebel">
                      Bisher sind keine weiteren Verkaufsorte gelistet.
                    </p>
                  )}
                </section>
                <p className="pb-2 text-caption text-nebel">
                  Angaben von Anbietern und Nutzern. Spor stellt dar und bewertet
                  nicht.
                </p>
              </div>
            </div>
            <div className="shrink-0 border-t border-rahmen bg-grund px-page pt-3">
              <PrimärButton onClick={() => go(`/route/${provider.id}`)}>
                <Navigation {...iconProps} />
                Route zum Hof starten
              </PrimärButton>
              <div className="grid grid-cols-3">
                <button
                  className="flex min-h-touch items-center justify-center gap-1 text-body-s text-nebel"
                  onClick={toggleSave}
                >
                  <Bookmark size={16} strokeWidth={1.5} />
                  {saved.includes(provider.id) ? "Gemerkt" : "Merken"}
                </button>
                <button
                  className="flex min-h-touch items-center justify-center gap-1 text-body-s text-nebel"
                  onClick={() => {
                    setCopied(false)
                    setModal("share")
                  }}
                >
                  <Share2 size={16} strokeWidth={1.5} />
                  Teilen
                </button>
                <button
                  className="flex min-h-touch items-center justify-center gap-1 text-body-s text-nebel"
                  onClick={() => {
                    setReviewSent(false)
                    setModal("review")
                  }}
                >
                  <Star size={16} strokeWidth={1.5} />
                  Bewerten
                </button>
              </div>
            </div>
          </main>
        )}

        {screen === "spur" && (
          <main className="flex min-h-0 flex-1 flex-col">
            <header className="z-20 flex shrink-0 items-center gap-2 border-b border-rahmen bg-papier px-2 py-3">
              <IconButton label="Zurück zum Anbieter" onClick={back}>
                <ArrowLeft {...iconProps} />
              </IconButton>
              <div className="min-w-0 pr-3">
                <h1 className="text-h2">{provider.name}</h1>
                <p className="mt-1 text-body-s text-nebel">
                  {providerOutlets.length} Verkaufsorte in deiner Nähe
                </p>
              </div>
            </header>
            <MapCanvas
              key={provider.id}
              mode="spur"
              provider={provider}
              outlets={providerOutlets}
              selectedOutlet={highlighted}
              className="min-h-0 flex-1"
              onProvider={() => go(`/anbieter/${provider.id}`)}
              onOutlet={(item) =>
                highlighted === item.id
                  ? go(`/verkaufsort/${item.id}`)
                  : setHighlighted(item.id)
              }
            />
            <section className="z-20 flex h-80 shrink-0 flex-col rounded-t-sheet bg-papier shadow-sheet">
              <div className="mx-auto mt-3 h-1 w-9 shrink-0 rounded-chip bg-rahmen" />
              <div className="flex items-center justify-between px-page py-3">
                <h2 className="text-h2">Die Spur zu deinen Produkten</h2>
                <SpurSymbol />
              </div>
              <div className="scroll-hidden min-h-0 flex-1 space-y-2 overflow-y-auto px-page pb-4">
                {providerOutlets.map((item) => (
                  <VerkaufsortZeile
                    key={item.id}
                    compact
                    outlet={item}
                    selected={highlighted === item.id}
                    onClick={() =>
                      highlighted === item.id
                        ? go(`/verkaufsort/${item.id}`)
                        : setHighlighted(item.id)
                    }
                  />
                ))}
                <p className="pt-1 text-caption text-nebel">
                  {highlighted
                    ? "Tippe noch einmal auf den Ort, um Details zu sehen."
                    : "Tippe auf einen Ort, um seine Spur zu sehen."}
                </p>
              </div>
            </section>
          </main>
        )}

        {screen === "verkaufsort" && (
          <main className="flex min-h-0 flex-1 flex-col">
            <Header title="Verkaufsort" onBack={back} />
            <div
              ref={contentRef}
              className="scroll-hidden min-h-0 flex-1 overflow-y-auto"
            >
              <div className="p-page">
                <h1 className="mb-1 text-h1">{outlet.name}</h1>
                <p className="text-body-s text-nebel">
                  {outlet.type} · Verkaufsort · {outlet.distance}
                </p>
              </div>
              <MapCanvas
                mode="detail"
                outlets={[outlet]}
                className="mx-page h-detail-map rounded-card"
              />
              <div className="space-y-4 p-page">
                <section className="rounded-card border border-rahmen bg-papier p-4">
                  <h2 className="mb-3 text-h2">
                    Produkte von{" "}
                    {
                      mock.providers.find((item) => item.id === outlet.provider)
                        ?.name
                    }
                  </h2>
                  <div className="mb-3 flex flex-wrap gap-2">
                    {outlet.products.map((product) => (
                      <Chip key={product}>{product}</Chip>
                    ))}
                  </div>
                  <p className="mb-2 text-body-s text-nebel">
                    Hier gelistet seit August 2026
                  </p>
                  <BestätigtBadge>
                    {outlet.confirmations +
                      (confirmedOutlets.includes(outlet.id) ? 1 : 0)}
                    × von Nutzern bestätigt, zuletzt am{" "}
                    {confirmedOutlets.includes(outlet.id)
                      ? "01.10.2026"
                      : outlet.confirmed}
                  </BestätigtBadge>
                </section>
                <section className="space-y-3 rounded-card border border-rahmen bg-papier p-4">
                  <p className="flex items-start gap-3 text-body-s">
                    <MapPin {...iconProps} />
                    {outlet.address}
                  </p>
                  <p className="flex items-center gap-3 text-body-s">
                    <Clock {...iconProps} />
                    {outlet.hours}
                  </p>
                </section>
              </div>
            </div>
            <div className="shrink-0 space-y-3 border-t border-rahmen bg-grund p-page">
              <p className="text-center text-body-s">
                Warst du hier? Gab es die Produkte?
              </p>
              {confirmedOutlets.includes(outlet.id) ? (
                <p
                  role="status"
                  className="flex min-h-button items-center justify-center text-caption text-nebel"
                >
                  Danke — wir haben das Datum aktualisiert.
                </p>
              ) : (
                <div className="grid grid-cols-2 gap-3">
                  <SekundärButton
                    onClick={() =>
                      setConfirmedOutlets((current) => [...current, outlet.id])
                    }
                  >
                    Ja
                  </SekundärButton>
                  <SekundärButton
                    onClick={() =>
                      setConfirmedOutlets((current) => [...current, outlet.id])
                    }
                  >
                    Nein
                  </SekundärButton>
                </div>
              )}
              <PrimärButton onClick={() => startNavigation(outlet.name)}>
                <Navigation {...iconProps} />
                Route starten
              </PrimärButton>
            </div>
          </main>
        )}

        {screen === "favoriten" && (
          <main className="flex min-h-0 flex-1 flex-col">
            <Header title="Favoriten" onBack={back} />
            <div
              ref={contentRef}
              className="scroll-hidden min-h-0 flex-1 overflow-y-auto p-page"
            >
              <h1 className="mb-section mt-2 text-h1">Favoriten</h1>
              <div className="space-y-2">
                {mock.providers
                  .filter((item) => saved.includes(item.id))
                  .map((item) => (
                    <ListItem
                      key={item.id}
                      provider={item}
                      onClick={() => go(`/anbieter/${item.id}`)}
                    />
                  ))}
                {saved.length === 0 && (
                  <div className="rounded-card border border-rahmen bg-papier p-4">
                    <Bookmark className="mb-3" {...iconProps} />
                    <h2 className="mb-2 text-h2">Hier ist noch Platz</h2>
                    <p className="text-body-s text-nebel">
                      Merke dir Anbieter über das Lesezeichen in ihrem Profil.
                    </p>
                    <SekundärButton
                      className="mt-4"
                      onClick={() => go("/karte")}
                    >
                      Anbieter entdecken
                    </SekundärButton>
                  </div>
                )}
              </div>
              <section className="mt-section rounded-card border border-rahmen bg-papier p-4">
                <h2 className="mb-3 text-h2">Offene Bestätigung</h2>
                {favoriteAnswer ? (
                  <p role="status" className="text-body-s text-nebel">
                    {favoriteAnswer === "Später"
                      ? "Alles klar — du kannst die Angabe später bestätigen."
                      : "Danke — wir haben das Datum aktualisiert."}
                  </p>
                ) : (
                  <>
                    <p className="mb-4 text-body">
                      Warst du bei Hof Meyer zu Westerhausen? Gab es die Eier?
                    </p>
                    <div className="grid grid-cols-3 gap-2">
                      {["Ja", "Nein", "Später"].map((answer) => (
                        <SekundärButton
                          key={answer}
                          onClick={() => setFavoriteAnswer(answer)}
                        >
                          {answer}
                        </SekundärButton>
                      ))}
                    </div>
                  </>
                )}
              </section>
              <p className="mt-section text-caption text-nebel">
                Deine Favoriten werden in diesem Prototyp nur auf deinem Gerät
                vorgemerkt.
              </p>
            </div>
          </main>
        )}

        {screen === "profil" && (
          <main className="flex min-h-0 flex-1 flex-col bg-grund">
            <div
              ref={contentRef}
              className="scroll-hidden min-h-0 flex-1 overflow-y-auto p-page"
            >
              <div className="mb-section mt-2 flex items-center gap-3">
                <span className="flex size-14 shrink-0 items-center justify-center rounded-chip bg-kartengrund text-h2 text-tinte">
                  LH
                </span>
                <div className="min-w-0">
                  <h1 className="text-h1">Lena Hoffmann</h1>
                  <p className="truncate text-body-s text-nebel">
                    lena.hoffmann@example.de
                  </p>
                </div>
              </div>

              <div className="space-y-3">
                <section className="overflow-hidden rounded-card bg-papier">
                  <h2 className="px-4 pb-1 pt-4 text-h2">Mein Suchgebiet</h2>
                  {[
                    ["Standort", "Osnabrück"],
                    ["Standard-Umkreis", "15 km"],
                  ].map(([label, value]) => (
                    <button
                      key={label}
                      type="button"
                      className="flex min-h-button w-full items-center px-4 text-left text-body transition-colors active:bg-grund"
                    >
                      <span>{label}</span>
                      <span className="ml-auto text-nebel">{value}</span>
                      <ChevronRight
                        size={18}
                        strokeWidth={1.5}
                        className="ml-2 text-nebel"
                      />
                    </button>
                  ))}
                </section>

                <section className="overflow-hidden rounded-card bg-papier">
                  <h2 className="px-4 pb-1 pt-4 text-h2">Meine Beiträge</h2>
                  {[
                    ["Angaben bestätigt", "12"],
                    ["Bewertungen", "3"],
                  ].map(([label, value]) => (
                    <button
                      key={label}
                      type="button"
                      className="flex min-h-button w-full items-center px-4 text-left text-body transition-colors active:bg-grund"
                    >
                      <span>{label}</span>
                      <span className="ml-auto">{value}</span>
                      <ChevronRight
                        size={18}
                        strokeWidth={1.5}
                        className="ml-2 text-nebel"
                      />
                    </button>
                  ))}
                </section>

                <section className="rounded-card bg-papier p-4">
                  <h2 className="mb-2 text-h2">Benachrichtigungen</h2>
                  {[
                    "Neue Verkaufsorte bei meinen Favoriten",
                    "Saisonstart in meiner Nähe",
                    "Erinnerung an offene Bestätigungen",
                  ].map((label, index) => (
                    <div
                      key={label}
                      className="flex min-h-button items-center gap-3"
                    >
                      <span className="flex-1 text-body-s">{label}</span>
                      <ProfilToggle
                        checked={profileNotifications[index]}
                        label={label}
                        onChange={() =>
                          setProfileNotifications((current) =>
                            current.map((value, itemIndex) =>
                              itemIndex === index ? !value : value,
                            ),
                          )
                        }
                      />
                    </div>
                  ))}
                </section>

                <section className="overflow-hidden rounded-card bg-papier">
                  <h2 className="px-4 pb-1 pt-4 text-h2">Einstellungen</h2>
                  {["Standortfreigabe", "Datenschutz", "Impressum"].map(
                    (label) => (
                      <button
                        key={label}
                        type="button"
                        className="flex min-h-button w-full items-center px-4 text-left text-body transition-colors active:bg-grund"
                      >
                        {label}
                        <ChevronRight
                          size={18}
                          strokeWidth={1.5}
                          className="ml-auto text-nebel"
                        />
                      </button>
                    ),
                  )}
                </section>

                <div className="flex flex-col items-start pb-2 pt-1">
                  <button
                    type="button"
                    className="min-h-touch text-body-s text-nebel"
                  >
                    Abmelden
                  </button>
                  <button
                    type="button"
                    className="min-h-touch text-body-s text-nebel"
                    onClick={() => {
                      setStep(0)
                      setManual(false)
                      setPlace("Osnabrück")
                      setQuery("")
                      setSaved(["meyer", "brinkmann"])
                      setCategory("Alle")
                      setSalesType("Alle")
                      setRadius(15)
                      setOpenOnly(false)
                      setModal(null)
                      setNavigationTarget("")
                      setHighlighted(undefined)
                      setConfirmedOutlets([])
                      setFavoriteAnswer(null)
                      setStars(0)
                      setReview("")
                      setReviewSent(false)
                      setCopied(false)
                      setNotice("")
                      setProfileNotifications([true, true, false])
                      depth.current = 0
                      navigate("/")
                    }}
                  >
                    Prototyp zurücksetzen
                  </button>
                </div>
              </div>
            </div>
          </main>
        )}

        {![
          "start",
          "onboarding",
          "standort",
          "karte",
          "suche",
          "uebersicht",
          "route",
          "anbieter",
          "spur",
          "verkaufsort",
          "favoriten",
          "profil",
        ].includes(screen) && (
          <main className="flex flex-1 flex-col justify-center gap-4 p-page">
            <h1 className="text-h1">Zurück zu deiner Region</h1>
            <PrimärButton onClick={() => go("/karte")}>
              Karte öffnen
            </PrimärButton>
          </main>
        )}
        {hasTabs && <TabBar active={activeTab} onChange={tabChange} />}
        {screen !== "start" && (
          <div
            className="flex h-home shrink-0 items-center justify-center bg-grund"
            aria-hidden="true"
          >
            <div className="h-1 w-32 rounded-chip bg-tinte" />
          </div>
        )}
        {notice && (
          <div
            role="status"
          className="pointer-events-none absolute inset-x-4 bottom-24 z-40 rounded-card border border-rahmen bg-papier p-3 text-center text-body-s shadow-sheet animate-reveal"
          >
            {notice}
          </div>
        )}

        {modal && (
          <ModalSheet
            title={
              modal === "navigation"
                ? "Navigation starten"
                : modal === "share"
                  ? "Anbieter teilen"
                  : modal === "review"
                    ? "Deine Bewertung"
                    : modal
            }
            onClose={closeModal}
          >
            {modal === "Kategorie" && (
              <div className="space-y-1">
                {[
                  "Alle",
                  "Eier",
                  "Gemüse",
                  "Milch",
                  "Honig",
                  "Äpfel",
                  "Käse",
                ].map((value) => (
                  <button
                    key={value}
                    onClick={() => {
                      setCategory(value)
                      closeModal()
                    }}
                    className="flex min-h-touch w-full items-center justify-between rounded-button px-3 text-body"
                  >
                    <span>{value === "Alle" ? "Alle Kategorien" : value}</span>
                    {category === value && <Check {...iconProps} />}
                  </button>
                ))}
              </div>
            )}
            {modal === "Verkaufsart" && (
              <div className="space-y-1">
                {[
                  "Alle",
                  "Hofladen",
                  "Direktvermarkter",
                  "Supermarkt",
                  "Wochenmarkt",
                  "Automat",
                ].map((value) => (
                  <button
                    key={value}
                    onClick={() => {
                      setSalesType(value)
                      closeModal()
                    }}
                    className="flex min-h-touch w-full items-center justify-between rounded-button px-3 text-body"
                  >
                    <span>
                      {value === "Alle" ? "Alle Verkaufsarten" : value}
                    </span>
                    {salesType === value && <Check {...iconProps} />}
                  </button>
                ))}
              </div>
            )}
            {modal === "Umkreis" && (
              <div className="space-y-1">
                {[5, 10, 15].map((value) => (
                  <button
                    key={value}
                    onClick={() => {
                      setRadius(value)
                      closeModal()
                    }}
                    className="flex min-h-touch w-full items-center justify-between rounded-button px-3 text-body"
                  >
                    <span>{value} km</span>
                    {radius === value && <Check {...iconProps} />}
                  </button>
                ))}
              </div>
            )}
            {modal === "navigation" && (
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <Navigation {...iconProps} />
                  <p className="text-body">
                    Route wird in deiner Karten-App geöffnet
                  </p>
                </div>
                <p className="text-body-s text-nebel">
                  Ziel: {navigationTarget}
                </p>
                <p className="text-caption text-nebel">
                  Im Prototyp wird keine externe App geöffnet. Spor navigiert
                  nicht selbst.
                </p>
                <SekundärButton onClick={closeModal}>Abbrechen</SekundärButton>
              </div>
            )}
            {modal === "share" && (
              <div className="space-y-4">
                <p className="text-body">{provider.name}</p>
                <p className="text-body-s text-nebel">
                  Teile diesen Anbieter mit anderen.
                </p>
                <PrimärButton
                  onClick={async () => {
                    try {
                      await navigator.clipboard.writeText(
                        `${window.location.origin}/anbieter/${provider.id}`,
                      )
                      setCopied(true)
                    } catch {
                      closeModal()
                      setNotice("Der Link konnte nicht kopiert werden.")
                    }
                  }}
                >
                  {copied ? (
                    <>
                      <Check {...iconProps} />
                      Link kopiert
                    </>
                  ) : (
                    <>
                      <Share2 {...iconProps} />
                      Link kopieren
                    </>
                  )}
                </PrimärButton>
              </div>
            )}
            {modal === "review" &&
              (reviewSent ? (
                <p role="status" className="pb-4 text-body">
                  Danke — deine Bewertung wurde im Prototyp vorgemerkt.
                </p>
              ) : (
                <div className="space-y-4">
                  <p className="text-body-s text-nebel">
                    Wie war dein Besuch bei {provider.name}?
                  </p>
                  <div
                    className="flex gap-2"
                    role="group"
                    aria-label="Bewertung von eins bis fünf"
                  >
                    {[1, 2, 3, 4, 5].map((value) => (
                      <button
                        aria-label={`${value} von 5 Sternen`}
                        aria-pressed={value === stars}
                        key={value}
                        onClick={() => setStars(value)}
                        className={`flex size-touch items-center justify-center rounded-button border ${
                          value <= stars
                            ? "border-tinte bg-grund"
                            : "border-rahmen bg-papier"
                        }`}
                      >
                        <Star
                          size={24}
                          strokeWidth={value <= stars ? 2 : 1.5}
                        />
                      </button>
                    ))}
                  </div>
                  <label htmlFor="review" className="block text-body-s">
                    Deine Erfahrung (optional)
                  </label>
                  <textarea
                    id="review"
                    value={review}
                    onChange={(event) => setReview(event.target.value)}
                    rows={3}
                    className="w-full resize-none rounded-button border border-rahmen bg-grund p-3 text-body"
                  />
                  <PrimärButton
                    disabled={!stars}
                    onClick={() => setReviewSent(true)}
                  >
                    Bewertung senden
                  </PrimärButton>
                </div>
              ))}
          </ModalSheet>
        )}
      </div>
    </div>
  )
}

const router = createBrowserRouter([{ path: "*", Component: Prototype }])

export default function App() {
  return <RouterProvider router={router} />
}
