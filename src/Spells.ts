import type {InsanityBar} from "./InsanityBar.ts";

export const VampiricTouchSpell = (insanityBar: InsanityBar) => {
  const BASE_INSANITY: number = 10;

  console.log("Vampiric touch spell cast")
  insanityBar.add(BASE_INSANITY);
  // TODO add combat mechanics
}

// Just example functionality
export const VoidFormSpell = (insanityBar: InsanityBar) => {
  // TODO
  insanityBar.lower(100);
}