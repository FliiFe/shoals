import Fish from './Fish'
import { random } from './Utils'

export default class Population {
    constructor(ctx) {
        this.fish = []
        this.vmax = 3
        this.fmax = 0.05
        this.r = 3
        this.bl = 15
        this.sepr = 25
        this.alir = 50
        this.cohr = 50
        this.fsep = 1.5
        this.fali = this.fcoh = 1
        this.fsepb = this.falib = this.fcohb = true
        this.wrap = false
        this.n = 100
        this.ctx = ctx
        this.dark = true
    }
    run() {
        this.fish.forEach(f =>
            f.run(
                this.fish,
                this.vmax,
                this.fmax,
                this.bl,
                this.r,
                this.sepr,
                this.alir,
                this.cohr,
                this.fsepb && this.fsep || 0,
                this.falib && this.fali || 0,
                this.fcohb && this.fcoh || 0,
                this.wrap,
                this.dark
            ))
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
        for (let i = 0; i < this.n; i++) {
            let b = new Fish(
                this.ctx.width / 2 + random(-50, 50),
                this.ctx.height / 2 + random(-50, 50),
                this.ctx)
            this.addFish(b)
        }
    }
    killfish() {
        this.fish = []
    }
}
