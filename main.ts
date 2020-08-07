let test = "oi";

import { Vector } from './src/vector';
import { Color } from './src/color';
import { Circle } from './src/circle';
import { Player } from './src/player';
import { Enemy } from './src/enemy';

const circles: Set<Enemy> = new Set();

const W = 800;
const H = 600;

const player = new Player(new Vector(W / 2, H / 2), 15, [200, 20, 100]);

let died = false;
let pos = new Vector(500, 500);

function outsideScreen(c: Circle): boolean {
  return (
    c.pos.x + c.size < 0 ||
    c.pos.x - c.size > W ||
    c.pos.y + c.size < 0 ||
    c.pos.y - c.size > H
  );
}

const to_delete: Enemy[] = [];

let speed_mult = 1;
function randomEnemy(): Enemy {
  const size = math.random(10, 80);
  const side = math.random(4);
  let pos: Vector, speed: Vector;
  if (side == 1) {
    pos = new Vector(-size, math.random() * H * 0.5 + H * 0.25);
    speed = new Vector(math.random(50, 100), math.random(-100, 100));
  } else if (side == 2) {
    pos = new Vector(math.random() * W * 0.5 + W * 0.25, -size);
    speed = new Vector(math.random(-100, 100), math.random(50, 100));
  } else if (side == 3) {
    pos = new Vector(W + size, math.random() * H * 0.5 + H * 0.25);
    speed = new Vector(math.random(-100, -50), math.random(-100, 100));
  } else {
    pos = new Vector(math.random() * W * 0.5 + W * 0.25, H + size);
    speed = new Vector(math.random(-100, 100), math.random(-100, -5));
  }
  speed.x *= speed_mult;
  speed.y *= speed_mult;
  speed_mult += 0.2;
  return new Enemy(pos, speed, size);
}

let cur = 0;

let time_to_next = 0;
let mult = 1;
love.update = function(dt) {
  if (died) return;
  player.size += dt * 0.5;
  cur += dt;
  time_to_next -= dt;
  if (time_to_next < 0) {
    time_to_next = 0.1 + math.random() * 4 * mult;
    mult = mult * 0.95;
    circles.add(randomEnemy());
  }
  player.update(dt);
  circles.forEach(circle => {
    circle.update(dt);
    if (circle.collides(player)) {
      died = true;
      pos = player.pos;
      return;
    }
    if (outsideScreen(circle)) to_delete.push(circle);
  });
  to_delete.forEach(c => circles.delete(c));
  for (let i = to_delete.length; i >= 0; i--) to_delete.pop();
};

const die_font = love.graphics.newFont(30);

love.draw = function() {
  if (died) {
    love.graphics.setColor(
      player.color[0],
      player.color[1],
      player.color[2],
      255
    );
    love.graphics.setFont(die_font);
    love.graphics.print("YOU DIED", pos.x, pos.y);
    return;
  }
  player.draw();
  circles.forEach(circle => circle.draw());
  love.graphics.setColor(255, 255, 255, 255);
  love.graphics.print(string.format("Time %.2fs", cur), W / 2 - 20, 10);
};

love.load = function() {};
