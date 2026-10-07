export interface Palette {
  empty: string;
  snakeBody: string;
  snakeHead: string;
  fruit: string;
  wall: string;
}

function paletteCreator(
  empty: string,
  snakeBody: string,
  snakeHead: string,
  fruit: string,
  wall: string,
): Palette {
  return {
    empty,
    snakeBody,
    snakeHead,
    fruit,
    wall,
  };
}

export default {
  default: paletteCreator("blue", "#e2b8b4", "#dc7f8e", "white", "purple"),
};
