A pacmanlike javascript game on the languages in the EU.
The javascript code is commented inline using jsdoc standard.

------
*URLS*
------
* Github:
        https://github.com/jeanbaptistedeborman/pacman/
* Preview URL (Master branch):
        http://linguagopreview.azurewebsites.net/
* Integration in Europa template :
        http://linguagopreview.azurewebsites.net/index_europa.htm
* Dev / test URL (Dev branch) :
        http://devlinguago.azurewebsites.net/
* Documentation (Jsdoc) :
        http://devlinguago.azurewebsites.net/documentation/

---------------------------
* INTEGRATION IN WEB PAGE:*
---------------------------

* Example page:
                http://linguagopreview.azurewebsites.net/index.html

1: Download the latest version from github (or checkout the project):
    https://github.com/jeanbaptistedeborman/pacman/archive/master.zip

2: Put the folder "dist_linguago" and its content next to the page. The other folders are not meant for production.

3: Add the fonts at the beginnig of the page.

    <style>
        @font-face {
            font-family: 'AppFont';
            src: url('dist_linguago/lucida_sans.ttf') format('truetype');
        }
    </style>

4: Add an empty container for the application
    - id attribute must be "linguagoApplication".
    - The application will adapt itself to the the size of the container.

    <div id="linguagoApplication"></div>

5: After the container, add the script-tag that loads the application:

    <script src="dist_linguago/linguago_bundle.js"></script>

6: Set the language by using the "lang"-attribute of the HTML-tag of the page. (Defaults to EN if not set)

    <html lang="fr">


------------
* COMMANDS:*
------------
This application relies on node.js and npm. Run npm install to get the needed dependencies.
  * npm run build: generates a new build
  * npm run doc: regenerates the documentation



