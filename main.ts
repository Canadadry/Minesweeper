
import { Ressource,SoundType } from './src/ressources'

love.update = function(dt) {};

love.draw = function() {};

love.load = function() {
  let r = new Ressource();
  r.play("start")
};
