// Type defs
type INSANITY_CHANGE_LISTENER = (val: number) => void;
// ----

export class InsanityBar {
  private insanity: number = 0;
  private onChange: INSANITY_CHANGE_LISTENER;

  // Public

  constructor() {
    this.onChange = (_) => console.log("Insanity bar listener not defined");
  }

  registerListener = (onChange: INSANITY_CHANGE_LISTENER) => {
    this.onChange = onChange;
  }

  add = (val: number) => {
    const newInsanity = this.insanity + val;
    this.insanity = newInsanity > 100 ? 100 : newInsanity;
    this.onChange(this.insanity);
    console.log("Insanity increased to: " + this.insanity);
  }

  lower = (val: number) => {
    const newInsanity = this.insanity - val;
    this.insanity = newInsanity < 0 ? 0 : newInsanity;
    this.onChange(this.insanity);
    console.log("Insanity decreased to: " + this.insanity);
  }

  getInsanity = () => {
    return this.insanity;
  }
}