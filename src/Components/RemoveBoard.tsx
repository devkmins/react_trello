import { useSetRecoilState } from "recoil";
import styled from "styled-components";
import { toDoState } from "../atoms";

const RemoveBtn = styled.button`
  background-color: transparent;
  border: none;
  padding: 0;
  margin-bottom: 10px;

  img {
    width: 17px;
    height: 17px;
  }

  &:hover {
    cursor: pointer;
  }
`;

interface IRemoveBoardProps {
  boardId: string;
}

function RemoveBoard({ boardId }: IRemoveBoardProps) {
  const setBoards = useSetRecoilState(toDoState);

  const onRemove = () => {
    setBoards((prevBoards) => {
      const copyBoards = { ...prevBoards };
      delete copyBoards[boardId];

      const updateBoards = {
        ...copyBoards,
      };

      localStorage.setItem("toDos", JSON.stringify(updateBoards));

      return updateBoards;
    });
  };

  return (
    <RemoveBtn onClick={onRemove}>
      <img
        src="https://img.icons8.com/material-outlined/24/000000/trash--v1.png"
        alt="trash--v1"
      />
    </RemoveBtn>
  );
}

export default RemoveBoard;
