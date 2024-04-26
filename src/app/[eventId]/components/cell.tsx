import React from 'react';
import { GridChildComponentProps } from 'react-window';
import clsx from 'clsx';
import { EmptyCellType, OccupiedCellType } from 'app/[eventId]/interfaces/cell';
import { isEmptyCell, isOccupiedCell } from 'app/[eventId]/utils/cell';

type EmptyCellProps = {
  cell: EmptyCellType;
  isEditModeEnabled: boolean;
} & React.HTMLProps<HTMLDivElement>;

const EmptyCell: React.FC<EmptyCellProps> = ({ cell, isEditModeEnabled, ...rest }) => {
  return (
    <div
      className="flex items-center justify-center"
      {...rest}
    >
      <span className="flex h-1/2 w-4/5 rounded-md border-2 border-dashed border-gray-200 " />
    </div>
  );
};

export type FixedGridProps = {
  cells: (EmptyCellType | OccupiedCellType)[];
  isEditModeEnabled: boolean;
};

type CellProps = GridChildComponentProps<FixedGridProps>;

export const Cell: React.FC<CellProps> = ({ data, style, rowIndex, columnIndex }) => {
  const { cells, isEditModeEnabled } = data;
  const gridSize = Math.sqrt(data.cells.length);

  const cell = cells[gridSize * rowIndex + columnIndex];

  if (isEmptyCell(cell)) {
    return (
      <EmptyCell
        cell={cell}
        isEditModeEnabled={isEditModeEnabled}
        style={style}
      />
    );
  }

  const { type, orientation } = cell;

  // Tables can be connected if we have 2 or more with the same orientation in a row/column
  const hasTopBorder = (() => {
    if (orientation === 'x') {
      return true;
    }

    const cellAbove = cells[gridSize * (rowIndex - 1) + columnIndex];
    if (!cellAbove) {
      return true;
    }

    return !(isOccupiedCell(cellAbove) && cellAbove.orientation === orientation);
  })();

  const hasBottomBorder = (() => {
    if (orientation === 'x') {
      return true;
    }

    const cellBellow = cells[gridSize * (rowIndex + 1) + columnIndex];
    if (!cellBellow) {
      return true;
    }

    return !(isOccupiedCell(cellBellow) && cellBellow.orientation === orientation);
  })();

  const hasLeftBorder = (() => {
    if (orientation === 'y') {
      return true;
    }

    const cellLeft = cells[gridSize * rowIndex + columnIndex - 1];
    if (!cellLeft) {
      return true;
    }

    return !(isOccupiedCell(cellLeft) && cellLeft.orientation === orientation);
  })();

  const hasRightBorder = (() => {
    if (orientation === 'y') {
      return true;
    }

    const cellRight = cells[gridSize * rowIndex + columnIndex + 1];
    if (!cellRight) {
      return true;
    }

    return !(isOccupiedCell(cellRight) && cellRight.orientation === orientation);
  })();

  const cellHeight = (() => {
    if (orientation === 'x') {
      return 'h-1/2';
    }

    if (!hasTopBorder && !hasBottomBorder) {
      return 'h-full';
    }

    if ((hasTopBorder && !hasBottomBorder) || (!hasTopBorder && hasBottomBorder)) {
      return 'h-[90%]';
    }

    return 'h-4/5';
  })();

  const cellWidth = (() => {
    if (orientation === 'y') {
      return 'w-1/2';
    }

    if (!hasLeftBorder && !hasRightBorder) {
      return 'w-full';
    }

    if ((hasLeftBorder && !hasRightBorder) || (!hasLeftBorder && hasRightBorder)) {
      return 'w-[90%]';
    }

    return 'w-4/5';
  })();

  const alignment = (() => {
    if (orientation === 'x') {
      return 'items-center';
    }

    if (!hasTopBorder && !hasBottomBorder) {
      return 'items-center';
    }

    if (hasTopBorder && !hasBottomBorder) {
      return 'items-end';
    }

    if (!hasTopBorder && hasBottomBorder) {
      return 'items-start';
    }

    return 'items-center';
  })();

  const justification = (() => {
    if (orientation === 'y') {
      return 'justify-center';
    }

    if (!hasLeftBorder && !hasRightBorder) {
      return 'justify-center';
    }

    if (hasLeftBorder && !hasRightBorder) {
      return 'justify-end';
    }

    if (!hasLeftBorder && hasRightBorder) {
      return 'justify-start';
    }

    return 'justify-center';
  })();

  return (
    <button
      type="button"
      className={clsx(justification, alignment, 'flex rounded-sm')}
      style={{ ...style }}
    >
      {type === 'table' && (
        <div
          className={clsx(
            cellHeight,
            cellWidth,
            hasTopBorder && hasRightBorder && 'rounded-tr-md',
            hasTopBorder && hasLeftBorder && 'rounded-tl-md',
            hasBottomBorder && hasRightBorder && 'rounded-br-md',
            hasBottomBorder && hasLeftBorder && 'rounded-bl-md',
            hasTopBorder && 'border-t-2 border-t-blue-400',
            hasBottomBorder && 'border-b-2 border-b-blue-400',
            hasLeftBorder && 'border-l-2 border-l-blue-400',
            hasRightBorder && 'border-r-2 border-r-blue-400',
            'flex'
          )}
        />
      )}

      {type === 'bar' && <div className="flex size-1/2 rounded-full border-2 border-green-400" />}
    </button>
  );
};
