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
        if(wrap) this.borders()
        // Dessine le poisson
        this.render(bl, r, vmax, dark)
    }
    inflacc(fish, vmax, fmax, sepr, alir, cohr, fsep, fali, fcoh, wrap) {
        let sep = this.separation(fish, vmax, fmax, sepr, wrap)  // Séparation
        let ali = this.alignement(fish, vmax, fmax, alir, wrap)  // Alignement
        let coh = this.cohesion(fish, vmax, fmax, cohr, wrap)    // Cohésion
        sep.scale(fsep)
        ali.scale(fali)
        coh.scale(fcoh)
        // Applique les forces (PFD)
        this.acc.add(sep)
        this.acc.add(ali)
        this.acc.add(coh)
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
    borders() {
        if (this.pos.x < 0) this.pos.x = this.ctx.width
        if (this.pos.y < 0) this.pos.y = this.ctx.height
        if (this.pos.x > this.ctx.width) this.pos.x = 0
        if (this.pos.y > this.ctx.height) this.pos.y = 0
    }
    separation(fish, vmax, fmax, sepr, wrap) {
        // Force de repulsion
        let repf = new Vector(0, 0)
        let count = 0
        fish.forEach(f => {
            let fpos = wrap ? Vector.closerMod(this.pos, f.pos, this.ctx.width, this.ctx.height) : f.pos
            let d = Vector.dist(this.pos, fpos)
            // Distance nulle si f est le poisson actuel
            if ((d > 0) && (d < sepr)) {
                // Une force pour s'éloigner du poissons
                let diff = Vector.sub(this.pos, fpos)
                diff.normalise()
                diff.div(d)
                repf.add(diff)
                count++
            }
        })
        // On moyenne
        if (count > 0) {
            repf.div(count)
        }

        // Si le vecteur est non nul
        if (repf.magSq() > 0) {
            // objectif - vitesse
            repf.normalise()
            repf.scale(vmax)
            repf.sub(this.v)
            repf.limit(fmax)
        }
        return repf
    }
    alignement(fish, vmax, fmax, alir, wrap) {
        let sum = new Vector(0, 0)
        let count = 0
        fish.forEach(f => {
            let fpos = wrap ? Vector.closerMod(this.pos, f.pos, this.ctx.width, this.ctx.height) : f.pos
            let d = Vector.dist(this.pos, fpos)
            if ((d > 0) && (d < alir)) {
                sum.add(f.v)
                count++
            }
        })
        if (count > 0) {
            sum.div(count)
            sum.normalise()
            sum.scale(vmax)
            let alf = Vector.sub(sum, this.v)
            alf.limit(fmax)
            return alf
        } else {
            return new Vector(0, 0)
        }
    }
    cohesion(fish, vmax, fmax, cohr, wrap) {
        let sum = new Vector(0, 0)
        let count = 0
        fish.forEach(f => {
            let fpos = wrap ? Vector.closerMod(this.pos, f.pos, this.ctx.width, this.ctx.height) : f.pos
            let d = Vector.dist(this.pos, fpos)
            if ((d > 0) && (d < cohr)) {
                sum.add(fpos)
                count++
            }
        })
        if (count > 0) {
            sum.div(count)
            return this.seek(sum, vmax, fmax)
        } else {
            return new Vector(0, 0)
        }
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
