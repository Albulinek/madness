import type {SpellEnum} from "./SpellEnum.ts";

// Type definition
type GCD_CB_LAMBDA = () => void;
type ON_CAST_LAMBDA = (spellName: SpellEnum, duration: number) => void;
//----

export class Spellcast {
  private inProgress: boolean = false;
  readonly gcdCb: GCD_CB_LAMBDA;
  readonly castBarCb: ON_CAST_LAMBDA;

  // Public section
  constructor(onCast: GCD_CB_LAMBDA, castBarCb: ON_CAST_LAMBDA) {
    this.gcdCb = onCast;
    this.castBarCb = castBarCb;
  }

  async cast(spellName: SpellEnum, duration: number, onCast: () => void){
    if (this.inProgress) {
      throw "Already casting";
    }

    this.setInProgress(true);
    this.gcdCb();
    this.castBarCb(spellName, duration);
    await new Promise(resolve => setTimeout(resolve, duration));
    onCast();
    this.setInProgress(false);
  }

  // Private seciton
  private setInProgress(val: boolean) {
    this.inProgress = val;
  }
}