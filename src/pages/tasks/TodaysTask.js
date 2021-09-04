import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";

import Modal from "../../components/Modal";

import styled from "styled-components";
import CreateNewTaskForm from "./CreateNewTaskForm";
import ApiClient from "../../api";

const StyledAddIcon = styled.span`
  border-left: 1px solid #c8c8c8;
  padding: 0.2rem 0.5rem;
  &:hover {
    cursor: pointer;
  }
`;

const StyledBox = styled.div`
  display: flex;

  & > div.info {
    display: flex;
    align-items: center;
    gap: 10px;
  }
  & > div.btn-group {
    margin-left: auto;
  }
  & > div {
    & button:not(:last-child) {
      margin-right: 5px;
    }
    & button {
      padding: 5px 10px;
    }
  }
`;
const StyledWrapperDiv = styled.div`
  border: 1px solid #c7c7c7;
  width: 25rem;
  height: fit-content;
  & > div:first-child {
    display: flex;
    justify-content: space-between;
    border-bottom: ${(props) =>
      props.formVisible || props.hasTodo ? "1px solid #c7c7c7" : "none"};
    & p {
      padding: 0.2rem 0.5rem;
    }
  }
  & > .card {
    padding: 20px 5px;
    background: white;
  }
  & > .card:not(:last-child) {
    border-bottom: 1px solid #d7d7d7;
  }
`;
const TodaysTask = ({ todos }) => {
  const [showForm, setShowForm] = useState({ visible: false, data: {} });
  const [showModal, setShowModal] = useState({ visible: false, data: {} });
  const authState = useSelector((state) => state.auth);
  const dispatch = useDispatch();

  return (
    <StyledWrapperDiv formVisible={showForm.visible} hasTodo={todos.length}>
      <div>
        <p>TASKS {todos.length} </p>
        <StyledAddIcon onClick={() => setShowForm({ visible: true, data: {} })}>
          &#8853;
        </StyledAddIcon>
      </div>
      {showForm.visible ? (
        <CreateNewTaskForm
          setShowForm={setShowForm}
          showForm={showForm}
          setShowModal={setShowModal}
        />
      ) : (
        <>
          {todos.length > 0 &&
            todos.map((itm, index) => (
              <div className="card" key={index}>
                <StyledBox>
                  <div className="info">
                    <div>
                      <p>{itm.user}</p>
                    </div>
                    <div>
                      <p>{itm.task_msg}</p>
                      <p>
                        {new Date(itm.task_date).toLocaleDateString("en-US")}
                      </p>
                      <p></p>
                    </div>
                  </div>

                  <div className="btn-group">
                    <button
                      onClick={() => {
                        setShowForm({ visible: true, data: itm });
                      }}
                    >
                      &#9998;
                    </button>
                  </div>
                </StyledBox>
              </div>
            ))}
        </>
      )}
      {showModal.visible && (
        <Modal
          show={showModal}
          title="Delete Task!"
          close={() => {
            setShowModal({ visible: false, data: {} });
          }}
          onConfirm={() => {
            const deleteTask = async (id) => {
              await ApiClient(
                `https://stage.api.sloovi.com/task/lead_c1de2c7b9ab94cb9abad131b7294cd8b/${id}?company_id=company_0336d06ff0ec4b3b9306ddc288482663`,
                "DELETE",
                {
                  Authorization: "Bearer " + authState.token,
                  Accept: "application/json",
                  "Content-Type": "application/json",
                }
              );
              dispatch({ type: "DELETE_TASK", payload: id });
              dispatch({
                type: "SHOW_TOAST",
                payload: {
                  visible: true,
                  message: "Task deleted successfully!",
                  background: "#5dbb36",
                },
              });
              setShowModal({ visible: false, data: {} });
              setShowForm({ visible: false, data: {} });
            };
            deleteTask(showModal.data.id);
          }}
        >
          {"Are you sure you want to delete this task?"}
        </Modal>
      )}
    </StyledWrapperDiv>
  );
};

export default TodaysTask;
