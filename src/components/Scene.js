import { Group, Colors, BoxGeometry, MeshPhongMaterial, Mesh, SmoothShading, Object3D } from "three";
import BasicLights from "./Lights.js";
import Piece from "./Piece";

export default class SeedScene extends Group {
  /**
   *
   * @param {HTMLElement} info
   */
  constructor(info) {
    super();
    this.info = info;

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
        const addPiece = (row, col, piece) => {
          const square = board[row][col];
          square.add(piece);
          piece.position.y += yAdjustment + 0.01;
          piece.pieceSquare = this.parsePosition(row, col);

          _this.pieces.push(piece);
          piece.on("click", ev => _this.onPieceClick(ev, _this));
        };

        switch (type) {
          case "Pawn": {
            const num = 8;
            const whites = initPieces(num, whiteMat);
            for (let i = 0; i < num; ++i) {
              addPiece(1, i, whites[i]);
            }

            const blacks = initPieces(num, blackMat);
            for (let i = 0; i < num; ++i) {
              addPiece(6, i, blacks[i]);
            }
            break;
          }
          case "Knight": {
            const num = 2;
            const whites = initPieces(num, whiteMat, "White");
            whites.forEach(knight => knight.rotateY(Math.PI / 2));
            addPiece(0, 1, whites[0]);
            addPiece(0, 6, whites[1]);

            const blacks = initPieces(num, blackMat);
            blacks.forEach(knight => knight.rotateY(-Math.PI / 2));
            addPiece(7, 1, blacks[0]);
            addPiece(7, 6, blacks[1]);
            break;
          }
          case "Bishop": {
            const num = 2;
            const whites = initPieces(num, whiteMat);
            addPiece(0, 2, whites[0]);
            addPiece(0, 5, whites[1]);

            const blacks = initPieces(num, blackMat);
            addPiece(7, 2, blacks[0]);
            addPiece(7, 5, blacks[1]);
            break;
          }
          case "Rook": {
            const num = 2;
            const whites = initPieces(num, whiteMat);
            addPiece(0, 0, whites[0]);
            addPiece(0, 7, whites[1]);

            const blacks = initPieces(num, blackMat);
            addPiece(7, 0, blacks[0]);
            addPiece(7, 7, blacks[1]);
            break;
          }
          case "Queen": {
            const num = 1;
            const whites = initPieces(num, whiteMat);
            addPiece(0, 3, whites[0]);

            const blacks = initPieces(num, blackMat);
            addPiece(7, 3, blacks[0]);
            break;
          }
          case "King": {
            const num = 1;
            const whites = initPieces(num, whiteMat);
            addPiece(0, 4, whites[0]);

            const blacks = initPieces(num, blackMat);
            addPiece(7, 4, blacks[0]);
            break;
          }
        }
      });
    });
  }

  initSquareGeometry() {
    const geom = new BoxGeometry(1, 0.05, 1);
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
        square.on("click", ev => this.onSquareClick(ev, this));
        row.push(square);
      }
      squares.push(row);
    }

    return squares;
  }

  parseRealPosition(row, col) {
    return this.parsePosition(row + 4, 6 - col);
  }

  parsePosition(row, col) {
    const aCode = "a".charCodeAt(0);
    const oneCode = "1".charCodeAt(0);
    return String.fromCharCode(aCode + col, oneCode + row);
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
    const _this = this;
    objects.forEach(objArr => objArr.forEach(obj => _this.add(obj)));
  }

  onPieceClick(ev, scene) {
    ev.stopPropagation();
    scene.setSelectedPiece(ev.target);
  }

  /**
   *
   * @param {Piece} piece
   */
  setSelectedPiece(piece) {
    this.selectedPiece = piece;
    if (piece) {
      this.setInfo(`${piece.pieceType}: ${piece.pieceSquare}`);
    } else {
      //this.setInfo("");
    }
  }

  setInfo(text) {
    this.info.textContent = text;
  }

  onSquareClick(ev, scene) {
    ev.stopPropagation();
    const _this = ev.target;
    if (!scene.selectedPiece || _this.children.length > 0) {
      return;
    }

    scene.movePiece(scene.selectedPiece.parent, _this);
    scene.setSelectedPiece(null);
  }

  /**
   *
   * @param {Piece} piece
   * @param {Mesh} from
   * @param {Mesh} to
   */
  movePiece(from, to) {
    const source = from.position;
    const target = to.position;
    if (source.z != target.z) {
      return;
    }

    const piece = from.children[0];
    const distance = target.x - source.x;
    const sourceParsed = this.parseRealPosition(source.x, source.z);
    const targetParsed = this.parseRealPosition(target.x, target.z);
    this.setInfo(`${piece.pieceType} from ${sourceParsed} to ${targetParsed}`);
    piece.move(distance, () => {
      piece.position.x = 0;
      piece.pieceSquare = targetParsed;
      to.add(piece);
      from.children.pop();
    });
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
