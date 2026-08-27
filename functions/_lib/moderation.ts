export type Moderation = { level: "clean" | "review" | "blocked"; reason?: string };
const severe = /\b(matarte|te voy a matar|amenaza|violaci[oó]n|suicidate|pedo[fíi]l|nazi)\b/iu;
const abuse = /\b(idiota|in[úu]til|imb[eé]cil|mierda|pelotudo|forro)\b/iu;
const spam = /\b(crypto|casino|viagra|onlyfans|gan[aá] dinero|click here)\b/iu;
export function moderate(text: string): Moderation {
  const links = (text.match(/https?:\/\//giu) || []).length;
  const repeated = /(.)\1{9,}/u.test(text) || /(.{4,})\1{4,}/u.test(text);
  if (severe.test(text) || spam.test(text) || links > 2 || repeated) return { level: "blocked", reason: "spam, agresión o abuso" };
  if (abuse.test(text) || links === 2 || /!{4,}|\?{4,}/u.test(text)) return { level: "review", reason: "contenido dudoso o agresivo" };
  return { level: "clean" };
}
