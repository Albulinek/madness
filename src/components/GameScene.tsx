import Phaser from 'phaser';
import {EventSystem} from './EventSystem';
import {InsanityBarIndicator} from "./InsanityBarIndicator.ts";
import {InsanityBar} from "../InsanityBar.ts";
import {Gcd} from "../Gcd.ts";
import {Spellcast} from "../Spellcast.ts";
import {VampiricTouchButton} from "./SpellButtons/VampiricTouchButton.ts";
import {SpellEnum} from "../SpellEnum.ts";
import {VT_BASE_CAST_TIME} from "../Constants.ts";
import {VampiricTouchSpell} from "../Spells.ts";
import { CastingBar } from './CastingBar.ts';

type StateManager = {
    insanityBar: InsanityBar;
    gcd: Gcd;
    spellcast: Spellcast;
};

export class GameScene extends Phaser.Scene {
    private eventSystem: EventSystem;
    private counter: Counter;
    private state: StateManager;

    public keyOne?: Phaser.Input.Keyboard.Key = undefined;

    constructor() {
        super();
        // Event System setup
        this.eventSystem = new EventSystem();
        this.counter = new Counter(this.eventSystem);

        // Setup state
        const insanityBar = new InsanityBar();
        const gcd = new Gcd();
        const spellcast = new Spellcast(() => gcd.onTriggerGcd());

        this.state = {
            insanityBar,
            gcd,
            spellcast
        };
    }

    preload() {
        // Load any necessary assets here, like button images
        // TODO: investigate how to load images from the public folder as DI?
        this.load.image('vt_spell', 'images/spells/vt_spell.jpg');
        this.load.image('default_borders', 'images/defaults/default_borders.png');
        this.load.image('default_hilite', 'images/defaults/default_hilite.png');
    }

    create() {
        // Keyboard setup
        this.keyOne = this.input.keyboard?.addKey(Phaser.Input.Keyboard.KeyCodes.ONE);
        // Create spell buttons
        const sp1 = new SpellButton('Surrender to Madness', this.eventSystem);
        sp1.draw(this)

        this.counter.init(this); // TODO: workaround for now
        this.counter.draw(this);

        const {
            insanityBar,
            gcd,
            spellcast
        } = this.state;

        const insanityBarIndicator = new InsanityBarIndicator(this);
        insanityBar.registerListener(insanityBarIndicator.updateBarIndicator);

        const castBar = new CastingBar(this);
        spellcast.registerListener(castBar.startCasting);

        const vtCallback = () => spellcast.cast(SpellEnum.VampiricTouch, VT_BASE_CAST_TIME, () => VampiricTouchSpell(insanityBar));
        const vampiricTouchButton = new VampiricTouchButton(this, vtCallback);
        gcd.registerListener(vampiricTouchButton.onTriggerGcd);

        new DebugOutput(this.eventSystem);
    }

    update() {
        this.counter.draw(this);
    }
}

// Spell Button
class SpellButton {
    constructor(private spellName: string, private eventSystem: EventSystem) {
        // ...
    }

    draw(scene: GameScene) {
        // TODO: Fix the button position to be calculated
        // scene.add.container(200, 100, [button, buttonText]);
        const button = scene.add.rectangle(200, 100, 200, 50, 0x0000ff)
            .setInteractive({ useHandCursor: true })
            .on('pointerup', this.onClick.bind(this));
        const buttonText = scene.add.text(200, 100, this.spellName, { color: '#0f0' })
            .setOrigin(0.5, 0.5);

        return button;
    }

    onClick(): void {
        this.eventSystem.publish('spell_cast', { spellName: this.spellName });
    }
}

class Counter {
    private count: number = 0;
    private button: Phaser.GameObjects.Text | undefined;

    // TODO: Redo to a generic button
    constructor(private eventSystem: EventSystem) {
        this.eventSystem.subscribe('spell_cast', this.startCasting.bind(this));
    }

    init(scene: GameScene) {
        this.button = scene.add.text(100, 200, '', { color: 'yellow' })
    }

    draw(scene: GameScene) {
        this.button?.setText(`Spell casted: ${this.count}`);

        return this.button;
    }

    startCasting(data: { spellName: string }) {
        this.count += 1;
        console.log(`Casting ${data.spellName} for ${this.count} times`);
    }
}

// Debug Output
class DebugOutput {
    constructor(private eventSystem: EventSystem) {
        // subscribe to spell_cast events
        this.eventSystem.subscribe('spell_cast', this.showSpellInfo);
    }

    showSpellInfo = (data: { spellName: string }) => {
        console.log(`Spell cast: ${data.spellName}`);
    }
}