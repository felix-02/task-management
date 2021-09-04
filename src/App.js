import Tasks from "./pages/tasks";

import { useSelector, useDispatch } from "react-redux";
import Toast from "./components/Toast";
import { useEffect } from "react";

function App() {
  const toast = useSelector((state) => state.toast);
  const dispatch = useDispatch();

  useEffect(() => {
    const getAuthDetails = () => {
      dispatch(async (dispatch) => {
        // fetch token
        const authToken = await fetch("https://stage.api.sloovi.com/login", {
          method: "POST",
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email: "good@test3.com",
            password: "12345678",
          }),
        })
          .then((res) => res.json())
          .then((data) => data.results.token);

        const userId = await fetch(
          "https://stage.api.sloovi.com/user?company_id=company_0336d06ff0ec4b3b9306ddc288482663&product=outreach",
          {
            method: "GET",
            headers: {
              Authorization: "Bearer " + authToken,
              Accept: "application/json",
              "Content-Type": "application/json",
            },
          }
        )
          .then((res) => res.json())
          .then((data) => data.results.user_id);

        const userDropDown = await fetch(
          "https://stage.api.sloovi.com/team?company_id=company_0336d06ff0ec4b3b9306ddc288482663&product=outreach",
          {
            method: "GET",
            headers: {
              Authorization: "Bearer " + authToken,
              Accept: "application/json",
              "Content-Type": "application/json",
            },
          }
        )
          .then((res) => res.json())
          .then((data) => data.results.data);

        dispatch({
          type: "SET_AUTH",
          payload: { token: authToken, id: userId, users: userDropDown },
        });
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
