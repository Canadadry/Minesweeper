
import { Ressource,SoundType } from './src/ressources'
import {Game,State} from './src/game'

let size = 8;
let mine = 10;
let zoomX:number = 2;
let zoomY:number = 2;
let game:Game;
let ress:Ressource;

function restart(){
	game = new Game(size,size,mine);
	ress.updateTilesetBatch(size,size,game.tiles())
	ress.play("start")
}


love.update = function(dt) {};

love.draw = function() {
	love.graphics.draw(ress.batch,0,0,0, zoomX, zoomY)
};

love.load = function() {
	ress = new Ressource();
	ress.initBatch(size,size);
	love.graphics.setMode( 
			ress.tileSize*size*zoomX,
			ress.tileSize*size*zoomY,
			false, true, 0
	)
};


love.keyreleased  = function (key:KeyConstant){
	if(game.state == "playing"){ return }
	if(key == "space") {
		restart();
	}
};

love.mousereleased = function( x:number, y:number, button:number,isTouch:boolean ){
	let x_pos:number = math.floor(x/ress.tileSize/zoomX);
	let y_pos:number = math.floor(x/ress.tileSize/zoomY);

	if(game.state != "playing") {
		restart();
		return;
	} 
	let ret:boolean = false;
	switch (button){
		case 0: ret = game.reveal(x,y);
		default: ret = game.flag(x,y)
	}
	switch (game.state){
		case "win" : ress.play("win")
		case "loose" : ress.play("loose")
		default : if(ret){
			ress.play("nothing")
		}
	}
	ress.updateTilesetBatch(size,size,game.tiles())
};