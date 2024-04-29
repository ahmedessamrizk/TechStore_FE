import axios from "axios";
import Joi from "joi";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { baseURL } from "../../index.js";

export default function Login() {
  //Data
  const [user, setUser] = useState({
    email: "",
    password: "",
  });
  const [errList, setErrList] = useState([]);
  const [apiRes, setApiRes] = useState(null);
  let navigate = useNavigate();

  //Functions
  function getUser(e) {
    let inputValue = e.target.value;
    let newUser = { ...user };
    newUser[e.target.id] = inputValue;
    setUser(newUser);
  }

  async function saveUser(e) {
    e.preventDefault();
    const schema = Joi.object({
      email: Joi.string()
        .required()
        .email({ minDomainSegments: 2, tlds: { allow: ["com", "net"] } })
        .required(),
      password: Joi.string()
        
    });
    let joiResponse = schema.validate(user, { abortEarly: false });
    if (joiResponse.error) {
      setErrList(joiResponse.error.details);
    } else {
        try {
            let { data } = await axios.post(`${baseURL}/auth/signin`, user);
            localStorage.setItem("token", data.token);
            navigate("/home");
        } catch (error) {
            console.log(error)
            setApiRes(error.response.data.message);
        }
    }
  }

  function getError(key) {
    for (const error of errList) {
      if (error.context.key == key) {
        return error.message;
      }
    }
    return "";
  }

  return (
    <>
      <div className="container">
        <div className="row">
          <div className="col-lg-6 offset-lg-3 px-2">
            <div className="login-form mt-5">
              <h2 className="mb-3 d-flex justify-content-center border-bottom pb-2">
                Log in
              </h2>
              <form onSubmit={saveUser}>
                <label htmlFor="email"> Email: </label>
                <input
                  onChange={getUser}
                  type="email"
                  id="email"
                  className="mt-3 form-control"
                  placeholder="email"
                />
                <p className=" fs-6 text-danger mb-3"> {getError("email")}</p>

                <label htmlFor="password"> Password: </label>
                <input
                  onChange={getUser}
                  type="password"
                  id="password"
                  className="mt-3 form-control"
                  placeholder="password"
                />
                <p className=" fs-6 text-danger mb-3">
                  {" "}
                  {getError("password")}
                </p>

                <button type="submit" className="my-2 btn btn-outline-info">
                  {" "}
                  Log in
                </button>
                <p className=" fs-6 text-danger mb-3"> {apiRes}</p>
              </form>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
