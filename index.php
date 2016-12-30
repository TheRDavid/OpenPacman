<!--
    
Autor:  David Rosenbusch (m21898)
index.php Zeigt einen einfachen Anmeldebildschirm, bei dem sich der Nutzer einen beliebigen Namen geben kann.
    
-->
<!DOCTYPE HTML>
<html>
  <head>
      <!-- Stylesheets -->
      <link rel="stylesheet" href="css/reset.css">
      <link rel="stylesheet" href="css/style.css">
      <?php
            // Alte Session auf jeden Fall zerstoeren
            session_start();
            session_destroy();
      ?>
    <script>
        // Kurzes Script, welches bei Eingabe des Namens direkt den Willkommensgruss formuliert
        function writeWelcome()
        {
            document.nameForm.welcome.value = "Willkommen "+document.nameForm.welcome.value;
        }
    </script>
    <title>Open Pacman</title>
   </head>
   <body>
       <h1 style="margin-top: 10%">Open Pac-Man</h1> <!-- Name der Seite -->
       <p style="margin-bottom: 5%"  align="center">Von David Rosenbusch</p>
       
       <!-- Formular zum Eingeben des Namens -->
        <form name="nameForm" action="menu.php" method="GET" onsubmit="writeWelcome()">
            <h3>
            <p>W&auml;hle einen Namen: <input style="font-size:.7em" name="welcome"></p>
            <p style="margin-top: 2%"><input style="font-size:.7em" type="submit" value="Alles klar"></p>
            </h3>
        </form>
        
    </body>
</html>
