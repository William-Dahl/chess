/** @jsxRuntime classic */
/** @jsx jsx */
import { memo, ReactNode, useEffect, useRef, useState } from "react";

import { jsx, css } from "@emotion/react";
import isEqual from "lodash/isEqual";
import invariant from "tiny-invariant";

import { dropTargetForElements } from "@atlaskit/pragmatic-drag-and-drop/adapter/element";

import { canMove, coord, isCoord, PieceRecord } from "./Chessboard";

import { isPieceType } from "./Piece";

import { combine } from "@atlaskit/pragmatic-drag-and-drop/util/combine";
import { monitorForElements } from "@atlaskit/pragmatic-drag-and-drop/adapter/element";

interface SquareProps {
  pieces: PieceRecord[];
  location: coord;
  children: ReactNode;
}

const SquareStyles = css({
  width: "100%",
  height: "100%",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
});

const CircleIndicator = css`
  background-image: url("/circle.svg");
  background-repeat: no-repeat;
  background-position: center center;
  background-size: 20px 20px;
`;

type SquareState = "idle" | "validMove" | "invalidMove";

const Square = memo(function Square({
  pieces,
  location,
  children,
}: SquareProps) {
  const ref = useRef<HTMLImageElement | null>(null);
  const [state, setState] = useState<SquareState>("idle");
  const [hovered, setHovered] = useState<boolean>(false);

  useEffect(() => {
    const el = ref.current;
    invariant(el);

    return combine(
      dropTargetForElements({
        element: el,
        getData: () => ({ location }),
        getDropEffect: () => "move",
        canDrop: ({ source }) =>
          source.data.type === "grid-item" &&
          !isEqual(source.data.location, location),
        onDragEnter: () => setHovered(true),
        onDragLeave: () => setHovered(false),
        onDrop: () => setHovered(false),
      }),
      monitorForElements({
        onDragStart({ source }) {
          if (
            !isCoord(source.data.location) ||
            !isPieceType(source.data.pieceType) ||
            isEqual(source.data.location, location)
          )
            return;

          if (
            canMove(
              source.data.location,
              location,
              source.data.pieceType,
              pieces
            )
          )
            setState("validMove");
          else setState("invalidMove");
        },
        onDrop() {
          setState("idle");
        },
      })
    );
  }, [location]);

  const isDark = (location[0] + location[1]) % 2 === 1;

  let colour = isDark ? "lightgrey" : "white";
  if (state === "validMove" && hovered) {
    colour = "lightgreen";
  }
  if (state === "invalidMove" && hovered) {
    colour = "pink";
  }

  return (
    <div
      css={[SquareStyles, state == "validMove" && CircleIndicator]}
      style={{ backgroundColor: colour }}
      ref={ref}
    >
      {children}
    </div>
  );
});

export default Square;
