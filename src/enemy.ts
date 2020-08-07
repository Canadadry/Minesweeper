import { Vector } from './vector'
import { Circle } from './circle'

export class Enemy extends Circle {
  pos: Vector;
  speed: Vector;
  size: number;
  constructor(pos: Vector, speed: Vector, size: number) {
    super(pos, size);
    this.speed = speed;
  }
  update(dt: number): void {
    this.pos = this.pos.flop(this.speed, dt);
  }
}