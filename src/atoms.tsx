import { atom } from "recoil";

export interface ITodo {
  id: number;
  text: string;
}

interface IToDoState {
  [key: string]: ITodo[];
}

export const toDoState = atom<IToDoState>({
  key: "toDo",
  default: JSON.parse(localStorage.getItem("toDos") as string)
    ? JSON.parse(localStorage.getItem("toDos") as string)
    : {
        "To Do": [],
        Doing: [],
        Done: [],
      },
});

export const boardState = atom({
  key: "board",
  default: [],
});

export const trashState = atom({
  key: "trash",
  default: false,
});
