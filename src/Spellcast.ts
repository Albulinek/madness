import type {SpellEnum} from "./SpellEnum.ts";

// Type definition
type GCD_CB_LAMBDA = () => void;
type ON_CAST_LAMBDA = (spellName: SpellEnum, duration: number) => void;
//----

export class Spellcast {
  private inProgress: boolean = false;
  private castBarCb: ON_CAST_LAMBDA = () => console.log("Spellcast cb not defined!");
  readonly gcdCb: GCD_CB_LAMBDA;

  // Public section
  constructor(onCast: GCD_CB_LAMBDA) {
    this.gcdCb = onCast;
  }

  registerListener = (castBarCb: ON_CAST_LAMBDA) => {
    this.castBarCb = castBarCb;
  }

  cast = async (spellName: SpellEnum, duration: number, onCast: () => void) => {
    if (this.inProgress) {
      throw "Already casting";
    }

    this.setInProgress(true);
    this.gcdCb();
    console.log("I be doing this")
    this.castBarCb(spellName, duration);
    console.log("Casting")
    await new Promise(resolve => setTimeout(resolve, duration));
    onCast();
    this.setInProgress(false);
  }

  // Private seciton
  private setInProgress = (val: boolean) => {
    this.inProgress = val;
  }
}