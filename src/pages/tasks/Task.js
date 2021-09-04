import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import styled from "styled-components";
import ReactTooltip from "react-tooltip";

// Core imports
import Modal from "../../components/Modal";

import CreateNewTaskForm from "./TaskForm";
import ApiClient from "../../api";
import { editTask } from "../../redux/taskReducer";
import { showToast } from "../../redux/toastReducer";

const StyledAddIcon = styled.span`
  border-left: 1px solid #c8c8c8;
  padding: 0.5rem 0.8rem;
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
  & > div.btn-group button {
    background: #fff;
    border: 1px solid #c8c8c8;
    border-radius: 5px;
  }
  & > div.btn-group button:hover {
    cursor: pointer;
  }
  & > div {
    & button:not(:last-child) {
      margin-right: 5px;
    }
    & button {
      padding: 5px 10px;
    }
  }
  & .time-text {
    color: red;
  }
`;
const StyledWrapperDiv = styled.div`
  border: 1px solid #c7c7c7;
  box-shadow: 0 1px 4px rgb(0 0 0 / 0.2);
  border-radius: 5px;
  overflow: hidden;
  width: 25rem;
  height: fit-content;
  & > div:first-child {
    display: flex;
    justify-content: space-between;
    border-bottom: ${(props) =>
      props.formVisible || props.hasTodo ? "1px solid #c7c7c7" : "none"};
    & p {
      padding: 0.5rem 0.8rem;
    }
  }
  & .card {
    padding: 20px 5px;
    background: white;
  }
  & .card:not(:last-child) {
    border-bottom: 1px solid #d7d7d7;
  }
`;

const StyledSpan = styled.span`
  color: grey;
`;

const StyledCardsWrapper = styled.div`
  max-height: 500px;
  overflow: auto;
`;

const Task = ({ tasks }) => {
  const [showForm, setShowForm] = useState({ visible: false, data: {} });
  const [showModal, setShowModal] = useState({
    visible: false,
    data: {},
    type: "",
  });
  const authState = useSelector((state) => state.auth);
  const dispatch = useDispatch();

  const modalSubmitHandler = async () => {
    if (showModal.type === "DELETE_TASK") {
      try {
        await ApiClient(
          `${process.env.REACT_APP_BASE_URL}/task/lead_c1de2c7b9ab94cb9abad131b7294cd8b/${showModal.data.id}?company_id=${process.env.REACT_APP_COMPANY_ID}`,
          "DELETE",
          {
            Authorization: "Bearer " + authState.token,
            Accept: "application/json",
            "Content-Type": "application/json",
          }
        );
        dispatch({ type: "DELETE_TASK", payload: showModal.data.id });
        dispatch(
          showToast({
            visible: true,
            message: "Task deleted successfully!",
            background: "#5dbb36",
          })
        );

        setShowModal({ visible: false, data: {}, type: "" });
        setShowForm({ visible: false, data: {} });
      } catch (err) {
        dispatch(
          showToast({
            visible: true,
            message: "Something failed. please try again later",
            background: "red",
          })
        );
      }
    } else if (showModal.type === "COMPLETE_TASK") {
      try {
        const headers = {
          Authorization: "Bearer " + authState.token,
          Accept: "application/json",
          "Content-Type": "application/json",
        };

        const payload = {
          task_msg: showModal.data.task_msg,
          task_time: showModal.data.task_time,
          task_date: showModal.data.task_date,
          assigned_user: showModal.data.assigned_user,
          is_completed: 1,
          time_zone: showModal.data.time_zone,
        };
        const url = `${process.env.REACT_APP_BASE_URL}/task/lead_c1de2c7b9ab94cb9abad131b7294cd8b/${showModal.data.id}?company_id=${process.env.REACT_APP_COMPANY_ID}`;
        const method = "PUT";

        const data = await ApiClient(url, method, headers, payload);
        dispatch(editTask(data.results));
        setShowModal({ visible: false, data: {}, type: "" });
        dispatch(
          showToast({
            visible: true,
            message: "Task marked completed successfully!",
            background: "#5dbb36",
          })
        );
      } catch (err) {
        dispatch(
          showToast({
            visible: true,
            message: "Something failed. please try again later",
            background: "red",
          })
        );
      }
    }
  };

  return (
    <StyledWrapperDiv formVisible={showForm.visible} hasTodo={tasks.length}>
      <div>
        <p>
          TASKS <StyledSpan>{tasks.length}</StyledSpan>
        </p>
        <StyledAddIcon
          data-tip
          data-for="addTip"
          onClick={() => setShowForm({ visible: true, data: {} })}
        >
          <i className="fas fa-plus fa-sm"></i>
        </StyledAddIcon>
        <ReactTooltip id="addTip" place="top" effect="solid">
          Add New Task
        </ReactTooltip>
      </div>
      {showForm.visible ? (
        <CreateNewTaskForm
          setShowForm={setShowForm}
          showForm={showForm}
          setShowModal={setShowModal}
        />
      ) : (
        <StyledCardsWrapper>
          {tasks.length > 0 &&
            tasks.map((itm, index) => (
              <div className="card" key={index}>
                <StyledBox>
                  <div className="info">
                    <div>{itm.user}</div>
                    <div>
                      <p>{itm.task_msg}</p>
                      <p className="time-text">
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
                      data-tip
                      data-for="editTip"
                    >
                      <i className="fas fa-pen"></i>
                    </button>
                    <ReactTooltip id="editTip" place="top" effect="solid">
                      Edit Task
                    </ReactTooltip>
                    <button
                      className="checked"
                      onClick={() => {
                        setShowModal({
                          visible: true,
                          data: itm,
                          type: "COMPLETE_TASK",
                        });
                      }}
                      data-tip
                      data-for="completeTip"
                    >
                      <i className="fas fa-check"></i>
                    </button>
                    <ReactTooltip id="completeTip" place="top" effect="solid">
                      Complete Task
                    </ReactTooltip>
                  </div>
                </StyledBox>
              </div>
            ))}
        </StyledCardsWrapper>
      )}
      {showModal.visible && (
        <Modal
          show={showModal}
          title={
            showModal.type === "DELETE_TASK" ? "Delete Task!" : "Complete Task!"
          }
          close={() => {
            setShowModal({ visible: false, data: {}, type: "" });
          }}
          onConfirm={modalSubmitHandler}
        >
          {showModal.type === "DELETE_TASK"
            ? "Are you sure you want to delete this task?"
            : "Are you sure you want to mark this task completed?"}
        </Modal>
      )}
    </StyledWrapperDiv>
  );
};

export default Task;
