import Vector from './Vector'
import { random } from './Utils'

export default class Fish {
    constructor(x, y, opt, id) {
        // Vecteur accélération
        this.acc = new Vector(0, 0)
        // Vecteur vitesse
        this.v = new Vector(random(-1, 1), random(-1, 1))
        // this.v = new Vector(0, 1)
        // Vecteur position
        this.pos = new Vector(x, y)
        // Contexte pour dessiner (p5.js)
        this.ctx = opt.ctx
        this.opt = opt
        this.id = id
    }
    run(fish) {
        // Calcule la nouvelle accélération avec les forces exercées par les autres poissons
        this.inflacc(fish)
        // Met à jour la position avec la nouvelle accélération
        this.update()
        // Remet le poisson dans le cadre s'il a dépassé (tore)
        if(this.opt.wrap) this.pos.mod(this.ctx.width, this.ctx.height)

        // Dessine le poisson
        this.render()
    }
    inflacc(fish) {
        // Calcule la force résultante des trois règles
        let rulesf = this.rules(fish)
        // Applique les forces (PFD)
        this.acc.add(rulesf)
    }
    update() {
        if(!this.opt.wrap) {
            let bounceback = 0.05
            let bound = 0.2
            if(this.pos.x > this.ctx.width * (1 - bound)) {
                this.acc.x += -bounceback
            }
            if(this.pos.y > this.ctx.height * (1 - bound)) this.acc.y += -bounceback
            if(this.pos.x < this.ctx.width * bound) this.acc.x += bounceback
            if(this.pos.y < this.ctx.height * bound) this.acc.y += bounceback
        }
        this.v.add(this.acc)
        // Limite la vitesse
        this.v.limit(this.opt.vmax)
        // Met à jour la position
        this.pos.add(this.v)
        // On remet l'accélération à 0
        this.acc.scale(0)
    }
    seek(target) {
        let objectif = Vector.sub(target, this.pos)  // Un vecteur vers la cible
        objectif.normalise()
        objectif.scale(this.opt.vmax)
        // objectif - vitesse
        let attraction = Vector.sub(objectif, this.v)
        attraction.limit(this.opt.fmax)
        return attraction
    }
    rules(fish) {
        let sepf = new Vector(0, 0)
        let sepCount = 0
        let cohf = new Vector(0, 0)
        let cohCount = 0
        let alif = new Vector(0, 0)
        let aliCount = 0
        fish.forEach(f => {
            let fpos = this.opt.wrap
                ? Vector.closerMod(this.pos, f.pos, this.ctx.width, this.ctx.height)
                : f.pos
            let dsq = Vector.distsq(this.pos, fpos)
            if ((dsq > 0) && (dsq < this.opt.cohr ** 2)) {
                cohf.add(fpos)
                cohCount++
            }
            if ((dsq > 0) && (dsq < this.opt.alir ** 2)) {
                alif.add(f.v)
                aliCount++
            }
            if ((dsq > 0) && (dsq < this.opt.sepr ** 2)) {
                // Une force pour s'éloigner du poissons
                let diff = Vector.sub(this.pos, fpos)
                diff.normalise()
                diff.div(Math.sqrt(dsq))
                sepf.add(diff)
                sepCount++
            }
        })
        if (sepCount > 0) {
            sepf.div(sepCount)
        }
        if (sepf.magSq() > 0) {
            sepf.normalise()
            sepf.scale(this.opt.vmax)
            sepf.sub(this.v)
            sepf.limit(this.opt.fmax)
        }
        sepf.scale(this.opt.fsep)
        let cohesionRes = new Vector(0, 0)
        if (cohCount > 0) {
            cohf.div(cohCount)
            cohesionRes.add(this.seek(cohf, this.opt.vmax, this.opt.fmax).scale(this.opt.fcoh))
        }
        let alignmentRes = new Vector(0, 0)
        if (aliCount > 0) {
            alif.div(aliCount)
            alif.normalise()
            alif.scale(this.opt.vmax)
            let alf = Vector.sub(alif, this.v)
            alf.limit(this.opt.fmax)
            alf.scale(this.opt.fali)
            alignmentRes.add(alf)
        }
        return Vector.add(cohesionRes, alignmentRes).add(sepf)
    }
    render() {
        let theta = this.v.heading() - Math.PI / 2
        let value = Math.floor(255 * this.v.magnitude() / this.opt.vmax)
        this.ctx.fill(this.opt.dark ? value : 255 - value)
        this.ctx.noStroke()
        this.ctx.push()
        this.ctx.translate(this.pos.x, this.pos.y)
        this.ctx.rotate(theta)
        this.ctx.beginShape()
        this.ctx.vertex(0, 1 - this.opt.bl)
        this.ctx.vertex(-this.opt.r, 0)
        this.ctx.vertex(this.opt.r, 0)
        this.ctx.endShape(this.ctx.CLOSE)
        this.ctx.rotate(Math.PI / 2)
        this.ctx.arc(0, 0, 2 * this.opt.r, 2 * this.opt.r, -Math.PI / 2, Math.PI / 2)
        if(this.opt.showRadius && this.id === 1) {
            this.ctx.noFill()
            this.ctx.stroke(this.opt.dark ? 255 : 0)
            this.ctx.arc(0, 0, this.opt.cohr, this.opt.cohr, -this.opt.vangle, this.opt.vangle)
            this.ctx.arc(0, 0, this.opt.alir, this.opt.alir, -this.opt.vangle, this.opt.vangle)
            this.ctx.arc(0, 0, this.opt.sepr, this.opt.sepr, -this.opt.vangle, this.opt.vangle)
        }
        this.ctx.pop()
    }
}
