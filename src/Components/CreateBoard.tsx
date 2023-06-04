import { useSetRecoilState } from "recoil";
import styled from "styled-components";
import { toDoState } from "../atoms";
import { useForm } from "react-hook-form";

const Form = styled.form`
  display: flex;
  justify-content: center;
  margin: 50px 0px;
`;

const Input = styled.input`
  width: 40%;
  height: 50px;
  border-radius: 20px;
  border: 1.5px solid #dadfe9;
  box-shadow: 5px 5px 5px 5px rgba(49, 110, 234, 0.4);

  &:focus {
    outline: 1px solid lightgray;
  }
`;

interface IForm {
  board: string;
}

function CreateBoard() {
  const setToDos = useSetRecoilState(toDoState);
  const { register, setValue, handleSubmit } = useForm<IForm>();

  const onValid = ({ board }: IForm) => {
    setToDos((allBoards) => {
      const newBoards = {
        ...allBoards,
        [board]: [],
      };

      localStorage.setItem("toDos", JSON.stringify(newBoards));

      return newBoards;
    });

    setValue("board", "");
  };

  return (
    <Form onSubmit={handleSubmit(onValid)}>
      <Input
        {...register("board", { required: true })}
        type="text"
        placeholder="Create a new board"
      />
    </Form>
  );
}

export default CreateBoard;
