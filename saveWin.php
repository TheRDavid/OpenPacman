<!--
    
Autor:  David Rosenbusch (m21898)
saveWin.php Hier wird der Highscore des Siegers geschrieben
    
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
        
        // Daten auslesen
		$points = $_GET["points"];
		$extra = $_GET["extra"];
		$time = $_GET["time"];
        
        // Score aus den gesammelten Punkten, der verbrauchten Zeit und den Extrapunkten berechnen
        $score = $points*10 - $time + $extra;
        
        // Score und Name werden an die dem Level zugehoerige Datei angefügt
        $fp = fopen("highscores/".substr($_SESSION["currentLevel"],7), 'a');
        fwrite($fp,$_SESSION['name'].",".$score."\n");
        fclose($fp);
        
        // Dem Nutzer zeigen, wie sich sein score berechnet
        echo "<h3>";
        echo "<p>Punkte: ".$points."</p>";
        echo "<p>Extra: ".$extra."</p>";
        echo "<p>Zeit: ".($time/5)." Sekunden</p>";
        echo "<p>Endpunkte: ".$score."</p>";
        echo "<p><a href='menu.php?welcome=Gut gemacht!'>Zur&uuml;ck zum Hauptmen&uuml;</p></a></h3>";
    ?>
   </head>
</html>