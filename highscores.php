<!--
    
Autor:  David Rosenbusch (m21898)
highscores.php Listet alle Levels auf, fuer die eine Highscore-Liste angelegt wurde
    
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
        // Ueberschrift
        echo "<p><h1>Highscores</h1></p>";
        // Unterordner der Highscore - Dateien
        $path = "highscores/";
        // Wenn der Ordner geoeffnet werden kann...
        if ($handle = opendir($path)) {
             echo "<h3>"; // Ueberschrift beginnen
            while (false !== ($file = readdir($handle))) { // Alle gueltigen Dateien durchlaufen
                if ('.' === $file) continue;
                if ('..' === $file) continue;
                {
                    $baseName = basename($file, ".csv"); // Dateiendung vom Levelnamen entfernen
                     // Link zur Ansicht der Highscores fuer den entsprechenden Level
                    echo "<p><a href='scoreView.php?level=".$path.$file."'><i>".$baseName." </i>laden</a></p>"; // scoreView.php wird der Dateiname uebergeben
                }
            }
            
             echo "</h3>"; // Ueberschrift beenden
            closedir($handle);
         }
    ?>
   </head>
   <body>
       <!-- Link zurueck zum Hauptmenue -->
       <h3>
       <a href='menu.php?welcome=Willkommen <?php echo $_SESSION["name"]; ?>'>Zur&uuml;ck zum Hauptmen&uuml;</p></a>
       </h3>
    </body>
</html>