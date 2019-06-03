import Population from './Population'
import Stats from 'stats.js'
import * as dat from 'dat.gui'

export default function sketch(ctx) {
    let pop
    let stats = new Stats()
    ctx.setup = () => {
        ctx.createCanvas(ctx.windowWidth, ctx.windowHeight)

        stats.showPanel(0)
        document.body.appendChild( stats.dom );

        pop = new Population(ctx)
        pop.populate(100)

        let gui = new dat.GUI()
        let ncontroller = gui.add(pop.options, 'n', 1, 1000).name('Poissons')
        let forces = gui.addFolder('Forces')
        forces.add(pop.options, 'vmax', 0, 10).name('Vitesse max')
        forces.add(pop.options, 'fmax', 0, 0.2).name('Max')
        forces.add(pop.options, 'fsep', 0, 5).name('Séparation')
        forces.add(pop.options, 'fali', 0, 5).name('Alignement')
        forces.add(pop.options, 'fcoh', 0, 5).name('Cohésion')
        let rayons = gui.addFolder('Rayons')
        rayons.add(pop.options, 'sepr', 0, 100, 5).name('Séparation')
        rayons.add(pop.options, 'alir', 0, 100, 5).name('Alignement')
        rayons.add(pop.options, 'cohr', 0, 100, 5).name('Cohésion')
        let apparence = gui.addFolder('Apparence')
        apparence.add(pop.options, 'showRadius').name('Afficher les zones')
        apparence.add(pop.options, 'r', 0.5, 4, 0.5).name('Largeur')
        apparence.add(pop.options, 'bl', 0, 30, 1).name('Longueur')
        apparence.add(pop.options, 'wrap').name('Wrap')
        apparence.add(pop.options, 'dark').name('Mode sombre')

        const resetpop = () => {
            pop.killfish()
            pop.populate()
        }

        ncontroller.onChange(resetpop)

        gui.add({reset: resetpop}, 'reset').name('Redémarrer')
    }

    ctx.draw = () => {
        stats.begin()
        ctx.background(pop.options.dark ? 0 : 255)
        pop.run()
        stats.end()
    }

    ctx.mouseDragged = () => {
        // Ajoute un poisson à la position de la souris
        // pop.addFish(new Fish(ctx.mouseX, ctx.mouseY, ctx))
    }

    // Quand la fenêtre est redimentionnée
    ctx.windowResized = () => ctx.resizeCanvas(ctx.windowWidth, ctx.windowHeight)
}
