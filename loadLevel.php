<!--
    
Autor:  David Rosenbusch (m21898)
loadLevel.php Zeigt alle auf dem Server liegenden Level (Spielstaende) an.
    
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
        echo "<p><h1>Willkommen ".$_SESSION["name"]."</h1></p><div align='center'><p>W&auml;hle einen Level:</p>";
        // Unterordner der Level - Dateien
        $path = "levels/";
        // Wenn der Ordner geoeffnet werden kann...
        if ($handle = opendir($path)) {
            while (false !== ($file = readdir($handle))) { // Alle gueltigen Dateien durchlaufen
                if ('.' === $file) continue;
                if ('..' === $file) continue;
                {
                    $baseName = basename($file, ".csv"); // Dateiendung vom Dateinamen entfernen
                     // Link zur Ansicht der Highscores fuer den entsprechenden Level
                     // Level - Datei wird der Seite game.php uebergeben, Lebensanzahl auf 3 gesetzt
                    echo "<p><a href='game.php?level=".$path.$file."&lives=3'>".$baseName." laden</a></p>";
                }
            }
            closedir($handle);
            echo "</div>";
        }
    ?>
   </head>
   <body>
       <!-- Link zurueck zum Hauptmenue -->
       <div style="margin-top: 2.5%" align="center">
       <a href='menu.php?welcome=Willkommen <?php echo $_SESSION["name"]; ?>'>Zur&uuml;ck zum Hauptmen&uuml;</p></a>
       </div>
    </body>
</html>