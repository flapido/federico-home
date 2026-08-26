export const contact = {
  email: "lapidofederico@gmail.com",
  whatsappNumber: "+54 9 11 5764-2626",
  whatsappBase: "https://wa.me/5491157642626",
  linkedin: "https://www.linkedin.com/in/federico-lapido",
} as const;

const originLabels: Record<string, string> = {
  soluciones: "soluciones",
  "legacy-web": "modernización de sistemas",
  subastas: "sistemas de venta y subastas",
  "archivo-digital": "archivo digital",
  "avatares-ia": "avatares e IA",
};

export function contactOrigin(value: string | null | undefined) {
  return value && originLabels[value] ? value : "";
}

export function whatsappHref(origin?: string | null) {
  const label = origin
    ? (originLabels[origin] ?? "una idea o proyecto")
    : "una idea o proyecto";
  return `${contact.whatsappBase}?text=${encodeURIComponent(`Hola Federico, vi tu portfolio y quería consultarte por ${label}.`)}`;
}

export function emailHref() {
  return `mailto:${contact.email}?subject=${encodeURIComponent("Consulta desde Federico Home")}&body=${encodeURIComponent("Hola Federico,\n\nVi tu portfolio y quería hacerte una consulta.")}`;
}
