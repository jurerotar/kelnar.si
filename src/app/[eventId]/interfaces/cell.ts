import { Table } from 'interfaces/models/table';

export type BaseCell = {
  type: Table['type'] | 'empty';
  column: number;
  row: number;
};

export type EmptyCellType = Omit<BaseCell, 'type'> & {
  type: 'empty';
};

export type OccupiedCellType = Omit<BaseCell, 'type'> & Table;
