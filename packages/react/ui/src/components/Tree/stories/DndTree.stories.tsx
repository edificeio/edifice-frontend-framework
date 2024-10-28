import {
  DndContext,
  DragEndEvent,
  DragOverEvent,
  DragStartEvent,
  KeyboardSensor,
  PointerSensor,
  TouchSensor,
  useDraggable,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import { snapCenterToCursor } from "@dnd-kit/modifiers";
import { Meta, StoryObj } from "@storybook/react";
import { useState } from "react";
import { Card } from "../..";
import { useToast } from "../../..";
import {
  findNodeById,
  getAncestors,
  getChildrenIds,
} from "../../../utils/tree";
import DndTree from "../components/DndTree";
import { DndTreeProps } from "../types";

// More on default export: https://storybook.js.org/docs/react/writing-stories/introduction#default-export
const meta: Meta<typeof DndTree> = {
  title: "Components/Tree/DndTree",
  component: DndTree,
  args: {
    nodes: [
      {
        id: "default",
        name: "Section Element",
        section: true,
        children: [
          {
            id: "1",
            name: "level 1 arborescence tree",
            children: [
              {
                id: "4",
                name: "level 2 arborescence tree",
                children: [
                  {
                    id: "8",
                    name: "level 3 arborescence tree",
                    children: [
                      {
                        id: "12",
                        name: "level 4 arborescence tree",
                      },
                      {
                        id: "13",
                        name: "level 4 arborescence tree",
                      },
                    ],
                  },
                  {
                    id: "9",
                    name: "level 3 arborescence tree",
                  },
                ],
              },
              {
                id: "5",
                name: "level 2 arborescence tree",
                children: [
                  {
                    id: "10",
                    name: "level 3 arborescence tree",
                  },
                  {
                    id: "11",
                    name: "level 3 arborescence tree",
                  },
                ],
              },
            ],
          },
          {
            id: "2",
            name: "level 1 arborescence tree",
            children: [
              {
                id: "6",
                name: "level 2 arborescence tree",
              },
              {
                id: "7",
                name: "level 2 arborescence tree",
              },
            ],
          },
          {
            id: "3",
            name: "level 1 arborescence tree",
          },
        ],
      },
      {
        id: "root-2",
        name: "Section Element 2",
        section: true,
        children: [
          {
            id: "232",
            name: "level 1 arborescence tree",
            children: [
              {
                id: "61",
                name: "level 2 arborescence tree",
              },
              {
                id: "71",
                name: "level 2 arborescence tree",
              },
            ],
          },
        ],
      },
    ],
    renderNode: (payload) => (
      <div className="d-flex align-items-center gap-8">
        {payload?.node?.name}
      </div>
    ),
  },
};

export default meta;

type Story = StoryObj<typeof DndTree>;

const nodesSummary = [
  {
    id: "uuid-1",
    name: "level 1 arborescence tree",
    folderIds: [],
  },
  {
    id: "uuid-2",
    name: "level 1 arborescence tree",
    folderIds: [],
  },
  {
    id: "uuid-3",
    name: "level 1 arborescence tree",
    folderIds: [],
  },
  {
    id: "uuid-4",
    name: "level 2 arborescence tree",
    folderIds: [],
  },
  {
    id: "uuid-5",
    name: "level 2 arborescence tree",
    folderIds: [],
  },
  {
    id: "uuid-7",
    name: "level 2 arborescence tree",
    folderIds: [],
  },
  {
    id: "uuid-8",
    name: "level 3 arborescence tree",
    folderIds: [],
  },
  {
    id: "uuid-9",
    name: "level 3 arborescence tree",
    folderIds: [],
  },
  {
    id: "uuid-10",
    name: "level 3 arborescence tree",
    folderIds: [],
  },
];

const ResourceCard = ({ id }: { id: string }) => {
  const {
    attributes,
    listeners,
    setNodeRef: setDraggableRef,
    transform,
  } = useDraggable({
    id,
    data: {
      id,
      type: "resource",
    },
  });

  const styles = {
    transform: `translate3d(${(transform?.x ?? 0) / 1}px, ${
      (transform?.y ?? 0) / 1
    }px, 0)`,
  } as React.CSSProperties;

  return (
    <div ref={setDraggableRef} {...listeners} {...attributes} style={styles}>
      <Card isSelectable={false} isClickable={false}>
        <Card.Body>
          <Card.Title>{id}</Card.Title>
        </Card.Body>
      </Card>
    </div>
  );
};

export const Base: Story = {
  render: (args: DndTreeProps) => {
    const DELAY = 175;
    const TOLERANCE = 10;

    const [elementDragOver, setElementDragOver] = useState({
      isOver: false,
      isTreeview: false,
      canMove: true,
      overId: undefined,
    });

    const [isDraggable, setIsDraggable] = useState({
      isDrag: false,
      elementDrag: undefined,
    });

    const [selectedNodeId, setSelectedNodeId] = useState<string | null>(null);

    const activationConstraint = {
      delay: DELAY,
      tolerance: TOLERANCE,
    };

    const mouseSensor = useSensor(PointerSensor, {
      activationConstraint,
    });
    const touchSensor = useSensor(TouchSensor, {
      activationConstraint,
    });
    const keyboardSensor = useSensor(KeyboardSensor);
    const sensors = useSensors(mouseSensor, touchSensor, keyboardSensor);

    const toast = useToast();

    const handleDragEnd = async (event: DragEndEvent) => {
      const { over, active } = event;

      const elementOver = over?.data.current;
      const elementActive = active.data.current;
      const ancestors = getAncestors(args.nodes, elementOver?.id);
      const childrenIds = getChildrenIds(args.nodes, elementOver?.id);

      if (
        elementActive?.id == elementOver?.id ||
        ancestors.includes(elementActive?.id) ||
        childrenIds.includes(elementActive?.id)
      ) {
        return;
      } else {
        const folderName = elementOver?.name;

        if (over) {
          try {
            console.log("try");
            /* await moveItem.mutate(elementOver?.id);
            notifySuccess(active, folderName); */
            toast.success(`${folderName} was moved`);
          } catch (e) {
            console.error(e);
          } finally {
            setElementDragOver({
              isOver: false,
              overId: undefined,
              canMove: true,
              isTreeview: false,
            });
          }
        }
      }
      setIsDraggable({ isDrag: false, elementDrag: undefined });
    };

    const handleDragStart = (event: DragStartEvent) => {
      const { active } = event;
      const elementActive = active.data.current;

      console.log("handleDragStart", { elementActive });

      setIsDraggable({
        isDrag: true,
        elementDrag: elementActive?.id,
      });
    };

    const handleDragOver = (event: DragOverEvent) => {
      console.log("handleDragOver");
      const { over, active } = event;

      const elementOver = over?.data.current;
      const elementActive = active?.data.current;
      const ancestors = getAncestors(args.nodes, elementOver?.id);
      const childrenIds = getChildrenIds(args.nodes, elementOver?.id);

      if (over) {
        const dragOver = {
          isOver: true,
          canMove: false,
          overId: elementOver?.id,
          isTreeview: elementOver?.isTreeview,
        };

        if (
          elementActive?.id === elementOver?.id ||
          ancestors.includes(elementActive?.id) ||
          childrenIds.includes(elementActive?.id)
        ) {
          setElementDragOver({ ...dragOver, canMove: false });
        } else {
          setElementDragOver({ ...dragOver, canMove: true });
        }
      } else {
        setElementDragOver({
          isOver: false,
          overId: undefined,
          canMove: true,
          isTreeview: false,
        });
      }
    };

    const handleTreeItemClick = (nodeId: string) => {
      setSelectedNodeId(nodeId);
    };

    const handleOnTreeItemUnfold = (nodeId: string) => {
      const folder = findNodeById(args.nodes, nodeId);
      const hasSomeChildrenWithChildren = folder?.children?.some(
        (child) => Array.isArray(child?.children) && child.children?.length > 0,
      );

      folder?.children?.forEach((child) => {
        if (hasSomeChildrenWithChildren) return;
        console.log({ child });
      });
    };

    return (
      <DndContext
        sensors={sensors}
        modifiers={[snapCenterToCursor]}
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
        onDragOver={handleDragOver}
      >
        <div className="d-flex align-items-center gap-16 justify-content-between">
          <DndTree
            nodes={args.nodes}
            selectedNodeId={selectedNodeId}
            draggedNode={
              elementDragOver?.isTreeview ? elementDragOver : undefined
            }
            onTreeItemClick={handleTreeItemClick}
            onTreeItemUnfold={handleOnTreeItemUnfold}
          />
          <div className="d-flex flex-wrap gap-8">
            {nodesSummary.map((node) => (
              <ResourceCard id={node.id} />
            ))}
          </div>
        </div>
      </DndContext>
    );
  },
  parameters: {
    docs: {
      description: {
        story:
          "DndTree is used to move resources from external source into Tree component",
      },
    },
  },
};
