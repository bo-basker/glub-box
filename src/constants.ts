export const CANVAS_HEIGHT = 64
export const CANVAS_WIDTH = 128
export const MS_PER_FRAME = 20
export const BRUSH_SIZES = [1, 3, 5]
export const DEFAULT_BRUSH_SIZE = 3

export const canvas = document.getElementById("canvas") as HTMLCanvasElement
canvas.height = CANVAS_HEIGHT
canvas.width = CANVAS_WIDTH

export const context = canvas.getContext("2d")!
