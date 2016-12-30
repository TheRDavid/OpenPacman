<!--
    
Autor:  David Rosenbusch (m21898)
upload.php Hier wird eine Spieledatei vom Rechner des Nutzers hochgeladen
    
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
            
            // Zielordner
            $target_dir = "levels/";
            
            // Datei selbst
            $target_file = $target_dir . basename($_FILES["fileToUpload"]["name"]);
            $uploadOk = 1;
            $imageFileType = pathinfo($target_file,PATHINFO_EXTENSION);
            
            // Upload erfolgreich?
            if(isset($_POST["submit"])) {
                 echo "<h3>";
                // Allow certain file formats
                if($imageFileType != "csv") {
                    echo "Du musst eine CSV - Datei ausw&auml;hlen!";
                    $uploadOk = 0;
                } 
                if($uploadOk == 1)
                    if (move_uploaded_file($_FILES["fileToUpload"]["tmp_name"], $target_file)) {
                        echo "Die Datei ". basename( $_FILES["fileToUpload"]["name"]). " wurde erfolgreich hochgeladen. Jetzt kann sie jeder spielen.";
                    } else {
                        echo "Sorry, da ist was schiefgelaufen ;(";
                    }
                    
                 echo "</h3>";
            }
        ?> 
        </head>
   <body>
       <h3>
       <p align="center">
           <!-- Link zurueck zum Hauptmenue --> 
           <a href='menu.php?welcome=Willkommen <?php echo $_SESSION["name"]; ?>'>Zur&uuml;ck zum Hauptmen&uuml;</p></a>
        </p>
        </h3>
   </body>
</html>