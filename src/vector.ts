
export class Vector {
  x: number;
  y: number;
  constructor(x: number, y: number) {
    this.x = x;
    this.y = y;
  }

  flop(v: Vector, m: number): Vector {
    return new Vector(this.x + v.x * m, this.y + v.y * m);
  }

  dist2(v: Vector): number {
    return (this.x - v.x) * (this.x - v.x) + (this.y - v.y) * (this.y - v.y);
  }
}
