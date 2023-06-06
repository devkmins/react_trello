import { Droppable } from "react-beautiful-dnd";
import styled from "styled-components";
import DraggableCard from "./DraggableCard";
import { useForm } from "react-hook-form";
import { ITodo, toDoState } from "../atoms";
import { useSetRecoilState } from "recoil";
import RemoveBoard from "./RemoveBoard";
import { useState } from "react";

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  background-color: ${(props) => props.theme.boardColor};
  padding-top: 10px;
  border-radius: 10px;
  min-height: 200px;
  margin-bottom: 25px;
`;

const Header = styled.header`
  display: grid;
  grid-template-columns: 3fr repeat(2, 0.25fr);
  align-items: center;
  margin: 0px 10px;
`;

const Title = styled.h2`
  font-weight: 600;
  margin-bottom: 10px;
  font-size: 18px;
`;

const Area = styled.div<IAreaProps>`
  background-color: ${(props) =>
    props.isDraggingOver
      ? "#dfe6e9"
      : props.isDraggingFromThis
      ? "#b2bec3"
      : "transparent"};
  flex-grow: 1;
  transition: background-color ease-in-out 0.3s;
  padding: 20px;
`;

const Form = styled.form`
  display: flex;
  justify-content: center;
  width: 100%;
  height: 30px;
  margin-bottom: 15px;
`;

const Input = styled.input`
  width: 90%;
  border-radius: 10px;
  border: none;
  box-shadow: 0px 5px 10px 2px rgba(0, 0, 0, 0.5);

  &:focus {
    outline: 1.5px solid rgba(64, 140, 242, 1);
  }
`;

const ModifyBtn = styled.button`
  margin-bottom: 10px;
  margin-right: 5px;
  background-color: transparent;
  border: none;
  padding: 0;

  img {
    width: 15px;
    height: 15px;
  }

  &:hover {
    cursor: pointer;
  }
`;

const BoardForm = styled.form`
  width: 180px;
`;

const BoardInput = styled.input`
  border: none;
  font-size: 17px;
  padding: 0;
  outline: none;
  border-bottom: 1px solid #3e8cf2;
  background-color: transparent;
  margin-bottom: 10px;
`;

interface IBoardProps {
  toDos: ITodo[];
  boardId: string;
}

interface IAreaProps {
  isDraggingFromThis: boolean;
  isDraggingOver: boolean;
}

interface IFormToDo {
  toDo: string;
}

interface IFormBoard {
  boardName: string;
}

function Board({ toDos, boardId }: IBoardProps) {
  const [modify, setModify] = useState(false);
  const setToDos = useSetRecoilState(toDoState);
  const {
    register: registerToDo,
    setValue: setValueToDo,
    handleSubmit: handleSubmitToDo,
  } = useForm<IFormToDo>();
  const {
    register: registerBoard,
    setValue: setValueBoard,
    handleSubmit: handleSubmitBoard,
  } = useForm<IFormBoard>();

  const onValid = ({ toDo }: IFormToDo) => {
    const newToDo = {
      id: Date.now(),
      text: toDo,
    };

    setToDos((allBoards) => {
      const newToDos = {
        ...allBoards,
        [boardId]: [...allBoards[boardId], newToDo],
      };

      localStorage.setItem("toDos", JSON.stringify(newToDos));

      return newToDos;
    });

    setValueToDo("toDo", "");
  };

  const onBoardValid = ({ boardName }: IFormBoard) => {
    setToDos((prevBoards) => {
      const copyBoards = { ...prevBoards };
      const copyBoard = copyBoards[boardId];
      delete copyBoards[boardId];

      const updateBoards = {
        ...copyBoards,
        [boardName]: copyBoard,
      };

      localStorage.setItem("toDos", JSON.stringify(updateBoards));

      return updateBoards;
    });

    setModify(false);
  };

  const onModify = () => {
    setModify(true);
    setValueBoard("boardName", boardId);
  };

  return (
    <Wrapper>
      <Header>
        <Title>{modify ? "" : boardId}</Title>
        {modify ? (
          <BoardForm onSubmit={handleSubmitBoard(onBoardValid)}>
            <BoardInput
              {...registerBoard("boardName", { required: true })}
              type="text"></BoardInput>
          </BoardForm>
        ) : (
          <ModifyBtn onClick={onModify}>
            <img
              src="https://img.icons8.com/fluency-systems-regular/48/000000/pencil--v1.png"
              alt="pencil--v1"
            />
          </ModifyBtn>
        )}
        <RemoveBoard boardId={boardId} />
      </Header>
      <Form onSubmit={handleSubmitToDo(onValid)}>
        <Input
          {...registerToDo("toDo", { required: true })}
          type="text"
          placeholder={`Add task on ${boardId}`}
        />
      </Form>
      <Droppable droppableId={boardId}>
        {(magic, snapshot) => (
          <Area
            isDraggingOver={snapshot.isDraggingOver}
            isDraggingFromThis={Boolean(snapshot.draggingFromThisWith)}
            ref={magic.innerRef}
            {...magic.droppableProps}>
            {toDos.map((toDo, index) => (
              <DraggableCard
                key={toDo.id}
                index={index}
                toDoId={toDo.id}
                toDoText={toDo.text}
                boardId={boardId}></DraggableCard>
            ))}
            {magic.placeholder}
          </Area>
        )}
      </Droppable>
    </Wrapper>
  );
}

export default Board;
