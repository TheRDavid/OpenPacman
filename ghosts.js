/*

* Autor:  David Rosenbusch (m21898)
* ghosts.js beinhaltet die gesamte Logik und alle Attribute der Geister

*/

/*
* Geisterkonstruktor, setzt alle noetigen Variablen.
* Parameter: x-Koordinate, y-Koordinate, Typ (Rot, Gruen, Blau oder Weiss)
*/
function Ghost(x,y,t)
{
	this.xPos = x;
	this.yPos = y;
	this.type = t;
    // Anfangsrichtung
	this.direction = 0;
    // Moegliche Richtungen, in die der Geist sich bewegen kann 
    // (wird bei jeder Entscheidung aktualisiert)
	this.possibs = [];
    // Aktuelles Ziel (falls der Spieler gesehen wurde und danach verschwunden ist)
    // Das Ziel ist eine 2D-Koordinate in Form eines einfachen Arrays
    this.destination = new Array(-1,-1);
}

//Moegliche Richtungen
var UP = 1;
var RIGHT = 2;
var DOWN = 3;
var LEFT = 4;

/*
* Fuelle das Array der moeglichen Richtungen (wo auch immer frei ist)
* Geister koennen sich ueber andere Geister und den Spieler bewegen,
* aber nicht ueber Wande. Ausserdem werden betrachten sie Teleport-Felder
* auch als Waende und wagen sich nicht darauf-
*/
Ghost.prototype.getDirections = function()
{
        // Array leeren
		this.possibs = [];
        // Befindet sich ein Feld weiter oben eine Wand oder ein Teleport-Feld?
		if(labyrinth[(this.yPos-1)][(this.xPos)] != WALL 
            && labyrinth[(this.yPos-1)][(this.xPos)] != TELEPORT)
		{ 
			this.possibs.push(UP);
		}
        // Befindet sich ein Feld weiter rechts eine Wand oder ein Teleport-Feld?
		if(labyrinth[(this.yPos)][(this.xPos+1)] != WALL 
            && labyrinth[(this.yPos)][(this.xPos+1)] != TELEPORT)
		{
			this.possibs.push(RIGHT);
		}
        // Befindet sich ein Feld weiter unten eine Wand oder ein Teleport-Feld?
		if(labyrinth[(this.yPos+1)][(this.xPos)] != WALL 
           && labyrinth[(this.yPos+1)][(this.xPos)] != TELEPORT)
		{ // unten
			this.possibs.push(DOWN);
		}
        // Befindet sich ein Feld weiter links eine Wand oder ein Teleport-Feld?
		if(labyrinth[(this.yPos)][(this.xPos-1)] != WALL 
            && labyrinth[(this.yPos)][(this.xPos-1)] != TELEPORT)
		{ // links
			this.possibs.push(LEFT);
		}
}

/*
* Jede 'Runde' hat der Geist Zeit fuer eine Aktion.
* Was er tut haengt von seinem Typen ab.
* Die Typen sind in logic.js aufgelistet.
*/ 
Ghost.prototype.act = function()
{
    // Handelt es sich um den (dummen) roten Geist, so agiert er (quasi) zufaellig.
    if(this.type == RED_GHOST)
        this.actRandom();
    // Handelt es sich um einen (etwas schlaueren) Blauen oder Gruenen Geist,
    // so versucht er den Spieler zu jagen
    else if(this.type == GREEN_GHOST||this.type == BLUE_GHOST)
        this.hunt();
    // Der cleverste Geist ist der Weisse.
    // Er versucht zuerst den Spieler in einem gewissen Radius aufzuspueren.
    else
        this.sense();
}

/*
* Der Geist schaut in alle 4 Richtungen.
* Sieht er den Spieler, verfolgt er ihn.
*/
Ghost.prototype.hunt = function()
{
     if(this.lookY(this.yPos,-1)) // Nach oben schauen
     {
         if(player.fruitMode == 0)  // Geist flieht, wenn er sieht, dass der Spieler die Frucht gegessen hat.
                this.move(0,-1);
         else                       // Ansonsten Verfolgung aufnehmen
                this.move(0,1);
     }
     else if(this.lookY(this.yPos,1)) // Nach unten schauen
     {
         if(player.fruitMode == 0)  // Geist flieht, wenn er sieht, dass der Spieler die Frucht gegessen hat.
                this.move(0,1);
         else                       // Ansonsten Verfolgung aufnehmen
                this.move(0,-1);
     }
     else if(this.lookX(this.xPos,-1)) // Nach links schauen
     {
         if(player.fruitMode == 0)  // Geist flieht, wenn er sieht, dass der Spieler die Frucht gegessen hat.
                this.move(-1,0);
         else                       // Ansonsten Verfolgung aufnehmen
                this.move(1,0);
     }
     else if(this.lookX(this.xPos,1)) // Nach rechts schauen
     {
         if(player.fruitMode == 0)  // Geist flieht, wenn er sieht, dass der Spieler die Frucht gegessen hat.
                this.move(1,0);
         else                       // Ansonsten Verfolgung aufnehmen
                this.move(-1,0);
     } else if(this.destination[0]!=-1) // Hat sich der Geist zuvor ein Ziel gemerkt (hat die destination-variable einen gültigen Wert?)
     {
         /* 
         *  Ist der Spieler nicht sichtbar, bewegt sich der Geist auf die letzte Stelle zu,
         *  an der er ihn gesehen hat (wenn er sich eine solche Stelle gemerkt hat).
         *  Hier muessen keine Waende oder Teleporter beachtet werden, da der Geist den
         *  Spieler zuvor nur auf geradliniger, freier Bahn gesehen haben kann.
         */
        if(this.xPos == this.destination[0] && this.yPos > this.destination[1]) // Wurde der Spieler zuletzt oben gesehen?
            this.move(0,-1); // Nach oben gehen
        else if(this.xPos == this.destination[0] && this.yPos < this.destination[1]) // Wurde der Spieler zuletzt unten gesehen?
            this.move(0,1); // Nach unten gehen
        else if(this.yPos == this.destination[1] && this.xPos < this.destination[0]) // Wurde der Spieler zuletzt rechts gesehen?
            this.move(1,0); // Nach rechts gehen
        else if(this.yPos == this.destination[1] && this.xPos > this.destination[0]) // Wurde der Spieler zuletzt links gesehen?
            this.move(-1,0); // Nach links gehen
        else
        {
            // Befindet sich der Geist auf der Koordinate, auf der sich der Spieler befand, wird das Ziel auf einen
            // ungültigen Wert gesetzt. Im nächsten Zug wird der Geist versuchen, den Spieler von diesem Punkt aus zu erspaehen.
            this.destination[0] = -1;
            this.destination[1] = -1;
        }
     } else // Ist der Spieler nicht sichtbar und keine vorherige Position bekannt, wird auf das (quasi) zufaellige Bewegungsmuster
            // des roten Geistes zurueckgefallen
     {      
         this.actRandom();
     }
}

/*
* Ueberpruefe rekursiv alle Felder oberhalb oder unterhalb.
* Liefere true zurueck, wenn der Spieler auf direkter Linie zu sehen ist.
* Liefere false zurueck, wenn der Spieler bis zum Ende des Spielfelds nicht zu sehen ist,
* oder eine Wand oder ein Teleporter das Sichtfeld verdeckt.
* 
* Parameter:    - Aktuelle y-Koordinate, welche ueberprueft werden soll
*               - Richtung, in die geschaut werden soll (oben: -1, unten: +1)
*/    
Ghost.prototype.lookY = function(yPos, direction)
{
    if(labyrinth.length <= yPos || yPos < 0) // Wenn das Ende des Spielfeldes erreicht wurde, kann sofort aufgehoert werden.
        return false;
    console.log(yPos+", "+this.xPos);
    var fieldValue = labyrinth[yPos][this.xPos]; // Hole den Wert des Feldes
    if(fieldValue >= PLAYER) // Handelt es sich um den Spieler (Basiswert + gesammelte Punkte)?
    {
        // Diese Position abspeichern, falls der Spieler aus dem Sichtfeld verschwindet
        this.destination[0] = this.xPos;
        this.destination[1] = yPos;
        return true;
    }
    else if(fieldValue != WALL && fieldValue != TELEPORT) // Ist die Sicht nicht blockiert, wird einen Schritt weiter in derselben Richtung weitergesucht
        return this.lookY(yPos+direction, direction);
    else return false; // Spieler nicht sichtbar
}

/*
* Ueberpruefe rekursiv alle Felder links oder rechts.
* Liefere true zurueck, wenn der Spieler auf direkter Linie zu sehen ist.
* Liefere false zurueck, wenn der Spieler bis zum Ende des Spielfelds nicht zu sehen ist,
* oder eine Wand oder ein Teleporter das Sichtfeld verdeckt.
* 
* Parameter:    - Aktuelle y-Koordinate, welche ueberprueft werden soll
*               - Richtung, in die geschaut werden soll (links: -1, rechts: +1)
*/    
Ghost.prototype.lookX = function(xPos, direction)
{
    if(labyrinth[this.yPos].length <= xPos || xPos < 0) // Wenn das Ende des Spielfeldes erreicht wurde, kann sofort aufgehoert werden.
        return false;
    var fieldValue = labyrinth[this.yPos][xPos]; // Hole den Wert des Feldes
    if(fieldValue >= PLAYER) // Handelt es sich um den Spieler (Basiswert + gesammelte Punkte)?
    {
        // Diese Position abspeichern, falls der Spieler aus dem Sichtfeld verschwindet
        this.destination[0] = xPos;
        this.destination[1] = this.yPos;
        return true;
    }
    else if(fieldValue != WALL && fieldValue != TELEPORT) // Ist die Sicht nicht blockiert, wird einen Schritt weiter in derselben Richtung weitergesucht
        return this.lookX(xPos+direction, direction);
    else return false; // Spieler nicht sichtbar
}

/*
* Der weisse Geist ist in der Lage, den Spieler in einem gewissen Radius zu erspueren.
* Schafft er das, wird er direkt vom Spieler angezogen.
* Er ist nicht schlau genug sich einen Pfad zu suchen, sondern rennd stumpf auf den Spieler zu (und unter Umständen gegen eine Wand).
*/
Ghost.prototype.sense = function()
{
    if(Math.abs(player.xPos-this.xPos) < 4 && Math.abs(player.yPos-this.yPos) < 4) // Befindet sich der Spieler in dem Radius?
    {
        // Geist bewegt sich (wenn nichts im Weg ist) direkt auf den Spieler zu
        if(player.xPos < this.xPos && labyrinth[this.yPos][this.xPos - 1] != WALL && labyrinth[this.yPos][this.xPos - 1] != TELEPORT)
            this.move(-1,0);
         else if(player.xPos > this.xPos && labyrinth[this.yPos][this.xPos + 1] != WALL && labyrinth[this.yPos][this.xPos + 1] != TELEPORT)
            this.move(1,0);
         else if(player.yPos < this.yPos && labyrinth[this.yPos - 1][this.xPos] != WALL && labyrinth[this.yPos - 1][this.xPos] != TELEPORT)
            this.move(0,-1);
         else if(player.yPos > this.yPos && labyrinth[this.yPos + 1][this.xPos] != WALL && labyrinth[this.yPos + 1][this.xPos] != TELEPORT)
            this.move(0,1);
    }
    // Befindet sich der Spieler nicht im Radius, wird auf das Verhalten des Blauen und Gruenen Geistes zurueckgefallen
    else this.hunt();
}

/*
* Der Geist bewegt sich von Kreuzung zu Kreuzung und entscheidet jedes mal zufaellig für eine Richtung
*/
Ghost.prototype.actRandom = function()
{
	this.getDirections(); // Erfasse alle moeglichen (freien) Richtungen
	if( 	
            this.direction == 0 || this.possibs.length > 2 // Ist gerade keine Richtung gesetzt, oder eine Kreuzung erreicht worden
		|| 	this.direction == UP      && labyrinth[(this.yPos-1)][(this.xPos)] == WALL // oder eine Wand ist oberhalb, waehrend der Geist sich nach oben bewegt
		||	this.direction == DOWN 	  && labyrinth[(this.yPos+1)][(this.xPos)] == WALL // oder eine Wand ist unterhalb, waehrend der Geist sich nach unten bewegt
		||	this.direction == RIGHT   && labyrinth[(this.yPos)][(this.xPos+1)] == WALL // oder eine Wand ist rechts, waehrend der Geist sich nach rechts bewegt
		||	this.direction == LEFT 	  && labyrinth[(this.yPos)][(this.xPos-1)] == WALL // oder eine Wand ist links, waehrend der Geist sich nach links bewegt
		|| 	this.direction == UP      && labyrinth[(this.yPos-1)][(this.xPos)] == TELEPORT // oder ein Teleporter oberhalb, waehrend der Geist sich nach oben bewegt
		||	this.direction == DOWN 	  && labyrinth[(this.yPos+1)][(this.xPos)] == TELEPORT // oder ein Teleporter unterhalb, waehrend der Geist sich nach unten bewegt
		||	this.direction == RIGHT   && labyrinth[(this.yPos)][(this.xPos+1)] == TELEPORT // oder ein Teleporter recjts, waehrend der Geist sich nach rechts bewegt
		||	this.direction == LEFT 	  && labyrinth[(this.yPos)][(this.xPos-1)] == TELEPORT // oder ein Teleporter links, waehrend der Geist sich nach links bewegt
        )
	{
		var idx = Math.floor(Math.random()*(this.possibs.length)); // Nimm einen zufaelligen Index aus dem Array der moeglichen Richtungen
        
        // Mache es unwahrscheinlicher, dass der Geist eine 180-Grad Drehung macht (sollte nicht zu oft passieren)
		if(this.possibs[idx] == UP && this.direction == DOWN
			|| this.possibs[idx] == DOWN && this.direction == UP
			|| this.possibs[idx] == LEFT && this.direction == RIGHT
			|| this.possibs[idx] == RIGHT && this.direction == LEFT)
				idx = Math.floor(Math.random()*(this.possibs.length)); // Suche in diesem Fall nochmals nach einer neuen Richtung

		this.direction = this.possibs[idx]; // Aktualisiere die Richtung
	}
	switch(this.direction) // Bewege dich entsprechend der Richtung
	{
		case UP: this.move(0,-1); break;
		case RIGHT: this.move(1,0); break;
		case DOWN: this.move(0,1); break;
		case LEFT: this.move(-1,0); break;
	}
}

/**
 * Setze die Position neu entsprechend der Veraenderung der x- und y-Koordinate
 */
Ghost.prototype.move = function(x,y)
{
    if(labyrinth[(this.yPos+y)][(this.xPos+x)] !=WALL           // Obwohl die Spiellogik es verhindern sollte, wird hier ein letztes mal sichergestellt,
        && labyrinth[(this.yPos+y)][(this.xPos+x)] !=TELEPORT)  // dass sich auf der Zielkoordinate keine Wand und kein Teleporter befindet.
	{
		labyrinth[(this.yPos)][(this.xPos)] -= this.type;         // Ziehe den eigenen Wert (je nach Typ) vom aktuellen Feld ab.
		this.xPos += x;
		this.yPos += y;
		labyrinth[(this.yPos)][(this.xPos)] += this.type;         // Fuege den eigenen Wert (je nach Typ) dem neuen Feld hinzu.
	}
}
