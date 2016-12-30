<!--
    
Autor:  David Rosenbusch (m21898)
save.php Hier ein Spielstand auf dem Server gespeichert
    
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
        // Leveldaten auslesen
		$labText = $_GET["level"];
        $fileName = $_GET["name"];
        
        // Datei schreiben
        $fp = fopen("levels/".$fileName.".csv", 'w');
        fwrite($fp, $labText);
        fclose($fp);
    ?>
   </head>
   <body>
        <h3>
            <p>Das Spiel wurde f&uuml;r alle hochgeladen.</p>
            <p>Auch Du kannst das Spiel wieder aufnehmen, klicke einfach auf <i>Spielen</i> im Hauptmen&uuml;</p>  
        </h3>
        <!-- Link zurueck zum Hauptmenue --> 
        <div align="center">
            <a href="menu.php?welcome=Du kannst Dein letztes Spiel fortsetzen oder ein neues starten">Zur&uuml;ck zum Hauptmen&uuml;</a>
        </div>
    </body>
</html>