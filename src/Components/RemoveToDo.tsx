import { useSetRecoilState } from "recoil";
import styled from "styled-components";
import { toDoState } from "../atoms";

const RemoveBtn = styled.button`
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

interface IRemoveToDoProps {
  toDoId: number;
  boardId: string;
}

function RemoveToDo({ toDoId, boardId }: IRemoveToDoProps) {
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
    <RemoveBtn onClick={onRemove}>
      <img
        src="https://img.icons8.com/material-outlined/24/000000/trash--v1.png"
        alt="trash--v1"
      />
    </RemoveBtn>
  );
}

export default RemoveToDo;
