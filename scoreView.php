<!--
    
Autor:  David Rosenbusch (m21898)
scoreView.php Hier wird die Highscore Liste eines bestimmten Levels sortiert und angezeigt
    
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
        
        // Level auslesen
		$file = fopen($_GET["level"],"r");
		$list = array();
                 echo "<h3>";
		while (false !== ($row = fgetcsv($file))) // Highscores auslesen
		{
			array_push($list, $row);
		}
        function sortStuff($a, $b) // Scores vergleichen
        {
            return $b[1] - $a[1];
        }
        usort($list, "sortStuff"); // Sortieren
		foreach($list as $row) // Array wird Zeilenweise ausgelesen
            echo "<p>".$row[0].": ".$row[1]." Punkte</p>";
                 echo "<h3>";
    ?>
   </head>
   <body>
       <p align="center">
           <!-- Link zurueck zum Hauptmenue --> 
           <a href='menu.php?welcome=Willkommen <?php echo $_SESSION["name"]; ?>'>Zur&uuml;ck zum Hauptmen&uuml;</p></a>
        </p>
    </body>
</html>