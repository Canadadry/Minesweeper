

function shuffleTab<T>(array:Array<T>): Array<T>{
	let l:number = array.length;

	while(l>=0){
		let j = 1+math.floor(math.random() * l);
		let valI:T = array[l];
		let valJ:T = array[j];
		array[l] = valJ;
		array[j] = valI;
		l = l - 1;
	}
	return array;
}

export type State = "playing" | "win" | "loose"

class Cell{
	mineAround:number;
	discovered:boolean;
	flagged:boolean;

	constructor(m:number,d:boolean,f:boolean){
		this.mineAround=m;
		this.discovered=d;
		this.flagged=f;
	}
}

export class Game{
	width:number;
	height:number;
	mines:number;
	minesFound:number;
	flagLeft:number;
	state:State;
	map:Array<Array<Cell>>;

	constructor(w:number,h:number,m:number){
		this.width = w;
		this.height = h;
		this.mines = m;
		this.minesFound = 0; 
		this.flagLeft = m;
		this.state = "playing";

		this.map = [];
		for(let x=0;x<this.width;x++){
			this.map[x] = [];
			for(let y=0;y<this.height;y++){
				this.map[x][y] = new Cell(0,false,false);
			}
		}
	
		let place:Array<number>= [];
		for (let i=0;i<this.width*this.height;i++){
			place[i]=i
		}
		place=shuffleTab(place);

		for (let i=0;i<this.mines;i++){
			let x:number = place[i]%this.width;
			let y:number = math.floor(place[i]/this.width);
			this.placeMine(x,y);
		}
	}



	placeMine(x:number,y:number):boolean {
		if(x<0){ return false; }
		if(y<0){ return false; }
		if(x>=this.width){ return false; }
		if(y>=this.height){ return false; }

		if(this.map[x][y].mineAround == 9){ return false }

		this.map[x][y].mineAround = 9;
		this.neighbourMinePlaced(x-1,y-1);
		this.neighbourMinePlaced(x  ,y-1);
		this.neighbourMinePlaced(x+1,y-1);
		this.neighbourMinePlaced(x-1,y  );
		this.neighbourMinePlaced(x+1,y  );
		this.neighbourMinePlaced(x-1,y+1);
		this.neighbourMinePlaced(x  ,y+1);
		this.neighbourMinePlaced(x+1,y+1);

		return true;
	}

	neighbourMinePlaced(x:number,y:number){
		if(x<0){ return }
		if(y<0){ return  }
		if(x>=this.width){ return }
		if(y>=this.height){ return }

		if(this.map[x][y].mineAround == 9){ return }

		this.map[x][y].mineAround++;
	}

	flag(x:number,y:number):boolean{
		if(x<0){ return false }
		if(y<0){ return  false }
		if(x>=this.width){ return false }
		if(y>=this.height){ return false }
		
		let cell:Cell = this.map[x][y];
		
		if(cell.discovered ) { return false }
		if (this.flagLeft == 0 && cell.flagged == false){ return false }

		this.flagLeft += cell.flagged?-1:1;
		cell.flagged = !cell.flagged;

		if (cell.mineAround != 9 ) { return true }

		this.minesFound += cell.flagged?-1:1;
		if(this.minesFound ==this.mines){
			this.state = "win";
		}
		return true;
	}

	reveal(x:number,y:number) :boolean{
		if(x<0){ return false }
		if(y<0){ return  false }
		if(x>=this.width){ return false }
		if(y>=this.height){ return false }
		
		let cell:Cell = this.map[x][y];

		if(cell.discovered ) { return false }
		if(cell.flagged ) { return false }
	
		cell.discovered = true;
		if (cell.mineAround == 9 ){
			this.state = "loose";
			return true;
		}
		if (cell.mineAround == 0 ){
			this.reveal(x,y);
		}

		return true;
	}

	revealAround(x:number,y:number) {
		if(x<0){ return }
		if(y<0){ return }
		if(x>=this.width){ return }
		if(y>=this.height){ return }

		this.reveal(x-1,y-1);
		this.reveal(x  ,y-1);
		this.reveal(x+1,y-1);
		this.reveal(x-1,y  );
		this.reveal(x+1,y  );
		this.reveal(x-1,y+1);
		this.reveal(x  ,y+1);
		this.reveal(x+1,y+1);
	}

	tileAt(x:number,y:number):number{
		if(x<0){ return -1 }
		if(y<0){ return  -1 }
		if(x>=this.width){ return -1 }
		if(y>=this.height){ return -1 }
		
		let c:Cell = this.map[x][y];

		if (this.state == "playing")
		{
			if(c.discovered){
				switch (c.mineAround) {
					case 0: return 6;
					case 9: return 3;
					default: return c.mineAround + 6;
				}
			}
			if(c.flagged){
				return 0;
			}
			return 5;

		} 
		if(!c.flagged){
			switch (c.mineAround) {
				case 0: return 6;
				case 9: return c.discovered?3:2;
				default: return c.mineAround + 6;
			}
		}
		if(c.mineAround ==9){
			return 0;
		}
		return 4;
	}

	tiles():Array<Array<number>>{

		let tiles:Array<Array<number>>=[];
		for(let x=0;x<this.width;x++){
			tiles[x] =[];
			for(let y=0;y<this.height;y++){
				tiles[x][y] = this.tileAt(x,y);
			}
		}
		return tiles;
	}

}



