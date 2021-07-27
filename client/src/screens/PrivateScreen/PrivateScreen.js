import React from "react";
// import axios from "axios";
import "./PrivateScreen.scss";

const PrivateScreen = ({ history }) => {
  // const [error, setError] = useState("");
  // const [privateData, setPrivateData] = useState("");

  // const logoutHandler = () => {
  //   localStorage.removeItem("userInfo");
  //   history.push("/loginRegister");
  // };

  // useEffect(() => {
  //   if (!localStorage.getItem("userInfo.token")) {
  //     history.push("/loginRegister");
  //   }

  //   const fetchPrivateData = async () => {
  //     const config = {
  //       header: {
  //         "Content-Type": "application/json",
  //         Authorization: `Bearer ${localStorage.getItem("userInfo.token")}`,
  //       },
  //     };

  //     try {
  //       const { data } = await axios.get("/api/private", config);
  //       setPrivateData(data.data);
  //     } catch (error) {
  //       localStorage.removeItem("userInfo");
  //       setError("You are not authorized, Please login");
  //       history.push("/loginRegister");
  //     }
  //   };

  //   fetchPrivateData();
  // }, [history]);
  return (
    <>
      {/* error ? <span className="error-message">{error}</span> :{" "} */}
      <>
        {/* <div style={{ background: "green", color: "white" }}>{privateData}</div> */}
        {/* <button onClick={logoutHandler}>Logout</button> */}
      </>
      <h1>Katy </h1>
    </>
  );
};

export default PrivateScreen;
