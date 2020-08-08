export type SoundType = "nothing" | "loose" | "start" | "win" 

export class Ressource{
	sounds:Record<SoundType,Source>;
	image:Image;
	quads:Array<Quad>;
	tileSize:number;
	batch:SpriteBatch;

	constructor() {
		this.sounds = {
			nothing: love.audio.newSource("assets/nothing.wav", "static"),
			loose: love.audio.newSource("assets/loose.wav", "static"),
			start: love.audio.newSource("assets/start.wav", "static"),
			win: love.audio.newSource("assets/win.wav", "static"),
		};
		this.image = love.graphics.newImage( "assets/minesweeper.png" );
		this.image.setFilter("nearest", "nearest")
		this.quads = [];
		this.tileSize=20;

		let widthInTile  : number = this.image.getWidth()/this.tileSize;
		let heightInTile : number = this.image.getHeight()/this.tileSize;

		for(let i=0;i<widthInTile;i++){
			for(let j=0;j<heightInTile;j++){
				this.quads[i+widthInTile*j] =  love.graphics.newQuad(
					i * this.tileSize,
					j * this.tileSize,
					this.tileSize,
					this.tileSize,
					this.image.getWidth(),
					this.image.getHeight(),
				)      
			}    
		}
	}

	initBatch(w :number,h:number){
		this.batch = love.graphics.newSpriteBatch(this.image, w*h)
	}

	updateTilesetBatch(w :number,h:number,tiles:Array<Array<number>>){
		this.batch.clear()
		for(let i=0;i<w;i++){
			for(let j=0;j<h;j++){
				let id = tiles[i][j]
				this.batch.add(
					this.quads[id],
					 (i-1)*this.tileSize, 
					 (j-1)*this.tileSize
				)
			}
		}
	}

	play(st: SoundType){
		love.audio.play(this.sounds[st])
	}
}


