import {
  DragDropContext,
  DragStart,
  Draggable,
  DropResult,
  Droppable,
} from "react-beautiful-dnd";
import styled from "styled-components";
import { toDoState, trash } from "./atoms";
import { useRecoilState, useSetRecoilState } from "recoil";
import Board from "./Components/Board";
import Trash from "./Components/Trash";

const Wrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: flex-end;
  max-width: 680px;
  width: 100%;
  height: 60vh;
  margin: 0 auto;
`;

const Boards = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  width: 100%;
  gap: 10px;
`;

function App() {
  const [toDos, setToDos] = useRecoilState(toDoState);
  const setVisible = useSetRecoilState(trash);

  const onDragStart = (info: DragStart) => {
    setVisible(true);
  };

  const onDragEnd = (info: DropResult) => {
    const { destination, draggableId, source } = info;

    if (!destination) return;

    if (destination?.droppableId === source.droppableId) {
      setToDos((allBoards) => {
        const boardCopy = [...allBoards[source.droppableId]];
        const taskObj = boardCopy[source.index];

        boardCopy.splice(source.index, 1);
        boardCopy.splice(destination?.index, 0, taskObj);

        const newBoards = {
          ...allBoards,
          [source.droppableId]: boardCopy,
        };

        localStorage.setItem("toDos", JSON.stringify(newBoards));

        return newBoards;
      });
    }

    if (destination.droppableId !== source.droppableId) {
      if (destination.droppableId === "remove") {
        setToDos((allBoards) => {
          const boardCopy = [...allBoards[source.droppableId]];

          boardCopy.splice(source.index, 1);

          const newBoards = {
            ...allBoards,
            [source.droppableId]: boardCopy,
          };

          localStorage.setItem("toDos", JSON.stringify(newBoards));

          return newBoards;
        });
      } else {
        setToDos((allBoards) => {
          const sourceBoard = [...allBoards[source.droppableId]];
          const destinationBoard = [...allBoards[destination.droppableId]];
          const taskObj = sourceBoard[source.index];

          sourceBoard.splice(source.index, 1);
          destinationBoard.splice(destination.index, 0, taskObj);

          const newBoards = {
            ...allBoards,
            [source.droppableId]: sourceBoard,
            [destination.droppableId]: destinationBoard,
          };

          localStorage.setItem("toDos", JSON.stringify(newBoards));

          return newBoards;
        });
      }
    }

    setVisible(false);
  };

  return (
    <DragDropContext onDragStart={onDragStart} onDragEnd={onDragEnd}>
      <Wrapper>
        <Boards>
          {Object.keys(toDos).map((boardId) => (
            <Board boardId={boardId} key={boardId} toDos={toDos[boardId]} />
          ))}
        </Boards>
      </Wrapper>
      <Trash />
    </DragDropContext>
  );
}

export default App;
