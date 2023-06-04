import React from "react";
import { Draggable } from "react-beautiful-dnd";
import { useSetRecoilState } from "recoil";
import styled from "styled-components";
import { toDoState } from "../atoms";

const Card = styled.div<ICardProps>`
  display: flex;
  justify-content: space-between;
  align-items: center;
  background-color: ${(props) =>
    props.isDragging ? "#74b9ff" : props.theme.cardColor};
  padding: 10px 10px;
  border-radius: 5px;
  margin-bottom: 10px;
  box-shadow: ${(props) =>
    props.isDragging ? "0px 2px 5px rgba(0, 0, 0, 0.05)" : "none"};
`;

const RemoveBtn = styled.button`
  background-color: white;
  border: none;
  padding: 0;

  img {
    width: 15px;
    height: 15px;
  }
`;

interface IDraggableCardProps {
  toDoId: number;
  toDoText: string;
  index: number;
  boardId: string;
}

interface ICardProps {
  isDragging: boolean;
}

function DraggableCard({
  toDoId,
  toDoText,
  index,
  boardId,
}: IDraggableCardProps) {
  const setToDos = useSetRecoilState(toDoState);

  const onRemove = () => {
    setToDos((prevData) => {
      const copyData = { ...prevData };
      const filterData = copyData[boardId].filter((elem) => elem.id !== toDoId);
      const updateData = {
        ...copyData,
        [boardId]: filterData,
      };

      localStorage.setItem("toDos", JSON.stringify(updateData));

      return updateData;
    });
  };

  return (
    <Draggable draggableId={`${toDoId}`} index={index}>
      {(magic, snapshot) => (
        <Card
          isDragging={snapshot.isDragging}
          ref={magic.innerRef}
          {...magic.dragHandleProps}
          {...magic.draggableProps}>
          {toDoText}
          <RemoveBtn onClick={onRemove}>
            <img
              src="https://img.icons8.com/material-outlined/24/filled-trash.png"
              alt="filled-trash"
            />
          </RemoveBtn>
        </Card>
      )}
    </Draggable>
  );
}

export default React.memo(DraggableCard);
