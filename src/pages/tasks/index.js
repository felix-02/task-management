import React from "react";
import { useDispatch, useSelector } from "react-redux";

import TodaysTask from "./TodaysTask";

import styled from "styled-components";
import Sidebar from "../../components/Sidebar";
import Header from "../../components/Header";
import MainContent from "../../components/MainContent";
import { useEffect } from "react";
import ApiClient from "../../api";

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

const Tasks = () => {
  const todos = useSelector((state) => state.task);
  const { token } = useSelector((state) => state.auth);
  const dispatch = useDispatch();

  useEffect(() => {
    if (token) {
      const getAllTasks = async () => {
        try {
          const data = await ApiClient(
            "https://stage.api.sloovi.com/task/lead_c1de2c7b9ab94cb9abad131b7294cd8b?company_id=company_0336d06ff0ec4b3b9306ddc288482663",
            "GET",
            {
              Authorization: "Bearer " + token,
              Accept: "application/json",
              "Content-Type": "application/json",
            }
          );
          dispatch({ type: "SET_TASKS", payload: data.results });
        } catch (err) {
          dispatch({
            type: "SHOW_TOAST",
            payload: {
              visible: true,
              message: "Failed to fetch tasks",
              background: "red",
            },
          });
        }
      };

      getAllTasks();
    }
  }, [token, dispatch]);

  return (
    <StyledLayoutWrapper>
      <Sidebar />
      <StyledWrapper>
        <Header />
        <MainContent>
          <TodaysTask todos={todos} />
        </MainContent>
      </StyledWrapper>
    </StyledLayoutWrapper>
  );
};

export default Tasks;
