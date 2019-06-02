import {mod} from './Utils'
export default class Vector {
    constructor(x, y) {
        this.x = x
        this.y = y
    }
    /**
     * Angle fait avec la droite réelle, Arg(x + iy)
     *
     * @returns {Number} Angle dans ]-pi, pi[
     */
    heading() {
        return Math.atan2(this.y, this.x)
    }
    /**
     * Additionne deux vecteurs.
     *
     * @param {Vector} v
     * @returns {Vector} this + v
     */
    add(v) {
        this.x += v.x
        this.y += v.y
        return this
    }
    /**
     * Fait la différence de deux vecteurs.
     *
     * @param {Vector} v
     * @returns {Vector} this - v
     */
    sub(v) {
        this.x -= v.x
        this.y -= v.y
        return this
    }
    /**
     * Additionne deux vecteurs sans les modifier
     *
     * @static
     * @param {Vector} v1 a
     * @param {Vector} v2 b
     * @returns {Vector} a+b
     */
    static add(v1, v2) {
        return v1.copy().add(v2)
    }
    /**
     * Soustrait deux vecteurs sans les modifier
     *
     * @static
     * @param {Vector} v1 a
     * @param {Vector} v2 b
     * @returns {Vector} a - b
     */
    static sub(v1, v2) {
        return v1.copy().sub(v2)
    }
    /**
     * Calcule la distance entre v1 et v2
     *
     * @static
     * @param {Vector} v1 a
     * @param {Vector} v2 b
     * @returns {Number} ||a-b||
     */
    static dist(v1, v2) {
        return v1.copy().sub(v2).magnitude()
    }
    /**
     * Norme
     *
     * @returns {Number}
     */
    magnitude() {
        return Math.sqrt(this.magSq())
    }
    /**
     * Norme au carré
     *
     * @returns {Number}
     */
    magSq() {
        return this.x ** 2 + this.y ** 2
    }
    /**
     * Renvoie une copie du vecteur
     *
     * @returns {Vector}
     */
    copy() {
        return new Vector(this.x, this.y)
    }
    /**
     * Multiplication par un scalaire
     *
     * @param {Number} s
     * @returns {Vector} s * this
     */
    scale(s) {
        this.x *= s
        this.y *= s
        return this
    }
    /**
     * Renvoie le vecteur unitaire v/||v||
     *
     * @returns {Vector}
     */
    normalise() {
        let mag = this.magnitude()
        return this.div(mag)
    }
    /**
     * Division par un scalaire
     *
     * @param {Number} s
     * @returns {Vector}
     */
    div(s) {
        return this.scale(1 / s)
    }
    /**
     * Limite la norme du vecteur à max
     *
     * @param {Number} max
     * @returns {Vector}
     */
    limit(max) {
        let msq = this.magSq()
        if (msq > max * max) this.div(Math.sqrt(msq)).scale(max)
        return this
    }
    /**
     * Modifie les composantes du vecteur pour qu'elles soient dans le rectangle w*h
     *
     * @param {Number} w
     * @param {Number} h
     * @returns {Vector}
     */
    mod(w, h) {
        this.x = mod(this.x, w)
        this.y = mod(this.y, h)
        return this
    }
    /**
     * Renvoie le représentant de la classe de v2 le plus proche de v1
     * sur un tore de largeur w et de hauteur h, munit de la relation d'équivalence
     * (x, y) R (x', y') <=> x = x' (mod w) et y = y' (mod h).
     * 
     *
     * @static
     * @param {Vector} v1
     * @param {Vector} v2
     * @param {Number} w largeur
     * @param {Number} h hauteur
     * @returns {Vecteur} v2' dans la classe de v2 qui minimise ||v1-v2||
     */
    static closerMod(v1, v2, w, h) {
        let v1a = v1.copy().mod(w, h)
        let v2a = v2.copy().mod(w, h)
        let dx = v1a.x - v2a.x
        let dy = v1a.y - v2a.y
        if(2 * Math.abs(dx) > w) v2a.x += w * Math.sign(dx)
        if(2 * Math.abs(dy) > h) v2a.y += h * Math.sign(dy)
        return v2a
    }
}
