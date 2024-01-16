export class Gcd {
  private BASE_GCD_LENGTH: number = 1000; // in ms

  private inProgress: boolean = false;
  private subscribedEvents: Array<(duration: number) => void> = [];

  // Public section
  constructor(subscribedEvents: Array<(duration: number) => void>) {
    this.subscribedEvents = subscribedEvents;
  }

  async onTriggerGcd() {
    if (this.inProgress) {
      throw "Already on gcd";
    }

    this.setInProgress(true);
    this.emitGcd();
    await new Promise(resolve => setTimeout(resolve, this.BASE_GCD_LENGTH));
    this.setInProgress(false);
  }

  // Private
  private setInProgress(val: boolean) {
    this.inProgress = val;
  }

  private emitGcd() {
    this.subscribedEvents.forEach(cb => cb(this.BASE_GCD_LENGTH));
  }
}