<?php

    /*
    * Autor:  David Rosenbusch (m21898)
    * graphFunc.php stellt die Funktionen zur Verfuegung, mit denen das geladene Level vom Server
    * in ein JS-Array uebertragen wird.
    * Zudem werden die Werte auch interpretiert, saemtliche Punkte, Geister und der Spieler
    * werden ausgelesen und initialisiert.
    */

    /*
    * Baut ein PHP-Array in ein JS-Array um und liest alle noetigen Variablen aus
    * Parameter: Das 2D-Array mit den Felddaten
    */
	function build($labyrinth)
	{
        $code = ""; // Variable fuer den JavaScript Code, der zurueckgeliefert und in die Website eingebunden wird
		$y = 0; // Aktuelle Zeile im 2D-Array
		foreach($labyrinth as $row) // Array wird Zeilenweise ausgelesen
		{
			$code = $code.buildLine($row, $y); // JS-Code zum Bauen der Zeile wird dem Code angefuegt
			$y++;
		}	
		return $code; // Fertigen Code zurueckliefern
	}
	
    /*
    * Liest die Zeile aus
    * Parameter:    Eindimensionales Array mit den Felddaten der Zeile
    *               Zeilencounter (um in die richtige Zeile im JS-Array einzufuegen)
    */
	function buildLine($row, $y)
	{
        $code = ""; // lokaler JS-Code, der dem Gesamtcode hinzugefuegt wird
		$x  = 0;  // Spaltencounter
        $code = $code."labyrinth[".$y."] = [];"; // Zeile anlegen
		foreach($row as $val) // Zeile durchlaufen
		{
            $code = $code."labyrinth[".$y."][".$x."] = ".$val.";"; // Wert einfuegen
			//Player
			if($val > 15999) // Auf diesem Feld befindet sich der Spieler und Informationen zum aktuellen Punktestand
            {
                $code = $code."player.points = (".$val."-PLAYER);";  // Aktueller Punktestand = Differenz des Spieler-Basiswerts und des Feldwerts
                $code = $code."PLAYER = ".$val.";"; // Punktestand im neuen Spieler-Basiswert ablegen
                $code = $code."totalScore += ".$val."-16000;"; // Punkte dem maximal erreichbaren Score hinzufügen
                $code = $code."player.set(".$x.",".$y.");"; // Spielervariable ihre Koordinaten uebermitteln    
                $val -= 16000; // Spielerwert vom Feldwert abziehen (es koennten sich noch weitere Elemente auf dem Feld befinden)
                
            } else if($val>999) // Auf diesem Feld befindetr sich noch mindestens 1 Geist
            {
                if($val > 7999) // Es handelt sich um einen weissen Geist
                {
                    $code = $code."ghosts.push(new Ghost(".$x.",".$y.", WHITE_GHOST));"; // Geist initialisieren und dem Geister-Array (in logic.js) hinzufuegen
                    $val -= 8000; // Geisterwert vom Feld abziehen
                }
                if($val > 3999)  // Es handelt sich um einen blauen Geist
                {
                    $code = $code."ghosts.push(new Ghost(".$x.",".$y.", BLUE_GHOST));"; // Geist initialisieren und dem Geister-Array (in logic.js) hinzufuegen   
                    $val -= 4000; // Geisterwert vom Feld abziehen
                }
                if($val > 1999)  // Es handelt sich um einen gruenen Geist
                {
                    $code = $code."ghosts.push(new Ghost(".$x.",".$y.", GREEN_GHOST));"; // Geist initialisieren und dem Geister-Array (in logic.js) hinzufuegen   
                    $val -= 2000; // Geisterwert vom Feld abziehen
                }
                if($val > 999)  // Es handelt sich um einen roten Geist
                {
                    $code = $code."ghosts.push(new Ghost(".$x.",".$y.", RED_GHOST));"; // Geist initialisieren und dem Geister-Array (in logic.js) hinzufuegen   
                    $val -= 1000; // Geisterwert vom Feld abziehen
                } 
            }
                if($val == 1 || $val == 3) // Befindet sich noch ein Punkt oder ein Punkt mit einer Frucht auf dem Feld, wird der maximale Score erhoeht
                    $code = $code."totalScore ++;";  
			$x++;
		}
        return $code; // JS-Code wird zurueckgegeben
	}
	
?>