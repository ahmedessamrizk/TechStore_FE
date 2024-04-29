import React, { useEffect, useState } from "react";
import Joi from "joi";
import axios from "axios";
import $, { get } from "jquery";
import { Link } from "react-router-dom";
import "./Admin.css";
import { baseURL } from "../../index.js";

export default function AdminProducts({ profile }) {
  const [loading, setLoading] = useState(true);
  const [product, setProduct] = useState({
    title: "",
    price: 0,
    description: "",
    category: "",
    imageUrl: "",
  });
  const [users, setUsers] = useState([]);
  const [products, setProducts] = useState([]);
  const [isProduct, setIsProduct] = useState(true);
  const [errList, setErrList] = useState([]);
  const userEmail = profile.email,
    user_ID = profile._id;
  useEffect(() => {
    getProducts();
    getUsers();
    disableButton();
  }, []);

  // Product Panel
  function disableButton() {
    $("#addProductBtn").attr("disabled", "disabled");
  }
  let newProduct = { ...product };
  function addProduct(e) {
    newProduct[e.target.id] = e.target.value;
    setProduct(newProduct);
    validateProduct(newProduct);
  }
  function clrProduct() {
    $("#title").val("");
    $("#price").val("");
    $("#description").val("");
    $("#category").val("");
    $("#imageUrl").val("");
  }
  function validateProduct(newProduct) {
    const schema = Joi.object({
        title: Joi.string().min(3).required(),
        description: Joi.string().min(3).required(),
        price: Joi.number().required().min(1),
        category: Joi.string().required(),
        imageUrl: Joi.string().required()
    });
    let { error } = schema.validate(newProduct, { abortEarly: false });
    if (error) {
      console.log(error);
        setErrList(error.details);
      $("#addProductBtn").attr("disabled", "disabled");
    } else {
      $("#addProductBtn").removeAttr("disabled");
    }
  }

  function getError(key) {
    for (const error of errList) {
      if (error.context.key == key && error.context.value !='' ) {
        return error.message;
      }
    }
    return "";
  }

  async function saveProduct(e) {
    try {
      e.preventDefault();
      let { data } = await axios.post(`${baseURL}/product`, product, {
        headers: {
          authorization: `test__${localStorage.getItem("token")}`,
        },
      });

      if (data.message == "Done") {
        disableButton();
        clrProduct();
        getProducts();
      }
      
    } catch (error) {
      console.log(error)
    }
  }
  async function getProducts() {
    setLoading(true);
    let { data } = await axios.get(`${baseURL}/product/`);
    setProducts(data.products);
    setLoading(false);
  }
  let productId = ''
  function showProductData(id, proId) {
    $("#updateProductBtn").css("display", "inline");
    localStorage.setItem("productID", proId);
    $("#addProductBtn").removeAttr("disabled");
    $("#title").val(products[id].title);
    $("#price").val(products[id].price);
    $("#description").val(products[id].description);
    $("#category").val(products[id].category);
    $("#imageUrl").val(products[id].imageUrl);
  }
  
  async function updateProduct(e) {
    e.preventDefault();
    console.log(`${baseURL}/product/${localStorage.getItem("productID")}`)
    let { data } = await axios.put(
      `${baseURL}/product/${localStorage.getItem("productID")}`,
      {
        title: $("#title").val(),
        price: $("#price").val(),
        category: $("#category").val(),
        description: $("#description").val(),
        imageUrl: $("#imageUrl").val(),
      }, {
        headers: {
          authorization: `test__${localStorage.getItem("token")}`,
        },
      }
    );
    console.log(data)
    if (data.message == "Done") {
      getProducts();
      $("#updateProductBtn").css("display", "none");
      clrProduct();
    }
  }
  async function delProduct(id) {
    console.log(id)
    let { data } = await axios.delete(`${baseURL}/product/${id}`, {
        headers: {
          authorization: `test__${localStorage.getItem("token")}`,
        },
      });
      console.log(data)
    if(data.message == "Done"){
        getProducts();
    }
  }

  //=========================================================================================
  //UserPanel
  async function getUsers() {
    setLoading(true);
    let { data } = await axios.get(`${baseURL}/user/`, {
      headers: {
        authorization: `test__${localStorage.getItem("token")}`,
      },
    });
    setUsers(data.users);
    setLoading(false);
  }
  async function makeAdmin(id) {
    let adminValue;
    users[id]?.admin == "1" ? (adminValue = "0") : (adminValue = "1");
    console.log(`${baseURL}/user/${users[id]._id}`);
    let { data } = await axios.patch(
      `${baseURL}/user/${users[id]._id}`,
      {
        adminValue: adminValue,
      },
      {
        headers: {
          authorization: `test__${localStorage.getItem("token")}`,
        },
      }
    );
    console.log(data);
    if (data.message == "Done") getUsers();
  }

  return (
    <>
      <section className="admin">
        <div className="container">
          <div className="admin-buttons w-100 d-flex justify-content-end">
            <div className="mt-4">
              {profile.admin == 2 ? (
                <>
                  <button
                    className="btn btn-outline-primary me-3 hvr-float-shadow "
                    onClick={() => {
                      setIsProduct(true);
                    }}
                  >
                    <i className="fa-brands fa-product-hunt pe-2"></i> Manage
                    Products{" "}
                  </button>
                  <button
                    className="btn btn-outline-warning hvr-float-shadow "
                    onClick={() => {
                      setIsProduct(false);
                    }}
                  >
                    <i className="fa-solid fa-users pe-2"></i> Manage Users{" "}
                  </button>
                </>
              ) : (
                ""
              )}
            </div>
          </div>
          <div className={isProduct ? "col-md-10 offset-md-1" : "d-none"}>
            <div className="product-form p-3 mt-5 mx-5">
              <h3> Product </h3>
              <form action="">
                <label htmlFor="title"> Name </label>
                <input
                  type="text"
                  id="title"
                  className="form-control mb-2"
                  onChange={addProduct}
                />
                <p className=" fs-6 text-danger mb-3">
                  {" "}
                  {getError("title")}
                </p>
                <label htmlFor="category"> Category </label>
                <select
                  className="form-select form-select-md mb-3"
                  id="category"
                  aria-label=".form-select-md example"
                  onChange={addProduct}
                >
                  <option value={""}>Choose Category</option>
                  <option value="Laptop">Laptop</option>
                  <option value="Mobile">Mobile</option>
                  <option value="PC">PC</option>
                  <option value="Accessories">Accessories</option>
                </select>

                <label htmlFor="price"> Price </label>
                <input
                  type="number"
                  id="price"
                  className="form-control mb-2"
                  onChange={addProduct}
                />
                <p className=" fs-6 text-danger mb-3">
                  {" "}
                  {getError("price")}
                </p>
                <label htmlFor="description"> Description </label>
                <input
                  type="text"
                  id="description"
                  className="form-control mb-2"
                  onChange={addProduct}
                />
                <p className=" fs-6 text-danger mb-3">
                  {" "}
                  {getError("description")}
                </p>
                <label htmlFor="imageUrl"> ImageURL </label>
                <input
                  type="text"
                  id="imageUrl"
                  className="form-control mb-2"
                  onChange={addProduct}
                />
                <p className=" fs-6 text-danger mb-3">
                  {" "}
                  {getError("imageUrl")}
                </p>
                <button
                  type="submit"
                  className="btn btn-success me-2"
                  data-bs-toggle="modal"
                  data-bs-target="#checkedModal"
                  id="addProductBtn"
                  onClick={saveProduct}
                >
                  Add
                </button>
                <button
                  type="submit"
                  className="btn btn-primary"
                  data-bs-toggle="modal"
                  id="updateProductBtn"
                  data-bs-target="#checkedModal"
                  onClick={updateProduct}
                >
                  Update
                </button>
              </form>
            </div>
          </div>
        </div>
        <div
          className={isProduct ? "table-responsive mt-5 mb-4 px-2" : "d-none"}
        >
          <table className="table  table-custom table-striped table-hover  mt-4 text-center">
            <thead>
              <tr>
                <th scope="col">#</th>
                <th scope="col"> ImageURL </th>
                <th scope="col"> Name </th>
                <th scope="col"> Category </th>
                <th scope="col"> Description </th>
                <th scope="col"> Price </th>
                <th scope="col"> Edit </th>
                <th scope="col"> Delete </th>
              </tr>
            </thead>
            <tbody id="productTable">
              {products?.map((product, idx) => {
                return (
                    product.createdBy._id === profile._id?
                  <tr key={idx}>
                    <th scope="row">{idx + 1}</th>
                    <td>
                      {" "}
                      <img src={product.imageUrl} className="img-fluid" />
                    </td>
                    <td> {product.title} </td>
                    <td> {product.category} </td>
                    <td> {product.description} </td>
                    <td> {product.price} </td>
                    <td>
                      <button
                        className="btn btn-primary btn-sm me-1"
                        onClick={() => {
                          showProductData(idx, product._id);
                        }}
                      >
                        {" "}
                        update{" "}
                      </button>
                    </td>
                    <td>
                      <button
                        className="btn btn-danger btn-sm"
                        onClick={() => {
                          delProduct(product._id);
                        }}
                      >
                        {" "}
                        delete{" "}
                      </button>{" "}
                    </td>
                  </tr>:
                  ''
                );
              })}
            </tbody>
          </table>
        </div>

        <div className={isProduct ? "d-none" : "user-form p-3 m-3"}>
          <h3> Users </h3>
          <div className="table-responsive ">
            <table className="table table-striped table-hover mt-4 text-center">
              <thead>
                <tr>
                  <th scope="col">#</th>
                  <th scope="col"> Name </th>
                  <th scope="col"> Email </th>
                  <th scope="col"> Age </th>
                  <th scope="col"> Admin </th>
                </tr>
              </thead>
              <tbody>
                {
                  loading?
                  <div className=" w-100 h-100 d-flex justify-content-center align-items-center">
                    <div class="sk-circle">
                      <div class="sk-circle1 sk-child"></div>
                      <div class="sk-circle2 sk-child"></div>
                      <div class="sk-circle3 sk-child"></div>
                      <div class="sk-circle4 sk-child"></div>
                      <div class="sk-circle5 sk-child"></div>
                      <div class="sk-circle6 sk-child"></div>
                      <div class="sk-circle7 sk-child"></div>
                      <div class="sk-circle8 sk-child"></div>
                      <div class="sk-circle9 sk-child"></div>
                      <div class="sk-circle10 sk-child"></div>
                      <div class="sk-circle11 sk-child"></div>
                      <div class="sk-circle12 sk-child"></div>
                    </div>
                  </div>
                  :

                users?.map((user, idx) => {
                  return (
                    <>
                      {user._id != user_ID ? (
                        <tr key={idx}>
                          <th scope="row"> {idx} </th>
                          <td> {user.firstName + " " + user.lastName} </td>
                          <td> {user.email} </td>
                          <td> {user.age} </td>
                          <td>
                            {user.admin == 0 ? (
                              <button
                                className="btn btn-success me-2"
                                onClick={() => {
                                  makeAdmin(idx);
                                }}
                              >
                                {" "}
                                make admin{" "}
                              </button>
                            ) : (
                              <button
                                className="btn btn-danger"
                                onClick={() => {
                                  makeAdmin(idx);
                                }}
                              >
                                {" "}
                                remove admin{" "}
                              </button>
                            )}
                          </td>
                        </tr>
                      ) : (
                        ""
                      )}
                    </>
                  );
                })
                }
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* Modals */}

      {/* Done modal */}
      <div
        className="modal fade"
        id="checkedModal"
        tabIndex="-1"
        aria-labelledby="exampleModalLabel"
        aria-hidden="true"
      >
        <div className="modal-dialog">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title" id="exampleModalLabel">
                Done
              </h5>
              <button
                type="button"
                className="btn-close"
                data-bs-dismiss="modal"
                aria-label="Close"
              ></button>
            </div>
            <div className="modal-body">
              <div className="wrapper">
                {" "}
                <svg
                  className="checkmark"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 52 52"
                >
                  {" "}
                  <circle
                    className="checkmark__circle"
                    cx="26"
                    cy="26"
                    r="25"
                    fill="none"
                  />{" "}
                  <path
                    className="checkmark__check"
                    fill="none"
                    d="M14.1 27.2l7.1 7.2 16.7-16.8"
                  />
                </svg>
              </div>
            </div>
            <div className="modal-footer">
              <button
                type="button"
                className="btn btn-danger"
                data-bs-dismiss="modal"
                onClick={clrProduct}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
