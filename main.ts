
import { Ressource,SoundType } from './src/ressources'
import {Game,State} from './src/game'

let size = 10;
let mine = 10;
let zoom:number = 2;
let game:Game;
let ress:Ressource;
let offsetY = 0;
let w:number = 960;
let h:number = 2079;
let pressStartedAt: number = 0;

function restart(){
	game = new Game(size,size,mine);
	ress.updateTilesetBatch(size,size,game.tiles())
	ress.play("start")

}


love.update = function(dt) {};

love.draw = function() {
	love.graphics.draw(ress.batch,0,offsetY,0, zoom, zoom)
};

love.load = function() {
	if (love.system.getOS() != 'iOS' || love.system.getOS() != 'Android'){
		love.window.setMode(600,600,{})
	}
	math.randomseed(os.time())
	ress = new Ressource();
	ress.initBatch(size,size);
	let mode = love.window.getMode();
	w = mode[0];
	h = mode[1];
	zoom = w/(size*ress.tileSize);
	offsetY = (h-(size*ress.tileSize*zoom))/2
	restart();
};


love.keyreleased  = function (key:KeyConstant){
	if(game.state == "playing"){ return }
	if(key == "space") {
		restart();
	}
};

love.mousepressed = function( x:number, y:number, button:number,isTouch:boolean ){
	pressStartedAt = love.timer.getTime()
}

love.mousereleased = function( x:number, y:number, button:number,isTouch:boolean ){
	let x_pos:number = math.floor(x/ress.tileSize/zoom);
	let y_pos:number = math.floor((y-offsetY)/ress.tileSize/zoom);

	if(!game.inState("playing")) {
		restart();
		return;
	} 
	let ret:boolean = false;
	let elapsed:number = love.timer.getTime()-pressStartedAt;

	if(button == 1 && elapsed <= 0.3){
		ret = game.reveal(x_pos,y_pos);
	}
	else {
		ret = game.flag(x_pos,y_pos);	
	}

	if (game.inState("win")){
		ress.play("win")
	}
	else if(game.inState("loose")){
		ress.play("loose")
	}
	else if(ret){
		ress.play("nothing")
	}

	ress.updateTilesetBatch(size,size,game.tiles())
};