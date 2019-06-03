import Fish from './Fish'
import { random } from './Utils'

export default class Population {
    constructor(ctx) {
        this.fish = []
        this.ctx = ctx
        this.setDefaults()
    }
    setDefaults() {
        this.options = {
            vmax: 3,
            fmax: 0.05,
            r: 3,
            bl: 15,
            sepr: 25,
            alir: 50,
            cohr: 50,
            fsep: 1.5,
            fali: 1,
            fcoh: 1,
            wrap: false,
            n: 100,
            ctx: this.ctx,
            dark: false,
            showRadius: false,
            vangle: 5 * Math.PI / 6
        }
    }
    run() {
        this.fish.forEach(f => f.run(this.fish))
    }
    /**
     * Ajoute un poisson
     *
     * @param {Fish} fish poisson à ajouter
     */
    addFish(fish) {
        this.fish.push(fish)
    }
    populate() {
        for (let i = 1; i <= this.options.n; i++) {
            let b = new Fish(
                this.options.ctx.width / 2 + random(-50, 50),
                this.options.ctx.height / 2 + random(-50, 50),
                this.options, i)
            this.addFish(b)
        }
    }
    killfish() {
        this.fish = []
    }
}
