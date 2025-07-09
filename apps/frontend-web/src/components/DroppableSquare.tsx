import { useDroppable } from "@dnd-kit/core";

interface DroppableProps {
  id: string;
  children: React.ReactNode;
  onClick: () => void;
  color: string;
}

export default function DroppableSquare({
  id,
  children,
  onClick,
  color,
}: DroppableProps) {
  const { setNodeRef } = useDroppable({ id });

  return (
    <div
      ref={setNodeRef}
      onClick={onClick}
      className={`w-full aspect-square ${color} flex justify-center items-center`}
    >
      {children}
    </div>
  );
}
