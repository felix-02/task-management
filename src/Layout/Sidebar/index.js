import React from "react";
import styled from "styled-components";

const StyledSidebar = styled.div`
  position: fixed;
  left: 0;
  top: 0;
  bottom: 0;
  width: 12rem;
  background: #36454f;
`;

const Sidebar = () => {
  return <StyledSidebar />;
};

export default Sidebar;
