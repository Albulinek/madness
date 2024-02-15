import Clock = Phaser.Time.Clock;
// Type
type LISTENER_CB_TYPE = (duration: number) => void;

export class Gcd {
  private BASE_GCD_LENGTH: number = 1000; // in ms

  private inProgress: boolean = false;
  private subscribedStartEvents: Array<LISTENER_CB_TYPE> = [];
  private subscribedEndEvents: Array<() => void> = [];

  
  // Public section
  onTriggerGcd = async (time: Clock) => {
    if (this.inProgress) {
      throw "Already on gcd";
    }

    this.setInProgress(true);
    this.emitGcd();
    // await new Promise(resolve => setTimeout(resolve, this.BASE_GCD_LENGTH));
    time.delayedCall(this.BASE_GCD_LENGTH, () => { 
      this.setInProgress(false);
      this.emitGcdEnd();
    });
  }

  registerStartListener = (gcdListenerCallback: LISTENER_CB_TYPE) => {
    this.subscribedStartEvents.push(gcdListenerCallback);
  }

  registerEndListener = (gcdListenerCallback: () => void) => {
    this.subscribedEndEvents.push(gcdListenerCallback);
  }

  // Private
  private setInProgress = (val: boolean) => {
    this.inProgress = val;
  }

  private emitGcd = () => {
    this.subscribedStartEvents.forEach(gcdListenerCallback => gcdListenerCallback(this.BASE_GCD_LENGTH));
  }

  private emitGcdEnd = () => {
    this.subscribedEndEvents.forEach(gcdListenerCallback => gcdListenerCallback());
  }
}