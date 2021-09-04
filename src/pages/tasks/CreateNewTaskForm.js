import React, { useState } from "react";
import styled from "styled-components";
import { useDispatch, useSelector } from "react-redux";

import { addTodos, editTodos } from "../../redux/todoReducer";
import ApiClient from "../../api";

const StyledForm = styled.form`
  display: flex;
  flex-direction: column;
  gap: 12px;
  padding: 0.2rem 0.5rem;
  background: #f5fcff;

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
  & button {
    padding: 10px 20px;
    border-radius: 5px;
    border: 1px solid transparent;
    background: #5dbb36;
    color: #fff;
  }
  & button:hover {
    cursor: pointer;
  }
  & button:not(:last-child) {
    margin-right: 10px;
    border: none;
    background: transparent;
    color: black;
  }
  & > div:last-child {
    display: flex;
    align-items: center;
    margin-bottom: 15px;
    & > div.btn-group {
      margin-left: auto;
    }
  }
`;

const CreateNewTaskForm = ({ setShowForm, showForm, setShowModal }) => {
  const authState = useSelector((state) => state.auth);

  const [task, setTask] = useState({
    task_msg: showForm.data?.task_msg || "",
    assigned_user: showForm.data?.assigned_user || "",
    task_time: showForm.data?.task_date_time_in_utc_string
      ? showForm.data?.task_date_time_in_utc_string?.split(" ")[1]
      : "",
    task_date: showForm.data?.task_date || "",
    id: showForm.data?.id || "",
  });

  const dispatch = useDispatch();

  const handleAddTask = async (e) => {
    e.preventDefault();
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
        is_completed: 0,
        time_zone: 19800,
      };
      if (task.id) {
        url = `https://stage.api.sloovi.com/task/lead_c1de2c7b9ab94cb9abad131b7294cd8b/${task.id}?company_id=company_0336d06ff0ec4b3b9306ddc288482663`;
        method = "PUT";
      } else {
        url =
          "https://stage.api.sloovi.com/task/lead_c1de2c7b9ab94cb9abad131b7294cd8b?company_id=company_0336d06ff0ec4b3b9306ddc288482663";
        method = "POST";
      }

      const data = await ApiClient(url, method, headers, payload);
      dispatch(task.id ? editTodos(data.results) : addTodos(data.results));
      dispatch({
        type: "SHOW_TOAST",
        payload: {
          visible: true,
          message: task.id
            ? "Task edit successfully!"
            : "Task created successfully!",
          background: "#5dbb36",
        },
      });
    } catch (err) {
      dispatch({
        type: "SHOW_TOAST",
        payload: {
          visible: true,
          message: "Something failed. please try again later",
          background: "red",
        },
      });
    } finally {
      setTask({
        task_msg: "",
        assigned_user: "",
        task_time: "",
        task_date: "",
        id: "",
      });
      setShowForm({ visible: false, data: {} });
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
            ></input>
          </label>
        </div>
      </div>
      <div>
        <label>
          Assign User
          <select
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
          <p
            onClick={() => {
              setShowModal({ visible: true, data: task });
            }}
          >
            <i class="fas fa-trash-alt"></i>
          </p>
        )}
        <div className="btn-group">
          <button
            type="button"
            onClick={() => {
              setShowForm({ visible: false, data: {} });
            }}
          >
            Cancel
          </button>

          <button
            disabled={
              task.date === "" || task.task_msg === "" || task.task_time === ""
            }
            type="submit"
          >
            Save
          </button>
        </div>
      </div>
    </StyledForm>
  );
};

export default CreateNewTaskForm;
