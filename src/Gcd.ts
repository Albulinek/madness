// Type
type LISTENER_CB_TYPE = (duration: number) => void;

export class Gcd {
  private BASE_GCD_LENGTH: number = 1000; // in ms

  private inProgress: boolean = false;
  private subscribedEvents: Array<LISTENER_CB_TYPE> = [];

  // Public section
  onTriggerGcd = async () => {
    if (this.inProgress) {
      throw "Already on gcd";
    }

    this.setInProgress(true);
    this.emitGcd();
    await new Promise(resolve => setTimeout(resolve, this.BASE_GCD_LENGTH));
    this.setInProgress(false);
  }

  registerListener = (gcdListenerCallback: LISTENER_CB_TYPE) => {
    this.subscribedEvents.push(gcdListenerCallback);
  }

  // Private
  private setInProgress = (val: boolean) => {
    this.inProgress = val;
  }

  private emitGcd = () => {
    this.subscribedEvents.forEach(gcdListenerCallback => gcdListenerCallback(this.BASE_GCD_LENGTH));
  }
}