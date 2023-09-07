/** @jsxRuntime classic */
/** @jsx jsx */
import { useEffect, useState } from "react";

import { jsx, css } from "@emotion/react";
import isEqual from "lodash/isEqual";

import { monitorForElements } from "@atlaskit/pragmatic-drag-and-drop/adapter/element";

import { GetPiece, isPieceType, PIECE_TYPE } from "./Piece";
import Square from "./Square";

export type coord = [number, number];

export type PieceRecord = {
  type: PIECE_TYPE;
  location: coord;
};

export const isCoord = (token: any): token is coord =>
  Array.isArray(token) &&
  token.length == 2 &&
  token.every((val) => typeof val === "number");

const BoardContainerStyles = css({
  display: "grid",
  gridTemplateColumns: "repeat(8, 1fr)",
  gridTemplateRows: "repeat(8, 1fr)",
  width: "600px",
  height: "600px",
  border: "3px solid lightgrey",
});

export const canMove = (
  start: coord,
  destination: coord,
  pieceType: PIECE_TYPE,
  pieces: PieceRecord[]
) => {
  const rowDist = Math.abs(start[0] - destination[0]);
  const colDist = Math.abs(start[1] - destination[1]);

  if (pieces.find((piece) => isEqual(piece.location, destination)))
    return false;

  switch (pieceType) {
    case PIECE_TYPE.King:
      return [0, 1].includes(rowDist) && [0, 1].includes(colDist);
    case PIECE_TYPE.Pawn:
      return colDist === 0 && start[0] - destination[0] === -1;
    default:
      return false;
  }
};

const Chessboard = () => {
  const [pieces, setPieces] = useState<PieceRecord[]>([
    { type: PIECE_TYPE.King, location: [3, 3] },
    { type: PIECE_TYPE.Pawn, location: [1, 6] },
  ]);

  useEffect(() => {
    return monitorForElements({
      onDrop({ source, location }) {
        const destination = location.current.dropTargets[0];
        if (!destination) return;

        const destinationLocation = destination.data.location;
        const sourceLocation = source.data.location;

        if (
          !isCoord(destinationLocation) ||
          !isCoord(sourceLocation) ||
          !isPieceType(source.data.pieceType)
        )
          return;

        const piece = pieces.find((p) => isEqual(p.location, sourceLocation));
        const restOfPieces = pieces.filter((p) => p !== piece);

        if (
          canMove(
            sourceLocation,
            destinationLocation,
            source.data.pieceType,
            pieces
          ) &&
          piece !== undefined
        ) {
          setPieces([
            { type: piece.type, location: destinationLocation },
            ...restOfPieces,
          ]);
        }
      },
    });
  }, [pieces]);

  const renderBoard = () => {
    const squares = [];
    for (let row = 0; row < 8; row++) {
      for (let col = 0; col < 8; col++) {
        const piece = pieces.find((piece) =>
          isEqual(piece.location, [row, col])
        );

        squares.push(
          <Square pieces={pieces} key={`${row}-${col}`} location={[row, col]}>
            {piece && GetPiece({ type: piece.type, location: [row, col] })}
          </Square>
        );
      }
    }
    return squares;
  };

  return <div css={BoardContainerStyles}>{renderBoard()}</div>;
};

export default Chessboard;
