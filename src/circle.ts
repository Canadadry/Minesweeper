
import { Vector } from './vector'
import { Color } from './color'

export class Circle {
  pos: Vector;
  size: number;
  color: Color;
  constructor(pos: Vector, size: number, color?: Color) {
    this.pos = pos;
    this.size = size;
    if (color == null)
      this.color = [
        math.random(0, 255),
        math.random(0, 255),
        math.random(0, 255)
      ];
    else this.color = color;
  }
  draw() {
    love.graphics.setColor(this.color[0], this.color[1], this.color[2], 255);
    love.graphics.circle("fill", this.pos.x, this.pos.y, this.size);
  }

  collides(b: Circle): boolean {
  return this.pos.dist2(b.pos) <= (this.size + b.size) * (this.size + b.size);
}

}