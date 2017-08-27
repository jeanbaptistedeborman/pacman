pacman

A pacamanlike game on the languages in the EU.

Preview URL (Master branch) :

http://linguagopreview.azurewebsites.net/
Integration in Europa template : http://linguagopreview.azurewebsites.net/index_europa.htm
Dev / test URL (Dev branch) :

http://devlinguago.azurewebsites.net/

Documentation (Jsdoc) : http://devlinguago.azurewebsites.net/documentation/

---------------------------
* INTEGRATION IN WEB PAGE:*
---------------------------
Use the page http://linguagopreview.azurewebsites.net/ as example.

1: Put the folder "dist_linguago" and its content next to the page.

2: Add the fonts at the beginnig of the page.

    <style>
        @font-face {
            font-family: 'AppFont';
            src: url('dist_linguago/lucida_sans.ttf') format('truetype');
        }
    </style>

3: Add an empty container for the application
    - id attribute must be "linguagoApplication".
    - The application will adapt itself to the the size of the container.

    <div id="linguagoApplication"></div>

4: After the container, add a script-tag to load the application:

    <script src="dist_linguago/linguago_bundle.js"></script>

5: Set the language by using the "lang"-attribute of the HTML-tag. (Defaults to EN if not set)

    <html lang="fr">
