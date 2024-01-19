import type {InsanityBar} from "./InsanityBar.ts";
import type {Voidform} from "./components/Voidform.ts";

export const VampiricTouchSpell = (insanityBar: InsanityBar) => {
  const BASE_INSANITY: number = 10;

  console.log("Vampiric touch spell cast")
  insanityBar.add(BASE_INSANITY);
  // TODO add combat mechanics
}

export const VoidFormSpell = (voidform: Voidform) => {
  // TODO later add aura to player n stuff
  voidform.enterVoidform();
}