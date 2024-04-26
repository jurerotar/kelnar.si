import { useMemo, useRef } from 'react';
import { FixedSizeGrid } from 'react-window';
import { useEventListener } from 'usehooks-ts';
import { useViewport } from 'app/providers/viewport-context';
import { useTables } from 'app/[eventId]/hooks/use-tables';
import { Cell, FixedGridProps } from 'app/[eventId]/components/cell';
import { Table } from 'interfaces/models/table';
import { generateGrid } from 'app/[eventId]/utils/grid';
import { EmptyCellType, OccupiedCellType } from 'app/[eventId]/interfaces/cell';
import { useEditMode } from 'app/[eventId]/hooks/use-edit-mode';
import { useOrders } from 'app/[eventId]/hooks/use-orders';

const TILE_BASE_SIZE_DESKTOP = 110;
const TILE_BASE_SIZE_MOBILE = 80;

const size = 40;
const gridSize = size + 1;

export const EventPage = () => {
  const { tables } = useTables();
  const { orders } = useOrders();
  const { height, width, isWiderThanLg } = useViewport();
  const { isEditModeEnabled } = useEditMode();

  const tileSize = isWiderThanLg ? TILE_BASE_SIZE_DESKTOP : TILE_BASE_SIZE_MOBILE;

  const cells = useMemo<(EmptyCellType | OccupiedCellType)[]>(() => {
    const grid = generateGrid(size);

    return grid.map(({ row, column }) => {
      const table = tables.find(({ column: tableColumn, row: tableRow }: Table) => column === tableColumn && row === tableRow);
      if (!table) {
        return {
          type: 'empty',
          column,
          row,
        };
      }

      return {
        ...table,
        orders: orders.filter(({ tableId }) => tableId === table.id),
      };
    });
  }, [tables, orders]);

  const fixedGridData = useMemo<FixedGridProps>(() => {
    return {
      cells,
      isEditModeEnabled,
    };
  }, [cells, isEditModeEnabled]);

  const gridRef = useRef<HTMLDivElement>(null);
  const isScrolling = useRef<boolean>(false);
  const mouseDownPosition = useRef({
    x: 0,
    y: 0,
  });

  useEventListener(
    'mousedown',
    ({ clientX, clientY }) => {
      mouseDownPosition.current = {
        x: clientX,
        y: clientY,
      };

      isScrolling.current = true;
    },
    gridRef
  );

  useEventListener(
    'mousemove',
    ({ clientX, clientY }) => {
      if (!isScrolling.current || !gridRef.current) {
        return;
      }

      const deltaX = clientX - mouseDownPosition.current.x;
      const deltaY = clientY - mouseDownPosition.current.y;

      const currentX = gridRef.current.scrollLeft;
      const currentY = gridRef.current.scrollTop;

      mouseDownPosition.current = {
        x: clientX,
        y: clientY,
      };

      gridRef.current.scrollTo(currentX - deltaX, currentY - deltaY);
    },
    gridRef
  );

  useEventListener(
    'mouseup',
    () => {
      isScrolling.current = false;
    },
    gridRef
  );

  const headerSize = 4 * 16;
  const sidebarSize = 20 * 16;

  const initialScrollTop = tileSize * (size / 2) - (height - tileSize) / 2;
  const initialScrollLeft = tileSize * (size / 2) - (width - tileSize) / 2;

  return (
    <main className="bg-[#242424]">
      <FixedSizeGrid
        className="scrollbar-hidden"
        outerRef={gridRef}
        columnCount={gridSize}
        columnWidth={tileSize}
        rowCount={gridSize}
        rowHeight={tileSize}
        height={height - headerSize}
        width={width - sidebarSize}
        initialScrollTop={initialScrollTop}
        initialScrollLeft={initialScrollLeft}
        itemData={fixedGridData}
      >
        {Cell}
      </FixedSizeGrid>
    </main>
  );
};
