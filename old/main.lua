require "ressources"
require "game"

local zoomX = 2
local zoomY = 2
local state -- can loose, playing, stop


function win()
	Ressources.play("win")
end

function loose()    
	Ressources.play("loose")
end

function restart()
	Game.initModel(Game.mapWidth,Game.mapHeight,Game.mine)
	Ressources.updateTilesetBatch(Game.mapWidth,Game.mapHeight,Game.map,Game.tileFromModel)
    Ressources.play("start")
end 

function love.load()
	Ressources.load()
	Ressources.setupTileset()
    Game.initModel(20,20,9)
	Ressources.initTilesetBatch(Game.mapWidth,Game.mapHeight,Game.map,Game.tileFromModel)
	love.graphics.setMode( Ressources.tileSize*Game.mapWidth*zoomX, Ressources.tileSize*Game.mapHeight*zoomY, false, true, 0 )
	Ressources.play("start")
end

function love.keyreleased(key)

	if state ~= "playing" then
		if key == " " then 
			Game.restart()
		end
	end

end

function love.mousereleased( x, y, button )
	local x_pos = math.floor(x/Ressources.tileSize/zoomX);
	local y_pos = math.floor(y/Ressources.tileSize/zoomY);

	if Game.state ~= "playing" then
		restart()
	else
		local ret = false
		if button == "l" then
			ret = Game.reveal(x_pos+1,y_pos+1)
		else
			ret = Game.flag(x_pos+1,y_pos+1)
		end
		if Game.state == "win" then win() 
		elseif Game.state == "loose" then loose() 
		elseif ret == true then
    	   Ressources.play("nothing")

		end
	end
	Ressources.updateTilesetBatch(Game.mapWidth,Game.mapHeight,Game.map,Game.tileFromModel)


end

function love.draw()
    Ressources.paint(zoomX,zoomY)
end