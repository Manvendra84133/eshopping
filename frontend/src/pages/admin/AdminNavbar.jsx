import axios from 'axios';
import React from 'react'
import { BASE_URL } from '../../helper';

function AdminNavbar() {

  const handleAdminLogout = async () => {

    try {
      const admintoken = localStorage.getItem("admintoken");

      if (admintoken) {
        await axios.post(`${BASE_URL}/api/admin/logout`, {}, { headers: { Authorization: `Bearer ${admintoken}` } });
      }

    } catch (error) {
      console.log("Logout Error:", error);
    }

    localStorage.removeItem("admintoken");
    localStorage.removeItem("admin");
    window.location.href = "/admin/login";
  }

  return (
    <>
      <nav className="navbar navbar-expand-lg navbar-light bg-light">
        <div className="container-fluid d-flex justify-content-between">
          <a className="navbar-brand" href="/admin/login">Admin</a>

          <ul className="navbar-nav ms-auto mb-2 mb-lg-0 me-3">
            <li className="nav-item">
              <a className="nav-link active btn btn-sm btn-success text-white px-5" aria-current="page" onClick={handleAdminLogout}>Logout</a>
            </li>
          </ul>

        </div>
      </nav >
    </>
  )
}

export default AdminNavbar