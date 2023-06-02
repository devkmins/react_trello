import { useRef } from "react";
import { Droppable } from "react-beautiful-dnd";
import { useRecoilState, useRecoilValue } from "recoil";
import styled from "styled-components";
import { trash } from "../atoms";

interface TrashProps {
  visible: boolean;
}

const Container = styled.div`
  display: flex;
  justify-content: flex-end;
  width: 99%;
  margin-top: 10px;
`;

const TrashDiv = styled.div<TrashProps>`
  display: ${(props) => (props.visible ? "flex" : "none")};
  justify-content: center;
  align-items: center;
  width: 75px;
  height: 75px;
  border: 1px solid white;
  border-radius: 10px;
`;

function Trash() {
  const visible = useRecoilValue(trash);

  return (
    <Droppable droppableId="remove">
      {(magic) => (
        <Container>
          <TrashDiv visible={visible} {...magic.droppableProps}>
            <img
              width="60"
              height="60"
              src="https://img.icons8.com/sf-ultralight/50/000000/trash.png"
              alt="trash"
              ref={magic.innerRef}
            />
          </TrashDiv>
        </Container>
      )}
    </Droppable>
  );
}

export default Trash;
