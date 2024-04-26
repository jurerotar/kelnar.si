import { BaseCell, EmptyCellType, OccupiedCellType } from 'app/[eventId]/interfaces/cell';

export const isEmptyCell = (cell: BaseCell): cell is EmptyCellType => {
  return cell.type === 'empty';
};

export const isOccupiedCell = (cell: BaseCell): cell is OccupiedCellType => {
  return cell.type !== 'empty';
};
