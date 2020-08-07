Game = {
    map,
    mapWidth,
    mapHeight,
    flagLeft, 
    mineFound,
    mine,
    state 
}

local function shuffleTab(a)
	local j = 0;
	local valI = nil
	local valJ = nil
	local l = table.getn(a)-1;
	while (l > -1) do
		j = 1+math.floor(math.random() * l);
		valI = a[l];
		valJ = a[j];
		a[l] = valJ;
		a[j] = valI;
		l = l - 1;
	end
	return a;
end

function Game.initModel(w,h,m)
	Game.mapWidth = w
	Game.mapHeight = h
	Game.flagLeft = m
	Game.mineFound = 0
	Game.mine = m
	Game.state = "playing"

	Game.map = {}
	for x=1,Game.mapWidth do
		Game.map[x] = {}
		for y=1,Game.mapHeight do
			Game.map[x][y] = {model_mineAround= 0, model_discovered= false, model_flaged=false}
		end
	end

	local place = {}
	for i=0,Game.mapWidth*Game.mapHeight do
		place[i]=i
	end
	shuffleTab(place);
	for i=1,Game.mine do
		local x= place[i]%Game.mapWidth;
		local y= math.floor(place[i]/Game.mapWidth);
		Game.placeMine(x,y)
	end
end

function Game.placeMine(x,y) 	
	if(x>=1 and y>=1 and x<=Game.mapWidth and y<=Game.mapHeight) then

		if(Game.map[x][y].model_mineAround == 9) then
			return false
		end

		Game.map[x][y].model_mineAround=9;
		Game.neighbourMinePlaced(x-1,y-1);
		Game.neighbourMinePlaced(x  ,y-1);
		Game.neighbourMinePlaced(x+1,y-1);
		Game.neighbourMinePlaced(x-1,y  );
		Game.neighbourMinePlaced(x+1,y  );
		Game.neighbourMinePlaced(x-1,y+1);
		Game.neighbourMinePlaced(x  ,y+1);
		Game.neighbourMinePlaced(x+1,y+1);

		return true
	end
	return false
end

function Game.neighbourMinePlaced(x,y)
	if(x>=1 and y>=1 and x<=Game.mapWidth and y<=Game.mapHeight) then
		if Game.map[x][y].model_mineAround == 9 then
			return 
		end 

		Game.map[x][y].model_mineAround = Game.map[x][y].model_mineAround+1

	end

end

function Game.flag(x,y)
	local ret = false
	if(x>=1 and y>=1 and x<=Game.mapWidth and y<=Game.mapHeight) then
		local gameBox = Game.map[x][y]
		if(	gameBox.model_discovered == false ) then
			if(Game.flagLeft == 0 and gameBox.model_flaged == false) then return ret end
			ret = true
			if gameBox.model_flaged then
				Game.flagLeft = Game.flagLeft+1
			else 
				Game.flagLeft = Game.flagLeft-1
			end		

			gameBox.model_flaged = not gameBox.model_flaged;

			if(gameBox.model_mineAround == 9) then

				if gameBox.model_flaged then
					Game.mineFound = Game.mineFound+1
				else 
					Game.mineFound = Game.mineFound-1
				end		

				if(Game.mineFound == Game.mine) then 
					Game.state = "win"
				end	
			end
		end
	end
end


function Game.reveal(x,y)
	local ret = false
	if(x>=1 and y>=1 and x<=Game.mapWidth and y<=Game.mapHeight) then

		local gameBox = Game.map[x][y]
		if 	gameBox.model_discovered == false  then
			if gameBox.model_flaged then return ret end
			gameBox.model_discovered = true
			ret = true

			if(gameBox.model_mineAround == 9) then
				gameBox.model_discovered = true
				Game.state = "loose"
			elseif(gameBox.model_mineAround == 0) then
				revealAround(x,y);
			end
		end
	end

	return ret;
end

function revealAround(x,y)
	if(x>=1 and y>=1 and x<=Game.mapWidth and y<=Game.mapHeight) then
		Game.reveal(x-1,y-1);
		Game.reveal(x  ,y-1);
		Game.reveal(x+1,y-1);
		Game.reveal(x-1,y  );
		Game.reveal(x+1,y  );
		Game.reveal(x-1,y+1);
		Game.reveal(x  ,y+1);
		Game.reveal(x+1,y+1);
	end
end


function Game.tileFromModel(model)
	local id = model.model_mineAround

	if Game.state == "playing" then

		if model.model_discovered then            
			if id == 0 then
				return 6
			elseif id == 9 then 
				return  3
			else
				return id+6
			end
		elseif model.model_flaged then
			return 0
		else
			return 5
		end

	else
		if not model.model_flaged then            
			if id == 0 then
				return 6
			elseif id == 9 then 
				if model.model_discovered then
					return  3
				else 
					return 2
				end
			else
				return id+6
			end
		elseif id == 9 then
			return 0
		else
			return 4
		end


	end
end 
