import React, { useState, useEffect } from "react";
import "./Home.css";
import Joi from "joi";
import axios from "axios";
import $ from "jquery";
import { Link } from "react-router-dom";
import { baseURL } from "../../index.js";

export default function Home({ setCartItems, cartItems, profile }) {
  const [isGrid, setIsGrid] = useState(true);
  const [products, setProducts] = useState([]);
  const [category, setCategory] = useState("");
  const [pricelt, setPricelt] = useState("");
  const [pricegt, setPricegt] = useState("");
  const [priceASC, setPriceASC] = useState("");
  const [priceDESC, setPriceDESC] = useState("");
  const [dateASC, setDateASC] = useState("");
  const [dateDESC, setDateDESC] = useState("");
  const [productName, setProductName] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getProducts();
  }, [
    category,
    pricelt,
    pricegt,
    priceASC,
    priceDESC,
    productName,
    dateASC,
    dateDESC,
  ]);

  async function getProducts() {
    try {
      setLoading(true);
      let { data } = await axios.get(
        `${baseURL}/product?productName=${productName}&category=${category}&pricelt=${pricelt}&pricegt=${pricegt}&priceAsc=${priceASC}&priceDesc=${priceDESC}&dateAsc=${dateASC}&dateDesc=${dateDESC}`
      );
  
      setProducts(data.products);
      setLoading(false);
    } catch (error) {
      console.log(error)
    }
  }
  function getCategory(e) {
    $(e.target).addClass("chosenLink");
    $(e.target).parent().siblings().children().removeClass("chosenLink");
    setCategory(e.target.id);
  }
  function getPrice(e) {
    e.target.id == "pricelt"
      ? setPricelt(e.target.value)
      : setPricegt(e.target.value);
  }
  function getProductName(e) {
    setProductName(e.target.value);
  }
  function clrFilters() {
    setCategory("");
    $("#All").addClass("chosenLink");
    $("#All").parent().siblings().children().removeClass("chosenLink");
    $(".order li p").removeClass("colorRed");
    setProductName("");
    setPricelt("");
    setPricegt("");
    setProductName("");
    setPriceASC("");
    setPriceDESC("");
    setDateASC("");
    setDateDESC("");
    $("#search").val("");
    $("#pricelt").val("");
    $("#pricegt").val("");
  }
  function addToCart(product) {
    product.cartNumber = 1;
    let tempCart,
      exist = false;
    for (let i = 0; i < cartItems.length; i++) {
      if (cartItems[i].id == product._id) {
        exist = true;
        break;
      }
    }
    if (!exist) {
      tempCart = [...cartItems, product];
      setCartItems(tempCart);
      localStorage.setItem("cart", JSON.stringify(tempCart));
    }
  }
  function colorOrder(e) {
    $(e.target).addClass("colorRed");
    $(e.target).parent().siblings().children().removeClass("colorRed");
  }
  function getDate(date) {
    const d = new Date(date);
    console.log(d);
  }

  return (
    <>
      <header className="container-fluid px-5 home">
        <section className="home-nav mt-5">
          <nav className="navbar navbar-expand-lg navbar-dark ">
            <div className="container-fluid">
              <a className="navbar-brand fw-bold" href="#">
                Categories
              </a>
              <button
                className="navbar-toggler"
                type="button"
                data-bs-toggle="collapse"
                data-bs-target="#navbarContent"
                aria-controls="navbarSupportedContent"
                aria-expanded="false"
                aria-label="Toggle navigation"
              >
                <span className="navbar-toggler-icon"></span>
              </button>
              <div className="collapse navbar-collapse" id="navbarContent">
                <ul className="navbar-nav mx-auto mb-2 mb-lg-0">
                  <li className="nav-item">
                    <a
                      className="nav-link mx-3 hvr-underline-from-left"
                      href="#"
                      id="All"
                      onClick={getCategory}
                    >
                      All
                    </a>
                  </li>
                  <li className="nav-item mx-3">
                    <a
                      className="nav-link hvr-underline-from-left"
                      href="#"
                      id="PC"
                      onClick={getCategory}
                    >
                      PC
                    </a>
                  </li>
                  <li className="nav-item mx-3">
                    <a
                      className="nav-link hvr-underline-from-left"
                      href="#"
                      id="Laptop"
                      onClick={getCategory}
                    >
                      Laptop
                    </a>
                  </li>
                  <li className="nav-item mx-3">
                    <a
                      className="nav-link hvr-underline-from-left"
                      href="#"
                      id="Mobile"
                      onClick={getCategory}
                    >
                      Mobile
                    </a>
                  </li>
                  <li className="nav-item mx-3">
                    <a
                      className="nav-link hvr-underline-from-left"
                      href="#"
                      id="Accessories"
                      onClick={getCategory}
                    >
                      Accessories
                    </a>
                  </li>
                </ul>
                <form className="d-flex align-items-center">
                  <input
                    className="form-control me-2"
                    id="search"
                    type="search"
                    placeholder="Search"
                    aria-label="Search"
                    onChange={getProductName}
                  />
                  <label htmlFor="search">
                    <i className="fa-solid fa-magnifying-glass text-white d-block"></i>
                  </label>
                </form>
              </div>
            </div>
          </nav>
        </section>

        <section className="home-body mt-5">
          <div className="container-fluid">
            <div className="row">
              <div className="col-lg-2 col-md-3">
                <section className="side-bar">
                  <div className="row">
                    <div className="col-md-12 col-sm-5 col-6">
                      <div className="order-products twelve">
                        <h4>Order by</h4>
                        <ul className="order fs-5">
                          <li
                            className="my-2 hvr-glow"
                            onClick={() => {
                              setDateASC("");
                              setDateDESC(1);
                              setPriceASC("");
                              setPriceDESC("");
                            }}
                          >
                            <p onClick={colorOrder}>Recently Added</p>{" "}
                          </li>
                          <li
                            className="my-2 hvr-glow"
                            onClick={() => {
                              setDateASC(1);
                              setDateDESC("");
                              setPriceASC("");
                              setPriceDESC("");
                            }}
                          >
                            <p onClick={colorOrder}>Previously Added</p>{" "}
                          </li>
                          <li
                            className="my-2 hvr-glow"
                            onClick={() => {
                              setPriceASC(1);
                              setPriceDESC("");
                              setDateASC("");
                              setDateDESC("");
                            }}
                          >
                            <p onClick={colorOrder}>Price: low to high</p>{" "}
                          </li>
                          <li
                            className="my-2 hvr-glow"
                            onClick={() => {
                              setPriceASC("");
                              setPriceDESC(1);
                              setDateASC("");
                              setDateDESC("");
                            }}
                          >
                            {" "}
                            <p onClick={colorOrder}>Price: high to low</p>{" "}
                          </li>
                          <li className="my-2 hvr-glow">
                            {" "}
                            <button
                              className="btn btn-outline-danger"
                              onClick={clrFilters}
                            >
                              {" "}
                              Clear Filters{" "}
                            </button>{" "}
                          </li>
                        </ul>
                      </div>
                    </div>
                    <div className="col-md-12 col-sm-7 col-6">
                      <div className="price">
                        <h4>Price</h4>
                        <input
                          type="number"
                          className="form-control my-3 mb-2"
                          id="pricelt"
                          placeholder="Price less than"
                          onChange={getPrice}
                        />
                        <input
                          type="number"
                          className="form-control my-3"
                          id="pricegt"
                          placeholder="Price greater than"
                          onChange={getPrice}
                        />
                      </div>
                    </div>
                  </div>
                </section>
              </div>
              <div className="col-lg-10 col-md-9">
                {loading ? (
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
                ) : (
                  <section className="main ms-2">
                    <div className="division d-flex justify-content-between align-content-center">
                      <div className="division-brand">
                        <h4> Display by: </h4>
                      </div>

                      <div className="division-buttons">
                        <button
                          className="btn btn-outline-dark my-2 mx-2 hvr-float-shadow"
                          onClick={() => {
                            setIsGrid(true);
                          }}
                        >
                          <i className="fa-solid fa-table-cells"></i> GRID{" "}
                        </button>
                        <button
                          className="btn btn-outline-dark hvr-float-shadow"
                          onClick={() => {
                            setIsGrid(false);
                          }}
                        >
                          <i className="fa-solid fa-table-cells-large"></i> LIST{" "}
                        </button>
                      </div>
                    </div>

                    <div className="products mt-4">
                      <div className="container">
                        <div className="row g-4 position-relative">
                          {products?.length == 0 ? (
                            <>
                              <p className="fs-1">No avaliable items</p>
                            </>
                          ) : (
                            products?.map((product) => {
                              let idx;
                              const tempCart = JSON.parse(
                                localStorage.getItem("cart")
                              );
                              for (let i = 0; i < tempCart.length; i++) {
                                if (tempCart[i]._id == product._id) {
                                  idx = i;
                                  break;
                                }
                              }

                              const date = new Date(product.updatedAt);
                              const month = date.getMonth() + 1 + "";
                              const productDate =
                                date.getDate() +
                                "/" +
                                month.toString() +
                                "/" +
                                date.getFullYear();
                              return (
                                <div
                                  className={
                                    isGrid
                                      ? "col-lg-4 col-sm-6"
                                      : "col-lg-6 offset-lg-3 text-center"
                                  }
                                  key={product._id}
                                >
                                  <div className="product rounded-2 dropdown">
                                    <div className="card position-relative">
                                      <span className="position-absolute product-badge badge rounded-2 bg-danger">
                                        {product.category}
                                      </span>
                                      <div className="card-img">
                                        <img
                                          src={product.imageUrl}
                                          className="card-img-top img-fluid border-bottom"
                                          alt="..."
                                        />
                                      </div>
                                      <div className="card-body d-flex flex-column justify-content-between">
                                        <div className="content">
                                          <h5 className="card-title text-center">
                                            {product.title}
                                          </h5>
                                        </div>

                                        <p className="my-2 text-center">
                                          Price: {product.price}${" "}
                                        </p>
                                        <div className="add-to-cart-button text-center d-flex px-3 justify-content-center">
                                          <div className="details cursor pointer me-3">
                                            <p className="btn btn-dark">
                                              Details
                                            </p>
                                            <div className="layer text-center d-flex align-items-center justify-content-center">
                                              <div className="data">
                                                <h5 className="mt-5 mb-4 text-dark">
                                                  Name: {product.title}
                                                </h5>
                                                <p className="mb-2">
                                                  <span className="fw-bold">
                                                    Category:
                                                  </span>{" "}
                                                  {product.category}
                                                </p>
                                                <p className="card-text mb-2 mx-3">
                                                  <span className="fw-bold">
                                                    Description:
                                                  </span>{" "}
                                                  {product.description}
                                                </p>
                                                <p className="card-text mb-2">
                                                  <span className="fw-bold">
                                                    Added in:
                                                  </span>{" "}
                                                  {productDate}
                                                </p>
                                              </div>
                                            </div>
                                          </div>
                                          {profile?.admin != 0 ? (
                                            ""
                                          ) : (
                                            <button
                                              className={
                                                tempCart[idx]?.cartNumber
                                                  ? "btn btn-success disabled btn-flip  "
                                                  : "btn btn-primary btn-sm "
                                              }
                                              onClick={() => {
                                                addToCart(product);
                                              }}
                                              id="addToCartBtn"
                                              data-back="Add to Cart"
                                              data-front="Added!"
                                            >
                                              {tempCart[idx]?.cartNumber
                                                ? ""
                                                : "Add to cart"}
                                            </button>
                                          )}
                                        </div>
                                      </div>
                                      <div className="card-footer">
                                        <small className="text-muted">
                                          Last updated in {productDate}
                                        </small>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              );
                            })
                          )}
                        </div>
                      </div>
                    </div>
                  </section>
                )}
              </div>
            </div>
          </div>
        </section>
      </header>
    </>
  );
}
