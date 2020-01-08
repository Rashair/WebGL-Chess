# WebGL Chess

Proof of concept for chess using WebGL with Three.js

## Resources

Template for three project with webpack acquired from [three-seed](https://github.com/edwinwebb/three-seed)  
Models for chess pieces acquired from [free3d](https://free3d.com/3d-model/chessboard-716865.html)  
Favicon acquired from [iconarchive](http://www.iconarchive.com/show/orb-os-x-icons-by-osullivanluke/Chess-icon.html)
Board created with help of [codepen](https://codepen.io/foolof41/details/ALXKjp)

## Install

Before you begin, make sure you are comfortable with terminal commands and have [Node and NPM installed](https://www.npmjs.com/get-npm).

### Install via Download

In terminal at that folder type `npm install` to set things up. To get going run: `npm start`.

## Running the development server

To see the changes you make to the starter project go to the project folder in terminal and type...

```bash
npm start
```

This command will bundle the project code and start a development server at [http://localhost:8080/](http://localhost:8080/). Visit this in your web browser; every time you make changes to the code the page will refresh. Congratulations, you are good to go!

## Editing the code

The first file you should open is `./objects/Scene.js`. In it you will find the three objects comprising the world represented in your browser. The flower, the island, and the lights illuminating them are each represented as a javascript file in the `./object/s` folder. Open these, edit them and see your changes in the browser. If something goes wrong a message will displayed in the debug console of the browser.

## Importing local files

Local files, such as images and 3D models, are imported into the application as URLs then loaded asynchronously with three.js. Most common files that three.js uses are supported. Shader files are loaded as raw text. For more information about this system see the [webpack site](https://webpack.js.org/).

## About the models

Both models were exported from the [free 3D software Blender](https://www.blender.org/) using the [three.js exporter](https://github.com/timoxley/threejs/tree/master/utils/exporters/blender). They were downloaded from the Google Poly project.

## Building the project for the web

Once you are happy with your project you'll be sure to want to show it off. Running `npm run build` in terminal will bundle your project into the folder `./build/`. You can upload this directory to a web server. For more complex results read [this guide](https://webpack.js.org/guides/production/).
