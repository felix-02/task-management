import React, { useState } from "react";
import styled from "styled-components";
import { useDispatch, useSelector } from "react-redux";
import ReactTooltip from "react-tooltip";

// Core imports
import { addTask, editTask } from "../../redux/taskReducer";
import ApiClient from "../../api";
import { showToast } from "../../redux/toastReducer";

const StyledForm = styled.form`
  display: flex;
  flex-direction: column;
  gap: 15px;
  padding: 1rem 0.8rem;

  background: #f0f8ff;

  & input,
  & select {
    margin-top: 5px;
  }

  & > div.date-time-wrapper {
    display: flex;

    gap: 5px;
    & > div {
      flex: 1;
    }
  }
  & label {
    display: flex;
    flex-direction: column;
  }

  & .field {
    padding: 8px;
    border-radius: 5px;
    border: 1px solid #c7c7c7;
  }
  & button:not(:first-child) {
    padding: 10px 20px;
    border-radius: 5px;

    color: #fff;
  }

  & button:not(:last-child) {
    margin-right: 10px;
    background: transparent;
  }

  & > div:last-child {
    display: flex;
    align-items: center;
    margin-bottom: 10px;
    & > div.btn-group {
      margin-left: auto;
    }
  }
  & .trash-icon {
    color: grey;
  }
`;

const StyledSaveButton = styled.button`
  border: 1px solid transparent;
  background: ${(props) => (props.disabled ? "grey" : "#19916B")};
  &:hover {
    cursor: ${(props) => (props.disabled ? "not-allowed" : "pointer")};
  }
`;
const StyledCancelButton = styled.button`
  border: ${(props) => (props.disabled ? "1px solid #c8c8c8" : "none")};
  &:hover {
    cursor: ${(props) => (props.disabled ? "not-allowed" : "pointer")};
  }
`;
const StyledTrashButton = styled.button`
  color: grey;
  margin-left: 5px;
  font-size: 16px;
  padding: 10px 0;
  border: none;
  &:hover {
    cursor: ${(props) => (props.disabled ? "not-allowed" : "pointer")};
  }
`;

const TaskForm = ({ setShowForm, showForm, setShowModal }) => {
  const authState = useSelector((state) => state.auth);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [task, setTask] = useState({
    task_msg: showForm.data?.task_msg || "",
    assigned_user: showForm.data?.assigned_user || "",
    task_time: showForm.data?.task_date_time_in_utc_string
      ? showForm.data?.task_date_time_in_utc_string?.split(" ")[1]
      : "",
    task_date: showForm.data?.task_date || "",
    id: showForm.data?.id || "",
    is_completed: showForm.data?.is_completed || 0,
    time_zone: showForm.data?.time_zone || 19800,
  });

  const dispatch = useDispatch();

  const handleAddTask = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      let url;
      let method;
      const headers = {
        Authorization: "Bearer " + authState.token,
        Accept: "application/json",
        "Content-Type": "application/json",
      };
      const payload = {
        task_msg: task.task_msg,
        task_time:
          task.task_time.split(":")[0] * 3600 +
          task.task_time.split(":")[1] * 60,
        task_date: task.task_date,
        assigned_user: task.assigned_user,
        is_completed: task.is_completed,
        time_zone: task.time_zone,
      };
      if (task.id) {
        url = `${process.env.REACT_APP_BASE_URL}/task/lead_c1de2c7b9ab94cb9abad131b7294cd8b/${task.id}?company_id=${process.env.REACT_APP_COMPANY_ID}`;
        method = "PUT";
      } else {
        url = `${process.env.REACT_APP_BASE_URL}/task/lead_c1de2c7b9ab94cb9abad131b7294cd8b?company_id=${process.env.REACT_APP_COMPANY_ID}`;
        method = "POST";
      }

      const data = await ApiClient(url, method, headers, payload);
      dispatch(task.id ? editTask(data.results) : addTask(data.results));
      dispatch(
        showToast({
          visible: true,
          message: task.id
            ? "Task edited successfully!"
            : "Task created successfully!",
          background: "#5dbb36",
        })
      );
    } catch (err) {
      dispatch(
        showToast({
          type: "SHOW_TOAST",
          payload: {
            visible: true,
            message: "Something failed. please try again later",
            background: "red",
          },
        })
      );
    } finally {
      setTask({
        task_msg: "",
        assigned_user: "",
        task_time: "",
        task_date: "",
        id: "",
      });
      setShowForm({ visible: false, data: {} });
      setIsSubmitting(false);
    }
  };

  const handleFieldChange = (e) => {
    setTask((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };
  return (
    <StyledForm onSubmit={handleAddTask}>
      <div>
        <label>
          Task Description
          <input
            name="task_msg"
            className="field"
            type="text"
            value={task.task_msg}
            onChange={handleFieldChange}
            disabled={isSubmitting}
          />
        </label>
      </div>
      <div className="date-time-wrapper">
        <div>
          <label>
            Date
            <input
              className="field"
              value={task.task_date}
              onChange={handleFieldChange}
              type="date"
              id="task_date"
              name="task_date"
              disabled={isSubmitting}
            />
          </label>
        </div>
        <div>
          <label>
            Time
            <input
              className="field"
              value={task.task_time}
              onChange={handleFieldChange}
              type="time"
              id="task_time"
              name="task_time"
              disabled={isSubmitting}
            />
          </label>
        </div>
      </div>
      <div>
        <label>
          Assign User
          <select
            disabled={isSubmitting}
            onChange={handleFieldChange}
            name="assigned_user"
            value={task.assigned_user}
            className="field"
          >
            <option disabled hidden value="">
              Select user
            </option>
            {authState.users.map((itm) => (
              <option key={itm.id} value={itm.id}>
                {itm.name}
              </option>
            ))}
          </select>
        </label>
      </div>

      <div>
        {task.id && (
          <>
            <StyledTrashButton
              type="button"
              className="trash-icon"
              onClick={() => {
                setShowModal({
                  visible: true,
                  data: task,
                  type: "DELETE_TASK",
                });
              }}
              data-tip
              data-for="deleteTip"
              disabled={isSubmitting}
            >
              <i className="fas fa-trash-alt"></i>
            </StyledTrashButton>
            <ReactTooltip id="deleteTip" place="top" effect="solid">
              Delete Task
            </ReactTooltip>
          </>
        )}
        <div className="btn-group">
          <StyledCancelButton
            type="button"
            onClick={() => {
              setShowForm({ visible: false, data: {} });
            }}
            disabled={isSubmitting}
          >
            Cancel
          </StyledCancelButton>

          <StyledSaveButton
            disabled={
              isSubmitting ||
              task.task_date === "" ||
              task.task_msg === "" ||
              task.task_time === "" ||
              task.assigned_user === ""
            }
            type="submit"
          >
            Save
          </StyledSaveButton>
        </div>
      </div>
    </StyledForm>
  );
};

export default TaskForm;
