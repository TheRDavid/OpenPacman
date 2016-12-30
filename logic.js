/*

* Autor:  David Rosenbusch (m21898)
* logic.js beinhaltet die gesamte Logik des Spiels und festgesetzte Variablen, die andauernd in verschiedenen Skripts und Funktionen genutzt werden

*/

// Feste Feldwerte
var TELEPORT = -1;
var FREE = 0;
var PLAYER = 16000;
var WALL = 4;
var POINT = 1;
var FRUIT = 2;
var FRUIT_POINT = 3;
var RED_GHOST = 1000;
var RED_GHOST_POINT = RED_GHOST + POINT;
var RED_GHOST_FRUIT = RED_GHOST + FRUIT;
var RED_GHOST_FRUIT_POINT = RED_GHOST + FRUIT_POINT;
var GREEN_GHOST = 2000;
var GREEN_GHOST_POINT = GREEN_GHOST + POINT;
var GREEN_GHOST_FRUIT = GREEN_GHOST + FRUIT;
var GREEN_GHOST_FRUIT_POINT = GREEN_GHOST + FRUIT_POINT;
var BLUE_GHOST = 4000;
var BLUE_GHOST_POINT = BLUE_GHOST + POINT;
var BLUE_GHOST_FRUIT = BLUE_GHOST + FRUIT;
var BLUE_GHOST_FRUIT_POINT = BLUE_GHOST + FRUIT_POINT;
var WHITE_GHOST = 8000;
var WHITE_GHOST_POINT = WHITE_GHOST + POINT;
var WHITE_GHOST_FRUIT = WHITE_GHOST + FRUIT;
var WHITE_GHOST_FRUIT_POINT = WHITE_GHOST + FRUIT_POINT;

// Gesamtpunktzahl (wird beim Bauen des Levels gesetzt (siehe graphFunc.php))
var totalScore = 0;

// HTML Canvas
var canvas = document.getElementById('myCanvas');
var ctx = canvas.getContext('2d');
 
var painting = document.getElementById('paint');
var paint_style = getComputedStyle(painting);
canvas.width = parseInt(paint_style.getPropertyValue('width'));
canvas.height = parseInt(paint_style.getPropertyValue('height'));

// Spielelemente
var player;	// Spieler selbst
var labyrinth = []; // 2D-Array, welches alle Felddaten beinhaltet
var ghosts = []; // Array der Geister

// Ist das Spiel pausiert?
var running = false;

// Groesse eines Feldes
var cellSize = 40;

// Verstrichene Zeit
var time = 0;

// Zusaetzliche Punkte, die durch das Fressen von Geistern gewonnen werden
var extraPoints = 0;

// Wurde der Spieler gefangen?
var caught = false;

/*
* Uebersetzt den aktuellen Spielstand in Klartext.
* Diesen Text kann sich der Nutzer herunterladen, ihn bearbeiten (z.B. in Notepad++) und wieder hochladen.
* Parameter:    Welches Zeichen soll (pro Zeile im Array) fuer den Neuanfang einer Zeile verwendet werden?
*               Uebermittlung durch URL: %0D%0A
*               Uebermittlung durch Textdatei: \n
*/
function gameToText(newLine)
{ 
    var text = "";
    for(var i = 0; i < labyrinth.length; i++)
    {
        text += labyrinth[i]+newLine; // Array Zeile fuer Zeile in Text umwandeln
    }
    return text; // Text zurueckgeben
}

/*
* Reagiert auf Nutzereingaben
*/
function action(e)
{
	if(e.keyCode == 80) // Pausieren bei P
	{
		running = !running;
	}
     else if(e.keyCode == 81) // Auf dem Server peichern bei Q
		{
            var gameName = prompt("Name der Spieldatei:", "Mein cooler Spielstand");
            var labText = gameToText("%0D%0A"); // Spielstand in Klartext umwandeln
            window.location.href = 'save.php?level='+labText+"&name="+gameName; // Neuen Level ueber die URL an save.php uebermitteln
		} else if(e.keyCode == 70) // Aufgeben bei F
        {
            window.location.href = 'menu.php?welcome=Nicht einfach aufgeben!'; // Zurueck zum Hauptmenue mit dem Drueckeberger
        } else if(e.keyCode == 69) // Download bei E, der Spielstand wird heruntergeladen
        {
            var element = document.createElement('a');
            element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(gameToText("\n")));
            element.setAttribute('download', "Spielstand.csv");

            element.style.display = 'none';
            document.body.appendChild(element);

            element.click();

            document.body.removeChild(element);
        }
	if(running) // Darf der Nutzer einen Zug machen? Falls ja, aktualisiere seine Richtung
	{
		if(e.keyCode == 65)
		{
			player.direction = "a";
		}
		else if(e.keyCode == 87)
		{
			player.direction = "w";
		}
		else if(e.keyCode == 68)
		{
			player.direction = "d";
		}
		else if(e.keyCode == 83)
		{
			player.direction = "s";
		}
	}
}

/*
* Die update-Funktion wird bei jeder 'Runde' aufgerufen und zeichnet den Canvas neu.
* Ich hatte zunaechst probiert, nur die Felder neu zu zeichnen, auf denen sich etwas ändert
* (wenn sich Elemente Bewegen), um somit die Performance zu verbessern.
* Dies jedoch führte zu starken Rucklern.
* Meine Methodik war folgende:
* Wann immer sich ein Geist oder der Spieler bewegt haben, wurden ihre Koordinaten einem Array hinzugefuegt.
* Bei jedem update() wurde dieses Array in einer Schleife durchlaufen und die entsprechenden Felder wurden aktualisiert.
* Das funktionierte, es gab jedoch immer wieder Einbrüche in der Performance, anders, als wenn ich das gesamte Feld neu zeichnete,
* Ich weiß nicht, woran das liegt, vielleicht daran, dass das Array bei jedem Update geleert und wieder gefuellt wurde, anstatt nur
* von einem bestaendigen zu lesen.
* Wenn Ihnen ein besserer Ansatz einfällt, koennten Sie ihn mir mitteilen? Denn obwohl es jetzt fluessig funktioniert, wuerde mich
* eine celverere Alternative interessieren :)
*/
function update()
{
    // Das gesamte Feld wird durch die allgemeine Hintergrundfarbe der Seite uebermalt
	ctx.fillStyle='#111'; 
	ctx.fillRect(0,0,1600,2000);
    // Das Spielfeld wird in einer doppelten Schleife durchlaufen
	for(var i = 0; i < labyrinth.length; i++) // Zeilen
	{
		for(var k = 0; k < labyrinth[i].length; k++) // Spalten
		{
			if(labyrinth[i][k] != FREE) // Es muss nur gemalt werden, wenn das Feld nicht frei ist
				if(labyrinth[i][k] == WALL)
				{ 
                    // Wand zeichnen
					ctx.fillStyle='#464'; 
					ctx.fillRect(k*cellSize,i*cellSize,cellSize,cellSize);
				} else if(labyrinth[i][k] == TELEPORT)
				{
                    // Teleporter zeichnen
					ctx.strokeStyle='#FFF';
					ctx.beginPath();
					ctx.arc(k*cellSize+cellSize/2,i*cellSize+cellSize/2,cellSize/2,0,Math.PI*2, true);
					ctx.closePath();
					ctx.stroke();
					ctx.beginPath();
					ctx.arc(k*cellSize+cellSize/2,i*cellSize+cellSize/2,15,0,Math.PI*2, true);
					ctx.closePath();
					ctx.stroke();
					ctx.beginPath();
					ctx.arc(k*cellSize+cellSize/2,i*cellSize+cellSize/2,10,0,Math.PI*2, true);
					ctx.closePath();
					ctx.stroke();
					ctx.beginPath();
					ctx.arc(k*cellSize+cellSize/2,i*cellSize+cellSize/2,5,0,Math.PI*2, true);
					ctx.closePath();
					ctx.stroke();
				}else if(labyrinth[i][k] == FRUIT_POINT||labyrinth[i][k] == FRUIT||labyrinth[i][k] == POINT) // Sonderfall: Punkte koennen ueber Fruechte gezeichnet werden
				{
                    if(labyrinth[i][k] == FRUIT_POINT||labyrinth[i][k] == FRUIT)
                    {
                        // Frucht zeichnen
						ctx.fillStyle='#FF0000';
						ctx.beginPath();
						ctx.arc(k*cellSize+cellSize/2,i*cellSize+cellSize/2,15,0,Math.PI*2, true);
						ctx.closePath();
						ctx.fill();
                    }
                    if(labyrinth[i][k] == POINT||labyrinth[i][k] == FRUIT_POINT)
                    {
                        // Punkt zeichnen
                        ctx.fillStyle='#40FF30';
                        ctx.beginPath();               
                        ctx.arc(k*cellSize+cellSize/2,i*cellSize+cellSize/2,6,0,Math.PI*2, true);
                        ctx.closePath();
                        ctx.fill();
                    }
				}else if(labyrinth[i][k] >= PLAYER)
				{
                    // Spieler zeichnen
                    if(labyrinth[i][k] > player.points + PLAYER)
                    {
                        // Uebersteigt die hiesige Punktzahl die des Spielers + seiner Punkte, wurde er gefangen
                        caught = true;
                    }
                    player.paint(k*cellSize,i*cellSize);
				} else if(labyrinth[i][k] < GREEN_GHOST)
				{
                    // Gruenen Geist zeichnen
					ctx.fillStyle='#FF0000'; 
                    paintGhost(k*cellSize, i*cellSize);
				} else if(labyrinth[i][k] < BLUE_GHOST)
				{
                    // Blauen Geist zeichnen
					ctx.fillStyle='#00FF00';
                    paintGhost(k*cellSize, i*cellSize);
				} else if(labyrinth[i][k] < WHITE_GHOST)
				{
                    // Weissen Geist zeichnen
					ctx.fillStyle='#0000FF';
                    paintGhost(k*cellSize, i*cellSize);
				} else
				{
                    // Roten Geist zeichnen
					ctx.fillStyle='#FFFFFF';
                    paintGhost(k*cellSize, i*cellSize);
				}			
		}
        
	}
    
    // Intruktionen zeichnen
    ctx.fillStyle='#FFFFFF';
	ctx.font = "22px Arial";
	ctx.fillText("Punkte: "+player.points+" / "+totalScore,950,50);
	ctx.fillText("Zeit: "+(time/5)+" Sekunden",950,90);
	ctx.fillText("Leben: "+lives,950,130);
	ctx.fillText("Bedienung: ",950,200);
	ctx.fillText("W = Hoch ",950,240);
	ctx.fillText("A = Links ",950,280);
	ctx.fillText("S = Runter ",950,320);
	ctx.fillText("D = Rechts ",950,360);
	ctx.fillText("P = Start / Pause ",950,420);
	ctx.fillText("Q = Spielstand auf dem Server speichern",950,460);
	ctx.fillText("E = Spielstand lokal speichern",950,500);
	ctx.fillText("F = Aufgeben",950,540);
    
    
    
    // Debug-Feld zeichnen - vielleicht auch fuer den Spieler interessant, was in der Datenstruktur geschieht
	ctx.fillText("Ein Blick hinter die Kulissen:",120,950);
	
    // Hier werden die Felddaten als Klartext aufgemalt. Praktisch zum Debuggen, aber auch interessant anzuschauen
    // Quasi der Nerd-Modus
	for(var i = 0; i < labyrinth.length; i++)
	{
		for(var k = 0; k < labyrinth[i].length; k++)
		{
			ctx.fillText(labyrinth[i][k],k*60,i*60+1000);
		}
	}
    
    // Wurde der Spieler gefangen?
    if(caught)
    {
                console.log("1: "+player.fruitMode);
        // Befindet sich der Spieler im Fruchtmodus (ist seine Frucht-Zeit noch nicht abgelaufen)?
        if(player.fruitMode == 0)
        {
            // Ende im Gelaende, Level wird mit verringerter Anzahl Leben neu geladen
            alert("Sie haben dich erwischt!");
            window.location.href = window.location.href.substring(0,window.location.href.length-1)+(lives-1);
            caught = false; // Zweifache Meldung (geschieht nur unter Chrome, nicht Firefox) verhindern
        } else
        {
            caught = false; // Fruchtmodus war aktiviert, also nicht gefangen
            // Sollte sich der Player bei der Kollision im Fruchtmodus befinden, so wird der entsprechende Geist
            // entfernt. Dem Spieler werden 50 Punkte gutgeschrieben.
            for(var i = ghosts.length-1; i >= 0; i--) // Schleife laeuft rueckwaerts, damit (falls Geist gefresseb) von hinten entfernt wird -> Kein Index wird uebersprungen durch neue Indices
            {
                var g = ghosts[i];
                if(g.xPos == player.xPos && g.yPos == player.yPos)
                {
                    extraPoints += 50;
                    console.log("Remove "+g.type);
                    ghosts.splice(i,1);
                    labyrinth[g.yPos][g.xPos] -= g.type;
                }
            }
        }
    }                
}

/*
* Zeichnet eine Geist (bei vorher gesetzter Farbe).
* Dies geschieht nicht in der Klasse ghost, weil alle benötigten Werte direkt aus dem Feld gelesen werden koennnen,
* ohne auf das ghost-array zugreifen zu muessen.
*/
function paintGhost(x,y)
{
    ctx.beginPath();
    ctx.arc(x+cellSize/2, y + cellSize/2, cellSize/2, 3.14,0);
    ctx.rect(x,y+cellSize/2,cellSize,cellSize/2);
    ctx.closePath();
    ctx.fill();
}

// Keylistener hinzufuegen
window.addEventListener('keydown', action, true);

// Update-Timer einstellen (ein Update pro Fuenftel-Sekunde)
setInterval(function(){ timer() }, 200);

// Timer, der das Spiel updated
function timer() {
	if(running) // Ist das Spiel pausiert?
	{
        time++; // Zeit hochzaehlen
        player.act(); // Spieler macht seinen Zug entsprechend der vom Nutzer gesetzten Richtung
		for(var i = ghosts.length-1; i >= 0; i--) // Alle Geister machen ihren Zug. 
                                                  // Schleife laeuft rueckwaerts, damit (falls Geist gefresseb) von hinten entfernt wird -> Kein Index wird uebersprungen durch neue Indices
		{
            var removed = false;
			var g = ghosts[i];
            if(g.xPos == player.xPos && g.yPos == player.yPos) // Kollision zwischen dem Geist und dem Player?
            {
                console.log("2: "+player.fruitMode);
                if(player.fruitMode > 0) 
                // Sollte sich der Player bei der Kollision im Fruchtmodus befinden, so wird der entsprechende Geist
                // entfernt. Dem Spieler werden 50 Punkte gutgeschrieben.
                {
                    extraPoints += 50;
                    console.log("Remove "+g.type);
                    ghosts.splice(i,1);
                    labyrinth[g.yPos][g.xPos] -= g.type;
                    removed = true;
                }else
                {
                    caught = true;
                }
            }
            if(!removed) // Nur agieren, wenn nicht gefressen
			     g.act();
            
		}
		update(); // Neu zeichnen
        
        if(player.points == totalScore) // Gewinnbedingung ueberpruefen
        {
            alert("Tiptop! Gewonnen!");
            window.location.href = 'saveWin.php?points='+player.points+"&extra="+extraPoints+"&time="+time;
        } else if(caught)
        {
            // Ende im Gelaende, Level wird mit verringerter Anzahl Leben neu geladen
            alert("Sie haben dich erwischt!");
                    window.location.href = window.location.href.substring(0,window.location.href.length-1)+(lives-1);
        caught = false; // Zweifache Meldung (geschieht nur unter Chrome, nicht Firefox) verhindern
        }
	}
}