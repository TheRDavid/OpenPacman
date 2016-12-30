<!--
    
Autor:  David Rosenbusch (m21898)
game.php setzt verschiedene JavaSript Quelltexte wie Baukloetze so zusammen,
dass ein lauffaehiges Spiel herauskommt
    
-->
<!DOCTYPE HTML>
<html>
  <head>
      <title>Open Pacman</title>
      <!-- Stylesheets -->
      <link rel="stylesheet" href="css/reset.css">
      <link rel="stylesheet" href="css/style.css">
	<?php
        // Starte wieder die Session, um auf die Nutzerdaten zugreifen zu koennen
        session_start();
        // Sind alle Leben aufgebraucht?
        if($_GET["lives"] > 0) // Wenn nicht, baue das Spiel auf
        {
            // Spielfeld aufbauen
            include 'graphFunc.php';
            // Aktuelles Level laden
            $_SESSION["currentLevel"] = $_GET["level"];
            $file = fopen($_GET["level"],"r");
            // Level-Datenstruktur
            $labyrinth = array();
            // Spielskript zusammenbauen
            $code = "<script>";
            // Spielerverhalten
            $code = $code.file_get_contents('player.js');
            // Leben setzen
            $code = $code."var lives = ".$_GET["lives"].";";
            // Spiellogik laden
            $code = $code.file_get_contents('logic.js');
            // Geisterlogik laden
            $code = $code.file_get_contents('ghosts.js');
            // Spieler initialisieren
            $code = $code."var player = new Player();";
            // Level in die Datenstruktur (2D-Array) einlesen
            while (false !== ($row = fgetcsv($file))) 
            {
                array_push($labyrinth, $row);
            }
            // Canvas setzen
            $html = "
                <div id='paint'>
                    <canvas width='800' height='2000' id='myCanvas'></canvas>
                </div>";
                echo $html;
            $code = $code.build($labyrinth); // Level in JS uebertragen
            $code = $code."cellSize = 700/labyrinth[0].length;update();</script>";
            echo $code; // Fertigen Spielecode auf die Seite anwenden
        } else // Sind alle Leben aufgebraucht, benachrichtige den Nutzer und biete ihm einen Link zum Hauptmenue
        {
            echo "<h1><p>Du hast alle deine Leben verloren :(</p> <p>Game Over</p></h1>";
            echo "<div align='center'><a href='menu.php?welcome=Vielleicht das n&auml;chste Mal ...'>Zur&uuml;ck zum Hauptmen&uuml;</a></div>";           
        }
        
	?>
  </head>
  <body>
  </body>
</html>            