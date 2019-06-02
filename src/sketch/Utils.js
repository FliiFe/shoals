/**
 * Génère un nombre aléatoirement dans [a, b] selon une loi uniforme
 *
 * @param {Number} a
 * @param {Number} b
 * @returns {Number} flottant aléatoire de [a, b]
 */
export const random = (a, b) => Math.random() * (b - a) + a
/**
 * Renvoie l'unique valeur de b de [0, x[ telle que a = b (mod x)
 *
 * @param {Number} a
 * @param {Number} x
 * @returns {Number} b
 */
export const mod = (a, x) => a < 0 ? a % x + x : a % x
