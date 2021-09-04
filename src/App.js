import { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";

import Toast from "./components/Toast";

import ApiClient from "./api";
import { setAuth } from "./redux/authReducer";
import Tasks from "./pages/tasks";

function App() {
  const toast = useSelector((state) => state.toast);
  const dispatch = useDispatch();

  useEffect(() => {
    const getAuthDetails = () => {
      dispatch(async (dispatch) => {
        const authData = await ApiClient(
          `${process.env.REACT_APP_BASE_URL}/login`,
          "POST",
          {
            Accept: "application/json",
            "Content-Type": "application/json",
          },
          {
            email: "good@test3.com",
            password: "12345678",
          }
        );
        const authToken = await authData.results.token;

        const userData = await ApiClient(
          `${process.env.REACT_APP_BASE_URL}/user?company_id=${process.env.REACT_APP_COMPANY_ID}&product=outreach`,
          "GET",
          {
            Authorization: "Bearer " + authToken,
            Accept: "application/json",
            "Content-Type": "application/json",
          }
        );
        const userId = await userData.results.user_id;

        const userDropDownData = await ApiClient(
          `${process.env.REACT_APP_BASE_URL}/team?company_id=${process.env.REACT_APP_COMPANY_ID}&product=outreach`,
          "GET",
          {
            Authorization: "Bearer " + authToken,
            Accept: "application/json",
            "Content-Type": "application/json",
          }
        );
        const userDropDown = await userDropDownData.results.data;

        dispatch(
          setAuth({ token: authToken, id: userId, users: userDropDown })
        );
      });
    };

    getAuthDetails();
  }, [dispatch]);

  return (
    <div>
      <Tasks />
      {toast.visible && <Toast />}
    </div>
  );
}

export default App;
