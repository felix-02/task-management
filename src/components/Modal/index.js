import React from "react";
import ReactDOM from "react-dom";
// import "./modal.scss";
// import Close from "./times-solid.svg";
import styled from "styled-components";

const StyledWrapper = styled.div`
  position: fixed;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  background: rgba(0, 0, 0, 0.35);

  display: flex;
  justify-content: center;
  align-items: center;

  & {
    .modal {
      width: 30vw;
      height: auto;
      background-color: #fff;
      padding: 2rem;
      border-radius: 20px;

      backdrop-filter: blur(5px);
      box-shadow: 0 0 1rem 0 rgba(0, 0, 0, 0.2);

      &_header {
        display: flex;
        justify-content: space-between;
        border-bottom: 1px solid #dddddd;
        align-items: center;

        & span:hover {
          cursor: pointer;
        }
      }

      &_content {
        border-bottom: 1px solid #dddddd;
        padding: 2rem 0;
      }

      &_footer {
        display: flex;
        justify-content: flex-end;
        padding: 2rem 0;
        padding-bottom: 0;

        & button {
          padding: 0.5rem;
          border: 1px solid #c7c7c7;
          border-radius: 8px;
        }
        & button:hover {
          cursor: pointer;
        }
        & button:not(:last-child) {
          margin-right: 1rem;
        }
        .modal-close {
          background-color: transparent;
          font-weight: 600;

          &:hover {
            color: rgba(54, 67, 72, 0.8);
          }
        }
        .submit {
          background-color: #364348;
          color: #fff;

          &:hover {
            background-color: rgba(54, 67, 72, 0.8);
          }
        }
      }
    }
  }
`;

const Modal = ({ show, close, title, children, onConfirm }) => {
  return ReactDOM.createPortal(
    <>
      {show ? (
        <StyledWrapper onClick={() => close()}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <header className="modal_header">
              <h2 className="modal_header-title"> {title} </h2>
              <span onClick={() => close()}>&#x2718;</span>
            </header>
            <main className="modal_content"> {children} </main>
            <footer className="modal_footer">
              <button className="modal-close" onClick={close}>
                Cancel
              </button>

              <button className="submit" onClick={onConfirm}>
                Submit
              </button>
            </footer>
          </div>
        </StyledWrapper>
      ) : null}
    </>,
    document.getElementById("modal")
  );
};

export default Modal;
