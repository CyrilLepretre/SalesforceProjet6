# SalesforceProjet6
OCR - Poch Lib

# How to install
1. Go to a folder
1. Get sources from Github with the command 
  `git clone https://github.com/CyrilLepretre/SalesforceProjet6.git`
1. Go to "SalesforceProjet6" folder created during previous step
1. From this folder, install WebPack, Babel and loaders with the command 
	`npm install webpack webpack-cli webpack-dev-server babel-loader @babel/core @babel/preset-env babel-polyfill style-loader css-loader sass-loader node-sass --save-dev`
1. Download FontAwesome v5.12.1-web from https://fontawesome.com/ and unzip it into "SalesforceProjet6" folder
   + *For others versions of FontAwesome, just update index.html line "<link rel="stylesheet" href="/fontawesome-free-5.12.1-web/css/all.min.css">" with your FontAwesome folder*
1. From "SalesforceProjet6" folder launch command :
  `npm start`
1. Open a web browser and go to **localhost:8080**
   + *The port may be different, in this case, the port used will be given when npm start is launched*
