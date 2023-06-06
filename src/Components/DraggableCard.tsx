import React, { useState } from "react";
import { Draggable } from "react-beautiful-dnd";
import styled from "styled-components";
import RemoveToDo from "./RemoveToDo";
import { useSetRecoilState } from "recoil";
import { toDoState } from "../atoms";
import { useForm } from "react-hook-form";

const Card = styled.div<ICardProps>`
  display: grid;
  grid-template-columns: 3fr repeat(2, 0fr);
  align-items: center;
  background-color: ${(props) =>
    props.isDragging ? "#74b9ff" : props.theme.cardColor};
  padding: 10px 10px;
  border-radius: 5px;
  margin-bottom: 10px;
  box-shadow: ${(props) =>
    props.isDragging ? "0px 2px 5px rgba(0, 0, 0, 0.05)" : "none"};
`;

const ModifyBtn = styled.button`
  background-color: transparent;
  border: none;
  padding: 0;
  margin-right: 5px;

  img {
    width: 15px;
    height: 15px;
  }

  &:hover {
    cursor: pointer;
  }
`;

const Form = styled.form``;

const Input = styled.input`
  border: none;
  font-size: 16px;
  padding: 0;
  width: 125px;
  outline: none;
  border-bottom: 1px solid #3e8cf2;
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

interface IForm {
  value: string;
}

function DraggableCard({
  toDoId,
  toDoText,
  index,
  boardId,
}: IDraggableCardProps) {
  const [modify, setModify] = useState(false);
  const setToDos = useSetRecoilState(toDoState);
  const { register, setValue, handleSubmit } = useForm<IForm>();

  const onValid = ({ value }: IForm) => {
    setToDos((prevToDos) => {
      const copyToDos = { ...prevToDos };
      const toDos = copyToDos[boardId];
      const toDoObj = { ...toDos[index], text: value };
      const updateToDo = [...toDos];
      updateToDo[index] = toDoObj;
      const updateToDos = {
        ...copyToDos,
        [boardId]: updateToDo,
      };

      localStorage.setItem("toDos", JSON.stringify(updateToDos));

      return updateToDos;
    });

    setModify(false);
  };

  const onModify = () => {
    setModify(true);
    setValue("value", toDoText);
  };

  return (
    <Draggable draggableId={`${toDoId}`} index={index}>
      {(magic, snapshot) => (
        <Card
          isDragging={snapshot.isDragging}
          ref={magic.innerRef}
          {...magic.dragHandleProps}
          {...magic.draggableProps}>
          {modify ? "" : toDoText}
          {modify ? (
            <Form onSubmit={handleSubmit(onValid)}>
              <Input
                {...register("value", { required: true })}
                type="text"></Input>
            </Form>
          ) : (
            <ModifyBtn onClick={onModify}>
              <img
                src="https://img.icons8.com/fluency-systems-regular/48/000000/pencil--v1.png"
                alt="pencil--v1"
              />
            </ModifyBtn>
          )}
          <RemoveToDo toDoId={toDoId} boardId={boardId} />
        </Card>
      )}
    </Draggable>
  );
}

export default React.memo(DraggableCard);
