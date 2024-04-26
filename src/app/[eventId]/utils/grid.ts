export const generateGrid = (size: number) => {
  let xCoordinateCounter: number = -size / 2 - 1;
  let yCoordinateCounter: number = size / 2;

  return [...Array((size + 1) ** 2)].flatMap(() => {
    xCoordinateCounter += 1;
    const column = xCoordinateCounter;
    const row = yCoordinateCounter;

    // When we reach the end of a row, decrease y and reset x coordinate counters
    if (xCoordinateCounter === size / 2) {
      xCoordinateCounter = -size / 2 - 1;
      yCoordinateCounter -= 1;
    }

    return {
      row,
      column,
    };
  });
};
