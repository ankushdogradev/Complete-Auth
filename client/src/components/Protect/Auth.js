import axios from "axios";
import Cookies from "universal-cookie";
const cookies = new Cookies();

axios.defaults.withCredentials = true;
class Auth {
  constructor() {
    this.authenticated = false;
  }

  isAuthenticated() {
    const accessToken = cookies.get("authSession");
    const refreshToken = cookies.get("refreshTokenID");

    if (!accessToken && !refreshToken) {
      return (this.authenticated = false);
    }

    if (accessToken && refreshToken) {
      return (this.authenticated = true);
    }

    if (!accessToken && refreshToken) {
      axios
        .post("/api/auth/refresh", {
          withCredentials: true,
        })
        .then(function (res) {
          console.log(res.data);
        })
        .catch(function (error) {
          console.log(error.response);
        });
    }
  }
}

export default new Auth();