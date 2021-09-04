import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import styled from "styled-components";
import { hideToast } from "../../redux/toastReducer";

const StyledWrapper = styled.div`
  position: absolute;
  left: 50%;
  top: 5%;
  opacity: 1;
  color: white;
  weight: bold;
  border-radius: 50px;
  transform: translatex(-50%);
  & p {
    background: ${(props) => props.background};
    padding: 10px 40px;
    border-radius: 5px;
  }
`;

const Toast = () => {
  const dispatch = useDispatch();
  const toastData = useSelector((state) => state.toast);

  useEffect(() => {
    setTimeout(() => {
      dispatch(hideToast());
    }, 2000);
  }, [dispatch]);

  return (
    <StyledWrapper background={toastData.background}>
      <p>{toastData.message}</p>
    </StyledWrapper>
  );
};

export default Toast;
