import axios from "axios";
import Joi from "joi";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { baseURL } from "../../index.js";

export default function Signup() {
  //Data
  const [user, setUser] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    age: "",
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
      firstName: Joi.string().min(3).max(10).alphanum().required(),
      lastName: Joi.string().min(3).max(10).alphanum().required(),
      email: Joi.string()
        .required()
        .email({ minDomainSegments: 2, tlds: { allow: ["com", "net"] } })
        .required(),
      password: Joi.string()
        .pattern(
          new RegExp(
            /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$/
          )
        )
        .messages({
          "string.pattern.base": `Minimum eight, at least one uppercase letter, one lowercase letter, one number and one special character`,
        }),
      age: Joi.number().required().min(12).max(80),
    });
    let joiResponse = schema.validate(user, { abortEarly: false });
    if (joiResponse.error) {
      setErrList(joiResponse.error.details);
    } else {
      try {
        let { data } = await axios.post(`${baseURL}/auth/signup`, user);
        setApiRes(null);
        navigate("/login");
      } catch (error) {
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
          <div className="col-lg-6 offset-lg-3 px-3">
            <div className="signup-form mt-4">
              <h2 className="mb-3 d-flex justify-content-center border-bottom pb-2">
                Sign up
              </h2>
              <form onSubmit={saveUser}>
                <label htmlFor="firstName"> firstName: </label>
                <input
                  onChange={getUser}
                  type="firstName"
                  id="firstName"
                  className="mt-3 form-control"
                  placeholder="firstName"
                />
                <p className=" fs-6 text-danger mb-3">
                  {" "}
                  {getError("firstName")}
                </p>

                <label htmlFor="lastName"> lastName: </label>
                <input
                  onChange={getUser}
                  type="lastName"
                  id="lastName"
                  className="mt-3 form-control"
                  placeholder="lastName"
                />
                <p className=" fs-6 text-danger mb-3">
                  {" "}
                  {getError("lastName")}
                </p>

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

                <label htmlFor="age"> Age: </label>
                <input
                  onChange={getUser}
                  type="age"
                  id="age"
                  className="mt-3 form-control"
                  placeholder="age"
                />
                <p className=" fs-6 text-danger mb-3"> {getError("age")}</p>

                <button type="submit" className="my-2 btn btn-outline-info">
                  {" "}
                  Sign up
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
