import { Simulation } from "./simulation"
import { MS_PER_FRAME, canvas, CANVAS_HEIGHT, CANVAS_WIDTH, BRUSH_SIZES, DEFAULT_BRUSH_SIZE} from "./constants"
import { Particle, ElementType, Behavior } from "./particle"

/*
    Event Listeners for placing new pixels
*/
let mouseHeld = false
let mouseX = 0
let mouseY = 0

canvas.addEventListener("mousedown", (e) => {
    mouseHeld = true;
    [mouseX, mouseY] = toGridCoords(e)
})

canvas.addEventListener("mousemove", (e) => {
    [mouseX, mouseY] = toGridCoords(e)
})

canvas.addEventListener("mouseup",   () => { mouseHeld = false })
canvas.addEventListener("mouseleave", () => { mouseHeld = false })

function toGridCoords(e: MouseEvent): [number, number] {
    const rect = canvas.getBoundingClientRect()
    const x = Math.floor((e.clientX - rect.left) / rect.width  * CANVAS_WIDTH)
    const y = Math.floor((e.clientY - rect.top)  / rect.height * CANVAS_HEIGHT)
    return [x, y]
}


/*
    Element And Brush Selection
*/

let activeElementType: ElementType = ElementType.SAND
for (const [name, type] of Object.entries(ElementType)) {
    if (type.flags.has(Behavior.HIDDEN)) continue
    const s = document.createElement("h1")
    s.className = "type-selector"
    s.textContent = name.toLowerCase()
    document.getElementById("type-list")!.appendChild(s)
    s.addEventListener("click", () => {activeElementType = type})
}

let brushSize: number = DEFAULT_BRUSH_SIZE
for (const sz of BRUSH_SIZES) {
    const s = document.createElement("h1")
    s.className = "type-selector"
    s.textContent = sz.toString()
    document.getElementById("brush-list")!.appendChild(s)
    s.addEventListener("click", () => {brushSize = sz})
}


/*
    Main Loop. 
*/
const sim = new Simulation()

let lastStepTimestamp = 0

function loop(timestamp: number) {
    if (mouseHeld) sim.place(mouseX, mouseY, brushSize, new Particle(activeElementType, 0))
    
    if (timestamp - lastStepTimestamp >= MS_PER_FRAME) {
        lastStepTimestamp = timestamp
        sim.step()
        sim.render()
    }
    
    requestAnimationFrame(loop)
}

requestAnimationFrame(loop)
