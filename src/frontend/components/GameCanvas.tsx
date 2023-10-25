import React, { useEffect, useRef } from "react";
import { Vec2 } from "../infra/LinAlg";

interface GameProps {
  canvasSize: Vec2;
  onCanvasLoaded: (canvas: HTMLCanvasElement) => void;
}

const GameCanvas: React.FC<GameProps> = (props) => {

  // get canvas and pass to setupGame
  const canvasRef = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    const canvas = canvasRef.current;
    if (canvas) {
      props.onCanvasLoaded(canvas);
    }
  }, []);

  return (
    <canvas ref={canvasRef} width={props.canvasSize.x} height={props.canvasSize.y} tabIndex={0}/>
  );
};
export default GameCanvas;
