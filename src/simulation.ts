import { CANVAS_HEIGHT, CANVAS_WIDTH, context } from "./constants";
import { Particle, ElementType, Behavior } from "./particle";

export class Simulation {

    grid: Particle[][]
    nextGrid: Particle[][]
    biasDirection: boolean

    constructor(){
        this.grid = this.generateEmptyGrid()
        this.nextGrid = this.generateEmptyGrid()
        this.biasDirection = true
    }

    generateEmptyGrid(): Particle[][] {
        const grid: Particle[][] = []
        for (let y = 0; y < CANVAS_HEIGHT; y++) {
            const row: Particle[] = []
            for (let x = 0; x < CANVAS_WIDTH; x++) 
                row.push(new Particle(ElementType.EMPTY))
            grid.push(row)
        }
        return grid
    }

    render() {
        let data: ImageDataArray = new Uint8ClampedArray(CANVAS_HEIGHT * CANVAS_WIDTH * 4)
        let i = 0
        for (const row of this.grid) {
            for (const e of row) {
                data[i++] = e.color.r
                data[i++] = e.color.g
                data[i++] = e.color.b
                data[i++] = e.color.a
            }
        }
        context.putImageData(new ImageData(data, CANVAS_WIDTH, CANVAS_HEIGHT), 0, 0)
    }

    step() {
        for (let y = 0; y < CANVAS_HEIGHT; y++) {
            let xStart = this.biasDirection ? 0 : CANVAS_WIDTH - 1
            let xEnd = this.biasDirection ? CANVAS_WIDTH : -1
            let xStep = this.biasDirection ? 1 : -1

            for (let x = xStart; x !== xEnd; x += xStep) {
                const p = this.grid[y][x]
                const flags = p.type.flags

                // If the particle is air, no work needs to be done.
                if (this.grid[y][x].isEmpty()) continue

                // If this pixel is already claimed for next frame, it means 
                // a swap this has frame already moved the original occupant out.
                // Skip to avoid processing this pixel again.
                if (!this.pixelIsUnclaimed(x, y)) continue


                // Standard Falling Behavior
                if (flags.has(Behavior.FALLS) && this.isValidTarget(x, y+1, p)) {
                    this.swapParticles(x, y, x, y+1)
                }


                // Sliding (Sand, Rocks)
                else if (flags.has(Behavior.SLIDES) && (this.isValidTarget(x-1, y+1, p) || this.isValidTarget(x+1, y+1, p))) {
                    const left = (this.isValidTarget(x-1, y+1, p))
                    const right = (this.isValidTarget(x+1, y+1, p))
                    if (left && right) this.swapParticles(x, y, Math.random() < 0.5 ? x-1 : x+1, y+1)
                    else if (left) this.swapParticles(x, y, x-1, y+1)
                    else this.swapParticles(x, y, x+1, y+1)
                }


                // Liquid Mechanics
                else if (flags.has(Behavior.FLOWS)) {
                    const dir = Math.random() < 0.5 ? -1 : 1
                    let lastValidY = y
                    let lastValidX = x
                    let searchY = y
                    let searchX = x + dir
                    
                    let remainingMoves = Math.floor(Math.random() * 4)
                    while (remainingMoves > 0) {
                        if (!this.isValidTarget(searchX, searchY, p)) break;

                        if (this.isWithinBounds(searchX, searchY + 1) && this.grid[searchY + 1][searchX].isEmpty()) {
                            searchY++
                            remainingMoves += 8

                        } else {
                            lastValidY = searchY
                            lastValidX = searchX
                            searchX += dir
                            remainingMoves--
                        }
                    }

                    if (lastValidX !== x || lastValidY !== y) 
                        this.swapParticles(x, y, lastValidX, lastValidY)
                    else this.nextGrid[y][x] = p
                }

                // Particle Remains Still
                else this.nextGrid[y][x] = p
            }   
        }

        // Pull in the newly created frame and reverse row processing direction
        this.grid = this.nextGrid
        this.nextGrid = this.generateEmptyGrid()
        this.biasDirection = !this.biasDirection
    }

    isValidTarget(x: number, y: number, p: Particle): boolean {
        return this.isWithinBounds(x, y)
            && this.pixelIsUnclaimed(x, y)
            && p.isDenserThan(this.grid[y][x])
    }

    swapParticles(x: number, y: number, dx: number, dy: number) {
        if (this.isWithinBounds(x, y) && this.isWithinBounds(dx, dy)) {
            this.nextGrid[dy][dx] = this.grid[y][x]
            this.nextGrid[y][x]= this.grid[dy][dx]
        }
    }

    place(x: number, y: number, brush: number, p: Particle) {
        for (let i = Math.trunc(brush / -2); i <= Math.trunc(brush / 2); i++) {
            for (let j = Math.trunc(brush / -2); j <= Math.trunc(brush / 2); j++) {
                this.setPixel(x+j, y+i, p)
            }
        }
    }

    setPixel(x: number, y: number, p: Particle) {
        if (this.isWithinBounds(x, y))
            this.grid[y][x] = p
    }

    isWithinBounds(x: number, y: number) {
        return x >= 0 && x < CANVAS_WIDTH && y >= 0 && y < CANVAS_HEIGHT
    }

    pixelIsUnclaimed(x: number, y: number) {
        return this.nextGrid[y][x].isEmpty()
    }
}
