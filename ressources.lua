Ressources = {
    sounds = {},
    tilesetImage,
    tileSize,
    tileQuads = {},
    tilesetBatch
}


function Ressources.load()
    Ressources.sounds["nothing"] = love.audio.newSource("nothing.wav", "static")
    Ressources.sounds["loose"]   = love.audio.newSource("loose.wav"  , "static")
    Ressources.sounds["start"]   = love.audio.newSource("start.wav"  , "static")
    Ressources.sounds["win"]     = love.audio.newSource("win.wav"    , "static")
end 

function Ressources.play(sound)
	love.audio.rewind(Ressources.sounds[sound])
	love.audio.play(Ressources.sounds[sound])
end 



function Ressources.setupTileset()
	Ressources.tilesetImage = love.graphics.newImage( "minesweeper.png" )
	Ressources.tilesetImage:setFilter("nearest", "nearest")
	Ressources.tileSize = 20

	widthInTile  =  Ressources.tilesetImage:getWidth()/Ressources.tileSize;
	heightInTile =  Ressources.tilesetImage:getHeight()/Ressources.tileSize

	for i=0,widthInTile-1 do
		for j=0,heightInTile-1 do 	
			Ressources.tileQuads[i+widthInTile*j] =  love.graphics.newQuad(i * Ressources.tileSize, j * Ressources.tileSize, Ressources.tileSize, Ressources.tileSize, Ressources.tilesetImage:getWidth(), Ressources.tilesetImage:getHeight())
		end
	end
end

function Ressources.initTilesetBatch(mapWidth,mapHeight,map,tileFromModel)
	Ressources.tilesetBatch = love.graphics.newSpriteBatch(Ressources.tilesetImage, mapWidth * mapHeight)
	Ressources.updateTilesetBatch(mapWidth,mapHeight,map,tileFromModel)

end

function Ressources.updateTilesetBatch(tilesDisplayWidth,tilesDisplayHeight,map,tileFromModel)
	Ressources.tilesetBatch:clear()
	
	for x=1, tilesDisplayWidth do
		for y=1, tilesDisplayHeight do
			local id = tileFromModel(map[x][y])
			Ressources.tilesetBatch:addq(Ressources.tileQuads[id], (x-1)*Ressources.tileSize, (y-1)*Ressources.tileSize)
		end
	end
end

function Ressources.paint(zoomX,zoomY)
    mapX=1
    mapY=1
	love.graphics.draw(Ressources.tilesetBatch,0,0,0, zoomX, zoomY)

end




