/** @jsxRuntime classic */
/** @jsx jsx */
import { Fragment, memo, useEffect, useRef, useState } from "react";

import { css, jsx } from "@emotion/react";
import invariant from "tiny-invariant";

import { draggable } from "@atlaskit/pragmatic-drag-and-drop/adapter/element";

import king from "../../public/king.png";
import pawn from "../../public/pawn.png";

export enum PIECE_TYPE {
  King,
  Pawn,
}

export const isPieceType = (token: any): token is PIECE_TYPE => {
  return Object.values(PIECE_TYPE).includes(token);
};

const ImageSizeStyles = css({
  width: 60,
  height: 60,
});

const HidePieceStyles = css({
  opacity: 0,
});

const Piece = memo(function Piece({
  location,
  pieceType,
  image,
  alt,
}: {
  location: [number, number];
  pieceType: PIECE_TYPE;
  image: string;
  alt: string;
}) {
  const ref = useRef<HTMLImageElement | null>(null);
  const [dragging, setDragging] = useState<boolean>(false);

  useEffect(() => {
    const el = ref.current;
    invariant(el);

    return draggable({
      element: el,
      getInitialData: () => ({ type: "grid-item", location, pieceType }),
      onDragStart: () => setDragging(true),
      onDrop: () => setDragging(false),
    });
  }, [location, pieceType]);

  return (
    <img
      css={[dragging && HidePieceStyles, ImageSizeStyles]}
      src={image}
      alt={alt}
      ref={ref}
    />
  );
});

export const King = ({ location }: { location: [number, number] }) => (
  <Piece
    location={location}
    pieceType={PIECE_TYPE.King}
    image={king.src}
    alt="King"
  />
);

export const Pawn = ({ location }: { location: [number, number] }) => (
  <Piece
    location={location}
    pieceType={PIECE_TYPE.Pawn}
    image={pawn.src}
    alt="Pawn"
  />
);

export const GetPiece = ({
  type,
  location,
}: {
  type: PIECE_TYPE;
  location: [number, number];
}): JSX.Element => {
  switch (type) {
    case PIECE_TYPE.King:
      return <King location={location} />;
    case PIECE_TYPE.Pawn:
      return <Pawn location={location} />;
    default:
      return <Fragment></Fragment>; // return nothing if type is invalid
  }
};
