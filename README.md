# WebGL Chess

Proof of concept for chess using WebGL2 with Three.js

## Resources

Template for three project with webpack acquired from [three-seed](https://github.com/edwinwebb/three-seed)  
Models for chess pieces acquired from [free3d](https://free3d.com/3d-model/chessboard-716865.html)  
Favicon acquired from [iconarchive](http://www.iconarchive.com/show/orb-os-x-icons-by-osullivanluke/Chess-icon.html)
Board created with help of [codepen](https://codepen.io/foolof41/details/ALXKjp)

## Install
Before you begin, make sure you are comfortable with terminal commands and have [Node and NPM installed](https://www.npmjs.com/get-npm).

## Running
In terminal at that folder type, `npm install` to set things up. To get going run: `npm start`.

## How to use
Selection:
You can select piece by click with left mouse button.
After selection piece will display light (Spotlight) from itself.
You can choose spotlight target position with 'Spotlight' menu options.

Move: 
You can move piece by clicking on it and choosing desired square, but only forward or backward (no moves right or left).
You can't move piece to square occupied by other piece, but you can go through it.
You can also move piece with 'W' and 'S' keys, but piece have to be selected first (useful with fpCamera).

Rotation:
You can turn on/off piece rotation by clicking on it with right mouse button.
Rotation also rotates spotlight if piece is selected.

Most of the options are accessible in the menu to the right.
Camera:
    - focal length - focal length for current camera
	- movingCamera - most flexible camera, you can move it, while holding left mouse button, 
		also you can drift away from chessboard by using mouse scroll (either scroll or click scroll and move mouse)
	- staticCamera - immovable camera with fixed position and rotation
	- followCamera - camera with fixed position, which follows current piece move
	- fpCamera - first person camera, set on selected piece (if no, then static)
Spotlight - position selected piece spotlight target
Shading - switch between Phong and Gouraud shading
Light model - switch between Phong and Phong-Blinn light model
Toggle fog - turn the fog on/off - on by default
Toggle day-night - turn day-night cycle on/off - off by default

Additional information on performed actions are displayed in left corner of the canvas.

