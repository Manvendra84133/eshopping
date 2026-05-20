import React, { useEffect, useState } from "react";
import axios from "axios";
import "./Dashboard.css";
import { useNavigate } from "react-router-dom";

function Dashboard() {
  const [user, setUser] = useState(null);
  const [products, setProducts] = useState([]);

  const navigate = useNavigate();

  const BASE_URL = process.env.REACT_APP_BASE_URL;

  // get user
  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("user"));
    setUser(storedUser);
  }, []);

  // fetch products
  useEffect(() => {
    const storedProducts = JSON.parse(localStorage.getItem("products"));

    if (storedProducts?.length > 0) {
      setProducts(storedProducts);
    } else {
      axios
        .get(`${BASE_URL}/api/products/getallproducts`)
        .then((res) => {
          setProducts(res.data);
          localStorage.setItem("products", JSON.stringify(res.data));
        })
        .catch((err) => console.log(err));
    }
  }, []);

  const handleProductClick = (id) => {
    navigate(`/product/${id}`);
  };

  return (
    <div className="container mt-4">

      {/* USER INFO */}
      {user && (
        <div className="card p-3 mb-4 shadow">
          <div className="d-flex align-items-center">
            <img
              src={user.userprofile}
              alt=""
              style={{ width: "70px", borderRadius: "50%" }}
            />
            <div className="ms-3">
              <h5>
                {user.firstname} {user.lastname}
              </h5>
              <p>{user.email}</p>
            </div>
          </div>
        </div>
      )}

      {/* PRODUCTS */}
      <div className="row mt-4">
        {products.map((product) => (
          <div className="col-md-3 mb-3" key={product.id}>
            <div
              className="card mb-4 shadow"
              onClick={() => handleProductClick(product.id)}
            >
              <img
                src={product.image}
                className="card-img-top"
                height="200"
              />
              <div className="card-body">
                <h6>{product.title.slice(0, 40)}</h6>
                <h5>${product.price}</h5>
                <p className="card-text text-muted">
                  {product.description.slice(0, 80)}...
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>

    </div>
  );
}

export default Dashboard;