export default function authHeader() {
  // const user = JSON.parse(JSON.parse(localStorage.getItem('persist:user')).userInfo);
  const accessToken = localStorage.getItem("accessToken");
  // console.log("🚀 ~ file: auth-header.js:4 ~ authHeader ~ localStorage.getItem('persist:user')", localStorage.getItem('persist:user'))
  // console.log("🚀 ~ file: auth-header.js:3 ~ authHeader ~ user", user)

  if (accessToken) {
    return { "x-access-token": accessToken };
  } else {
    return {};
  }
}
