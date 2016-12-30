/*

* Autor:  David Rosenbusch (m21898)
* player.js beinhaltet die noetigen Funktionen fuer den Player

*/

/*
* Konstruktor, in dem die Punkte und der Fruchtmodus auf 0 gesetzt werden.
*/
function Player()
{
	this.points = 0;
    this.fruitMode = 0;
}

/*
* Set-Funtkion fuer die Koordinaten
*/
Player.prototype.set = function(x,y)
{
	this.xPos = x;
	this.yPos = y;
}

/*
* Nachdem der Nutzer durch die Tastatur (WASD) eine Richtung vorgegeben hat, bewegt der Player sich entsprechend.
*/
Player.prototype.act = function()
{
    if(this.fruitMode > 0) this.fruitMode--; // Fruchtmodus wird heruntergezaehlt (bei 0 gilt er als deaktiviert)
    if(this.direction == "d")
        this.move(1,0);  
    else if(this.direction == "a")
        this.move(-1,0);  
    else if(this.direction == "w")
        this.move(0,-1);  
    else
        this.move(0,1);  
}

/*
* Auch die Bewegung des Spielers unterliegt gewissen Regeln
* Tritt er auf einen Teleporter, wird er ans andere Ende der Map (horizontal) verfrachtet.
* Tritt er auf einen Punkt, wird dieser aus dem Spiel entfernt, die Punktzahl wird dauer herhoet.
* Tritt er gegen eine Wand, geschieht nichts.
* Parameter: Differenz der Koordinate
*/
Player.prototype.move = function(x,y)
{
	var val = labyrinth[(this.yPos+y)][(this.xPos+x)];
	if(val == TELEPORT) // Teleporter?
	{
		labyrinth[(this.yPos)][(this.xPos)] -= PLAYER; // Spielerwert wird vom aktuellen Feld abgezogen
		if(this.xPos == 1) // Befindet sich der Spieler ganz links?
			this.xPos = labyrinth[(this.yPos)].length-2; // Dann bewegt er sich nach rechts
		else
			this.xPos = 1; // Ansonsten bewegt er sich nach links
		if(val == POINT || val == FRUIT_POINT) // Teleportiert er auf einen Punkt?
		{
            labyrinth[(this.yPos)][(this.xPos)]--; // Punktwert vom Feld abziehen
            this.addPoint(); // Dem Spieler den Punkt gutschreiben
		}
        if(labyrinth[(this.yPos)][(this.xPos)] == FRUIT) // Tritt er auf eine Frucht?
        {
            labyrinth[(this.yPos)][(this.xPos)]-=2; // Fruchtwert vom Feld abziehen
            this.fruitMode += 45; // Fruchtmodus wird aktiviert
        }
		labyrinth[(this.yPos)][(this.xPos)] += PLAYER; // Spielerwert wird dem Feld der neuen Position hinzugefuegt.
	} else if(val != WALL) // Ist da Feld kein Teleporter, aber begehbar?
	{
		labyrinth[(this.yPos)][(this.xPos)] -= PLAYER; // Spielerwert wird vom aktuellen Feld abgezogen
        // Koordinaten werden neu gesetzt
		this.xPos += x;
		this.yPos += y;       
		if(val == POINT || val == FRUIT_POINT) // Teleportiert er auf einen Punkt?
		{
            labyrinth[(this.yPos)][(this.xPos)]--; // Punktwert vom Feld abziehen
            this.addPoint(); // Dem Spieler den Punkt gutschreiben
		}
        if(labyrinth[(this.yPos)][(this.xPos)] == FRUIT) // Tritt er auf eine Frucht?
        {
            labyrinth[(this.yPos)][(this.xPos)]-=2; // Fruchtwert vom Feld abziehen
            this.fruitMode += 45; // Fruchtmodus wird aktiviert
        }
		labyrinth[(this.yPos)][(this.xPos)] += PLAYER; // Spielerwert dem neuen Feld hinzufuegen
	}
}

/*
* Erhoeht die Punktzahl um 1
*/
Player.prototype.addPoint = function()
{
    this.points++;
    if(this.fruitMode)
    {
        PLAYER++;
    }
}

/*
* Zeichnet den Pacman an die Position des Spielers
*/
Player.prototype.paint = function(x,y)
{
        var angleStart;
        if(this.direction == "d")
            angleStart = 0.25;
        else if(this.direction == "s")
            angleStart = 0.75;
        else if(this.direction == "a")
            angleStart = 1.25;
        else
            angleStart = 1.75;
        if(this.fruitMode > 0)
            ctx.fillStyle='#FFFFFF'; 
        else
            ctx.fillStyle='#FFFF00'; 
        ctx.beginPath();
        ctx.arc(x+cellSize/2, y+cellSize/2, cellSize/2, angleStart * Math.PI, (angleStart+1) * Math.PI, false);
        ctx.fill();
        ctx.beginPath();
        ctx.arc(x+cellSize/2, y+cellSize/2, cellSize/2, (angleStart+0.5) * Math.PI, (angleStart + 1.5) * Math.PI, false);
        ctx.fill();
        ctx.beginPath();
}
