import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import styled from "styled-components";

// Core imports
import Sidebar from "../../Layout/Sidebar";
import Header from "../../components/Header";
import MainContent from "../../Layout/MainContent";
import Loader from "../../components/Loader";

import ApiClient from "../../api";
import Task from "./Task";
import { setTask } from "../../redux/taskReducer";
import { showToast } from "../../redux/toastReducer";

const StyledWrapper = styled.div`
  display: flex;
  flex-direction: column;
  flex: 1;
  margin-left: 12rem;
  height: 100vh;
`;
const StyledLayoutWrapper = styled.div`
  display: flex;
`;

const StyledLoaderWrapper = styled.div`
  display: flex;
  flex: 1;
  justify-content: center;
  align-items: center;
`;

const Tasks = () => {
  const tasks = useSelector((state) => state.task);
  const { token } = useSelector((state) => state.auth);
  const dispatch = useDispatch();

  useEffect(() => {
    if (token) {
      const getAllTasks = async () => {
        try {
          const data = await ApiClient(
            `${process.env.REACT_APP_BASE_URL}/task/lead_c1de2c7b9ab94cb9abad131b7294cd8b?company_id=${process.env.REACT_APP_COMPANY_ID}`,
            "GET",
            {
              Authorization: "Bearer " + token,
              Accept: "application/json",
              "Content-Type": "application/json",
            }
          );
          dispatch(setTask(data.results));
        } catch (err) {
          dispatch(
            showToast({
              visible: true,
              message: "Failed to fetch tasks",
              background: "red",
            })
          );
        }
      };

      getAllTasks();
    }
  }, [token, dispatch]);

  return (
    <StyledLayoutWrapper>
      <Sidebar />
      <StyledWrapper>
        {tasks.length === 0 ? (
          <StyledLoaderWrapper>
            <Loader />
          </StyledLoaderWrapper>
        ) : (
          <>
            <Header />
            <MainContent>
              <Task tasks={tasks} />
            </MainContent>
          </>
        )}
      </StyledWrapper>
    </StyledLayoutWrapper>
  );
};

export default Tasks;
