import { Vector } from './vector'
import { Circle } from './circle'
import { Color } from './color'


export class Player extends Circle {
  constructor(pos: Vector, size: number, color: Color) {
    super(pos, size, color);
  }
  update(dt: number) {
    if (love.keyboard.isDown("w", "up")) this.pos.y -= dt * 200;
    if (love.keyboard.isDown("s", "down")) this.pos.y += dt * 200;
    if (love.keyboard.isDown("a", "left")) this.pos.x -= dt * 200;
    if (love.keyboard.isDown("d", "right")) this.pos.x += dt * 200;
  }
}