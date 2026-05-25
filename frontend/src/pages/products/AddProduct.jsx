import axios from "axios";
import React, { useState } from "react";
import { BASE_URL } from "../../helper";
import AdminNavbar from "../admin/AdminNavbar";
import toast, { Toaster } from "react-hot-toast";


const AddProduct = () => {

  const [product, setProduct] = useState({
    id: "",
    title: "",
    price: "",
    description: "",
    category: "",
    image: null,
    rate: "",
    count: ""
  });

  // NORMAL INPUTS
  const handleChange = (e) => {
    setProduct({ ...product, [e.target.name]: e.target.value });
  };

  // FILE INPUT
  const handleFileChange = (e) => {
    setProduct({ ...product, image: e.target.files[0] });
  };

  // SUBMIT
  const handleSubmit = async (e) => {
    e.preventDefault();

    // console.log(product);
    // console.log(product.image);

    try {
      const formData = new FormData();
      formData.append("id", product.id);
      formData.append("title", product.title);
      formData.append("price", product.price);
      formData.append("description", product.description);
      formData.append("category", product.category);
      formData.append("image", product.image);
      formData.append("rate", product.rate);
      formData.append("count", product.count);


      const admintoken = localStorage.getItem("admintoken");
      const response = await axios.post(`${BASE_URL}/api/products/addproduct`, formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${admintoken}`
          }
        }
      );

      // console.log(response.data);
      toast.success("Product Added Successfully");
    } catch (error) {
      // console.log(error);
      alert("Failed To Add Product");
    }
  };


  return (

    <>
      <Toaster />
      <AdminNavbar />
      <div style={{ padding: "20px" }} className="px-3 py-4 shadow text-center w-75 m-auto mt-3 rounded-3">
        <h1 className="alert alert-dark">Admin Panel</h1>

        <form onSubmit={handleSubmit}>
          <input type="number" name="id" placeholder="Enter product ID" onChange={handleChange} className="form-control mb-4" />

          <input type="text" name="title" placeholder="Enter product title" onChange={handleChange} className="form-control mb-4" />

          <input type="number" name="price" placeholder="Price" onChange={handleChange} className="form-control mb-4" />

          <textarea name="description" placeholder="Description" onChange={handleChange} className="form-control mb-4" />

          <input type="text" name="category" placeholder="Category" onChange={handleChange} className="form-control mb-4" />

          <input type="file" accept="image/*" name="productimage" onChange={handleFileChange} className="form-control mb-4" />

          <input type="number" step="0.1" name="rate" placeholder="Rating" onChange={handleChange} className="form-control mb-4" />

          <input type="number" name="count" placeholder="Rating Count" onChange={handleChange} className="form-control mb-4" />

          <button type="submit" className="btn btn-success btn-sm px-4">Add Product</button>
        </form>
      </div>
    </>
  );
};

export default AddProduct;