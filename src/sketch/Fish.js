import Vector from './Vector'
import {random} from './Utils'
export default class Fish {
    constructor(x, y, ctx) {
        // Vecteur accélération
        this.acc = new Vector(0, 0)
        // Vecteur vitesse
        this.v = new Vector(random(-1, 1), random(-1, 1))
        // Vecteur position
        this.pos = new Vector(x, y)
        // Contexte pour dessiner (p5.js)
        this.ctx = ctx
    }
    run(fish, vmax = 3, fmax = 0.05, bl = 7, r = 3, sepr = 25, alir = 50, cohr = 50, fsep = 1, fali = 1, fcoh = 1, wrap = true, dark = false) {
        // Calcule la nouvelle accélération avec les forces exercées par les autres poissons
        this.inflacc(fish, vmax, fmax, sepr, alir, cohr, fsep, fali, fcoh, wrap)
        // Met à jour la position avec la nouvelle accélération
        this.update(vmax, wrap)
        // Remet le poisson dans le cadre s'il a dépassé (tore)
        if(wrap) this.pos.mod(this.ctx.width, this.ctx.height)

        // Dessine le poisson
        this.render(bl, r, vmax, dark)
    }
    inflacc(fish, vmax, fmax, sepr, alir, cohr, fsep, fali, fcoh, wrap) {
        // Calcule la force résultante des trois règles
        let rulesf = this.rules(fish, vmax, fmax, sepr, fsep, alir, fali, cohr, fcoh, wrap)
        rulesf.scale(fcoh)
        // Applique les forces (PFD)
        this.acc.add(rulesf)
    }
    update(vmax, wrap) {
        if(!wrap) {
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
        this.v.limit(vmax)
        // Met à jour la position
        this.pos.add(this.v)
        // On remet l'accélération à 0
        this.acc.scale(0)
    }
    seek(target, vmax, fmax) {
        let objectif = Vector.sub(target, this.pos)  // Un vecteur vers la cible
        objectif.normalise()
        objectif.scale(vmax)
        // objectif - vitesse
        let attraction = Vector.sub(objectif, this.v)
        attraction.limit(fmax)
        return attraction
    }
    rules(fish, vmax, fmax, sepr, fsep, alir, fali, cohr, fcoh, wrap) {
        let sepf = new Vector(0, 0)
        let sepCount = 0
        let cohf = new Vector(0, 0)
        let cohCount = 0
        let alif = new Vector(0, 0)
        let aliCount = 0
        fish.forEach(f => {
            let fpos = wrap ? Vector.closerMod(this.pos, f.pos, this.ctx.width, this.ctx.height) : f.pos
            let d = Vector.dist(this.pos, fpos)
            if ((d > 0) && (d < cohr)) {
                cohf.add(fpos)
                cohCount++
            }
            if ((d > 0) && (d < alir)) {
                alif.add(f.v)
                aliCount++
            }
            if ((d > 0) && (d < sepr)) {
                // Une force pour s'éloigner du poissons
                let diff = Vector.sub(this.pos, fpos)
                diff.normalise()
                diff.div(d)
                sepf.add(diff)
                sepCount++
            }
        })
        if (sepCount > 0) {
            sepf.div(sepCount)
        }
        if (sepf.magSq() > 0) {
            sepf.normalise()
            sepf.scale(vmax)
            sepf.sub(this.v)
            sepf.limit(fmax)
        }
        sepf.scale(fsep)
        let cohesionRes = new Vector(0, 0)
        if (cohCount > 0) {
            cohf.div(cohCount)
            cohesionRes.add(this.seek(cohf, vmax, fmax).scale(fcoh))
        }
        let alignmentRes = new Vector(0, 0)
        if (aliCount > 0) {
            alif.div(aliCount)
            alif.normalise()
            alif.scale(vmax)
            let alf = Vector.sub(alif, this.v)
            alf.limit(fmax)
            alf.scale(fali)
            alignmentRes.add(alf)
        }
        return Vector.add(cohesionRes, alignmentRes).add(sepf)
    }
    render(bl, r, vmax, dark) {
        let theta = this.v.heading() - Math.PI / 2
        let value = Math.floor(255 * this.v.magnitude() / vmax)
        this.ctx.fill(dark ? value : 255 - value)
        this.ctx.noStroke()
        this.ctx.push()
        this.ctx.translate(this.pos.x, this.pos.y)
        this.ctx.rotate(theta)
        this.ctx.beginShape()
        this.ctx.vertex(0, 1 - bl)
        this.ctx.vertex(-r, 0)
        this.ctx.vertex(r, 0)
        this.ctx.endShape(this.ctx.CLOSE)
        this.ctx.arc(0, 0, 2 * r, 2 * r, 0, Math.PI)
        this.ctx.pop()
    }
}
