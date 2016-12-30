<!--
    
Autor:  David Rosenbusch (m21898)
menu.php Ist das Hauptmenue. Der Nutzer kann von hier aus ein Spiel starten, 
Highscores betrachten, Level hochladen oder sich ausloggen.
    
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
        // Ist der Name in der Session noch nicht gesetzt, hat sich der Nutzer wohl gerade angemeldet.
        // In diesem Fall wird der Name aus dem Willkommensgruss ausgelesen und in der Session gespeichert.
        if(!isset($_SESSION['name'])) 
            $_SESSION['name'] = substr($_GET["welcome"],11);
        // Willkommensgruss anzeigen
        echo "<p><h1>". $_GET["welcome"]."</h1></p>";
    ?>
   </head>
   <body>
       <!-- Das Menu -->
        <h3>
        <p><a href="loadLevel.php">Spielen</a></p>
        <p><a href="highscores.php">Highscores</a></p>
        <form style="margin-top:2.5%; margin-bottom:2.5%;" background="gray" action="upload.php" method="post" enctype="multipart/form-data"> <!-- File Upload -->
            Eigenes Level hochloaden:
            <p>
                <input style="font-size:.7em" type="file" name="fileToUpload" id="fileToUpload">
                <input style="font-size:.7em" type="submit" value="Upload" name="submit">
            </p>
        </form>
        <p>Eingeloggt als <?php echo $_SESSION['name']; ?> <br><a href="index.php">Logout</a></p> <!-- Hier kann sich der Nutzer ausloggen -->
        </h3>
    </body>
</html>