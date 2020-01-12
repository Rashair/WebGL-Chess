import { Group, Colors, BoxGeometry, MeshPhongMaterial, Mesh, SmoothShading, Object3D } from "three";
import BasicLights from "./Lights.js";
import Piece from "./Piece";

export default class SeedScene extends Group {
  constructor() {
    super();

    const lights = new BasicLights();
    this.add(lights);

    const whiteMat = new MeshPhongMaterial({
      color: 0xffffff,
      shading: SmoothShading,
      shininess: 13,
      specular: 0xffffff,
    });
    const blackMat = new MeshPhongMaterial({
      color: 0x303030,
      shading: SmoothShading,
      shininess: 140,
      specular: 0x101010,
    });

    const squareGeom = this.initSquareGeometry();
    const board = this.initializeBoard(squareGeom, whiteMat, blackMat);
    this.addAll(board);

    const squareTopY = squareGeom.boundingBox.min.y;
    const piecesLoading = this.loadPieces();
    const _this = this;
    Promise.all(piecesLoading).then(pieceObjects => {
      _this.pieces = new Array(32);
      pieceObjects.forEach(piece => {
        const type = piece.pieceType;
        const mesh = piece.pieceMesh;
        const yAdjustment = squareTopY - piece.getMinY();
        const initPieces = (num, mat, colour = null) => {
          const piecesArr = new Array(num);
          for (let i = 0; i < num; ++i) {
            piecesArr[i] = new Piece(type, false);
            piecesArr[i].addPieceMesh(mesh.clone(), mat);
            piecesArr[i].pieceColour = colour;
          }
          return piecesArr;
        };
        const addPieceToBoard = (row, col, piece) => {
          board[row][col].add(piece);
          piece.position.y += yAdjustment;
          _this.pieces.push(piece);
        };

        switch (type) {
          case "Pawn": {
            const num = 8;
            const whites = initPieces(num, whiteMat);
            for (let i = 0; i < num; ++i) {
              addPieceToBoard(1, i, whites[i]);
            }

            const blacks = initPieces(num, blackMat);
            for (let i = 0; i < num; ++i) {
              addPieceToBoard(6, i, blacks[i]);
            }
            break;
          }
          case "Knight": {
            const num = 2;
            const whites = initPieces(num, whiteMat, "White");
            whites.forEach(knight => knight.rotateY(Math.PI / 2));
            addPieceToBoard(0, 1, whites[0]);
            addPieceToBoard(0, 6, whites[1]);

            const blacks = initPieces(num, blackMat);
            blacks.forEach(knight => knight.rotateY(-Math.PI / 2));
            addPieceToBoard(7, 1, blacks[0]);
            addPieceToBoard(7, 6, blacks[1]);
            break;
          }
          case "Bishop": {
            const num = 2;
            const whites = initPieces(num, whiteMat);
            addPieceToBoard(0, 2, whites[0]);
            addPieceToBoard(0, 5, whites[1]);

            const blacks = initPieces(num, blackMat);
            addPieceToBoard(7, 2, blacks[0]);
            addPieceToBoard(7, 5, blacks[1]);
            break;
          }
          case "Rook": {
            const num = 2;
            const whites = initPieces(num, whiteMat);
            addPieceToBoard(0, 0, whites[0]);
            addPieceToBoard(0, 7, whites[1]);

            const blacks = initPieces(num, blackMat);
            addPieceToBoard(7, 0, blacks[0]);
            addPieceToBoard(7, 7, blacks[1]);
            break;
          }
          case "Queen": {
            const num = 1;
            const whites = initPieces(num, whiteMat);
            addPieceToBoard(0, 3, whites[0]);

            const blacks = initPieces(num, blackMat);
            addPieceToBoard(7, 3, blacks[0]);
            break;
          }
          case "King": {
            const num = 1;
            const whites = initPieces(num, whiteMat);
            addPieceToBoard(0, 4, whites[0]);

            const blacks = initPieces(num, blackMat);
            addPieceToBoard(7, 4, blacks[0]);
            break;
          }
        }
      });
    });
  }

  initSquareGeometry() {
    const geom = new BoxGeometry(1, 0.03, 1);
    geom.computeFaceNormals();
    geom.vertices.forEach(function(v) {
      if (v.y > 0) {
        v.x *= 0.975;
        v.z *= 0.975;
      }
    });
    geom.computeBoundingBox();

    return geom;
  }

  initializeBoard(squareGeom, whiteMat, blackMat) {
    const squares = [];
    for (let x = -4; x < 4; ++x) {
      const row = [];
      for (let z = 6; z > -2; --z) {
        const square = new Mesh(squareGeom, (x + z) % 2 == 0 ? whiteMat : blackMat);
        square.position.x = x;
        square.position.z = z;
        row.push(square);
      }
      squares.push(row);
    }

    return squares;
  }

  loadPieces() {
    const pawn = new Piece("Pawn");
    const knight = new Piece("Knight");
    const bishop = new Piece("Bishop");
    const rook = new Piece("Rook");
    const queen = new Piece("Queen");
    const king = new Piece("King");
    const pieceLoading = [
      pawn.loadPromise,
      knight.loadPromise,
      bishop.loadPromise,
      rook.loadPromise,
      queen.loadPromise,
      king.loadPromise,
    ];

    return pieceLoading;
  }

  /**
   *
   * @param {Object3D[][]} objects
   */
  addAll(objects) {
    const This = this;
    objects.forEach(objArr => objArr.forEach(obj => This.add(obj)));
  }

  update(timeStamp) {
    if (!this.pieces) {
      return;
    }

    // this.pieces.forEach(piece => {
    //   if (piece.pieceType === "Knight" && piece.pieceColour === "White") {
    //     piece.rotation.y = timeStamp / 1000;
    //   }
    // });
  }
}
