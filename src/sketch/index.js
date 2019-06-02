import Population from './Population'
import * as dat from 'dat.gui'

export default function sketch(ctx) {
    let pop
    ctx.setup = () => {
        ctx.createCanvas(ctx.windowWidth, ctx.windowHeight)

        pop = new Population(ctx)

        pop.populate(100)

        let gui = new dat.GUI()
        let ncontroller = gui.add(pop, 'n', 1, 1000).name('Poissons')
        let forces = gui.addFolder('Forces')
        forces.add(pop, 'vmax', 0, 10).name('Vitesse max')
        forces.add(pop, 'fmax', 0, 0.2).name('Max')
        forces.add(pop, 'fsep', 0, 5).name('Séparation')
        forces.add(pop, 'fali', 0, 5).name('Alignement')
        forces.add(pop, 'fcoh', 0, 5).name('Cohésion')
        let rayons = gui.addFolder('Rayons')
        rayons.add(pop, 'sepr', 0, 100, 5).name('Séparation')
        rayons.add(pop, 'alir', 0, 100, 5).name('Alignement')
        rayons.add(pop, 'cohr', 0, 100, 5).name('Cohésion')
        let apparence = gui.addFolder('Apparence')
        apparence.add(pop, 'r', 0.5, 4, 0.5).name('Largeur')
        apparence.add(pop, 'bl', 0, 30, 1).name('Longueur')
        apparence.add(pop, 'wrap').name('Wrap')
        apparence.add(pop, 'dark').name('Mode sombre')

        const resetpop = () => {
            pop.killfish()
            pop.populate()
        }

        ncontroller.onChange(resetpop)

        gui.add({reset: resetpop}, 'reset').name('Redémarrer')
    }

    ctx.draw = () => {
        ctx.background(pop.dark ? 0 : 255)
        pop.run()
    }

    ctx.mouseDragged = () => {
        // Ajoute un poisson à la position de la souris
        // pop.addFish(new Fish(ctx.mouseX, ctx.mouseY, ctx))
    }

    // Quand la fenêtre est redimentionnée
    ctx.windowResized = () => ctx.resizeCanvas(ctx.windowWidth, ctx.windowHeight)
}
