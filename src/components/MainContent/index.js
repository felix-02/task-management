import React from "react";
import styled from "styled-components";

const MainContentWrapper = styled.div`
  display: flex;
  flex: 1;

  flex-direction-column;
  background: #f6f6f6;
  padding: 5rem 2rem;
`;

const MainContent = ({ children }) => {
  return <MainContentWrapper>{children}</MainContentWrapper>;
};

export default MainContent;
