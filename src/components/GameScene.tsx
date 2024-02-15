import Phaser from 'phaser';
import {InsanityBarIndicator} from "./InsanityBarIndicator.ts";
import {InsanityBar} from "../InsanityBar.ts";
import {Gcd} from "../Gcd.ts";
import {Spellcast} from "../Spellcast.ts";
import {VampiricTouchButton} from "./SpellButtons/VampiricTouchButton.ts";
import {SpellEnum} from "../SpellEnum.ts";
import {VT_BASE_CAST_TIME} from "../Constants.ts";
import {VampiricTouchSpell} from "../Spells.ts";
import { CastingBar } from './gui/CastingBar.ts';

type StateManager = {
    insanityBar: InsanityBar;
    gcd: Gcd;
    spellcast: Spellcast;
};

export class GameScene extends Phaser.Scene {
    private state: StateManager;

    public keyOne?: Phaser.Input.Keyboard.Key = undefined;

    constructor() {
        super();

        // Setup state
        const insanityBar = new InsanityBar();
        const gcd = new Gcd();
        const spellcast = new Spellcast(() => gcd.onTriggerGcd(this.time));

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
        //spellbutton
        this.load.image('default_borders', 'images/defaults/default_borders.png');
        this.load.image('default_hilite', 'images/defaults/default_hilite.png');
        //castbar
        this.load.image('castbar_border', 'images/castbar/castbar_border.png');
        this.load.image('castbar_fill_mask', 'images/castbar/castbar_fill_mask.png');
        this.load.image('castbar_flash', 'images/castbar/castbar_flash.png');
        this.load.image('castbar_mask', 'images/castbar/castbar_mask.png');
        this.load.image('castbar_spark', 'images/castbar/castbar_spark.png');

        this.load.glsl('bar_shader', 'shaders/BarShader.frag');
    }

    create() {
        // Keyboard setup
        this.keyOne = this.input.keyboard?.addKey(Phaser.Input.Keyboard.KeyCodes.ONE);

        const {
            insanityBar,
            gcd,
            spellcast
        } = this.state;

        const insanityBarIndicator = new InsanityBarIndicator(this);
        insanityBar.registerListener(insanityBarIndicator.updateBarIndicator);

        const castBar = new CastingBar(this);
        gcd.registerStartListener(castBar.setGcd);
        gcd.registerEndListener(castBar.clearGcd);
        spellcast.registerListener(castBar.startCasting);

        const vtCallback = () => spellcast.cast(SpellEnum.VampiricTouch, VT_BASE_CAST_TIME, () => VampiricTouchSpell(insanityBar));
        const vampiricTouchButton = new VampiricTouchButton(this, vtCallback);
        gcd.registerStartListener(vampiricTouchButton.onTriggerGcd);
        
    }

    update() {
        // ...
    }
}