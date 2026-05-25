export const Behavior = {
    FALLS: 0,
    SLIDES: 1,
    FLOWS: 2,
} as const
export type Behavior = typeof Behavior[keyof typeof Behavior]

export const ElementType = {
    EMPTY: { 
        colorBase: {r: 191, g: 191, b: 191, a: 120, v: 0}, 
        density: 0, 
        flags: new Set<Behavior>()
    },
    WOOD: { 
        colorBase: {r: 125, g: 81, b: 24, a: 255, v: 10}, 
        density: 20, 
        flags: new Set<Behavior>() 
    },
    SAND:  { 
        colorBase: {r: 232, g: 230, b: 113, a: 255, v: 20}, 
        density: 10, 
        flags: new Set<Behavior>([Behavior.FALLS, Behavior.SLIDES]) 
    },
    WATER: {
        colorBase: {r: 64,  g: 164, b: 223, a: 100, v: 10}, 
        density: 5, 
        flags: new Set<Behavior>([Behavior.FALLS, Behavior.FLOWS, Behavior.SLIDES]) 
    },
} as const
export type ElementType = typeof ElementType[keyof typeof ElementType]

type Color = {r: number, g: number, b: number, a: number}

export class Particle {

    type: ElementType
    color: Color

    constructor(type: ElementType) {
        this.type = type
        this.color = this.genColor()
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
}

