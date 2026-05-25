export const Behavior = {
    FALLS: 0,
    SLIDES: 1,
    FLOWS: 2,
    SEAGRASS: 3,
    SEED: 4,
    ARABLE: 5,
    HIDDEN: 6,
} as const
export type Behavior = typeof Behavior[keyof typeof Behavior]

export const ElementType = {
    EMPTY: { 
        colorBase: {r: 191, g: 191, b: 191, a: 120, v: 0}, 
        density: 0, 
        flags: new Set<Behavior>()
    },
    ROCK: { 
        colorBase: {r: 79, g: 89, b: 80, a: 255, v: 10}, 
        density: 20, 
        flags: new Set<Behavior>() 
    },
    SAND:  { 
        colorBase: {r: 232, g: 230, b: 113, a: 255, v: 20}, 
        density: 10, 
        flags: new Set<Behavior>([Behavior.FALLS, Behavior.SLIDES, Behavior.ARABLE]) 
    },
    WATER: {
        colorBase: {r: 64,  g: 164, b: 223, a: 100, v: 10}, 
        density: 5, 
        flags: new Set<Behavior>([Behavior.FALLS, Behavior.FLOWS, Behavior.SLIDES]) 
    },
    SEAGRASS: {
        colorBase: {r: 86,  g: 143, b: 92, a: 255, v: 30}, 
        density: 7, 
        flags: new Set<Behavior>([Behavior.HIDDEN, Behavior.SEAGRASS]) 
    },
    SEED: {
        colorBase: {r: 46,  g: 74, b: 49, a: 255, v: 5}, 
        density: 8, 
        flags: new Set<Behavior>([Behavior.SEED, Behavior.FALLS]) 
    },
} as const
export type ElementType = typeof ElementType[keyof typeof ElementType]

type Color = {r: number, g: number, b: number, a: number}

export class Particle {

    type: ElementType
    color: Color
    life: number

    constructor(type: ElementType, life: number) {
        this.type = type
        this.color = this.genColor()
        this.life = life
    }

    genColor(): Color {
        const base = this.type.colorBase
        const offset = Math.trunc(base.v / -2) + Math.floor(Math.random() * base.v)
        return {r: base.r + offset, g: base.g + offset, b: base.b + offset, a: base.a}
    }

    isEmpty(): boolean {
        return this.type === ElementType.EMPTY
    }

    isDenserThan(p2: Particle): boolean {
        return this.type.density > p2.type.density
    }

    isArable(): boolean {
        return this.type.flags.has(Behavior.ARABLE)
    }

    decrementLife(): Particle {
        const p = new Particle(this.type, this.life-1)
        p.color = this.color
        return p
    }

    resetLife(): Particle {
        const p = new Particle(this.type, 0)
        p.color = this.color
        return p
    }
}

