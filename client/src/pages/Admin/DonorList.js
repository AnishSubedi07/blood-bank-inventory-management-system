import React, { useEffect, useState } from "react";
import Layout from "../../components/shared/Layout/Layout";
import API from "../../services/Api";

const DonorList = () => {
  const [data, setData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [searchCategory, setSearchCategory] = useState("");
  const [nameSortOrder, setNameSortOrder] = useState("asc");
  const [addressSortOrder, setAddressSortOrder] = useState("asc");

  const getDonors = async () => {
    try {
      const { data } = await API.get("/admin/donor-list");
      if (data?.success) {
        setData(data?.donorData);
        setFilteredData(data?.donorData);
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getDonors();
  }, []);

  // Filter data based on search term and category
  useEffect(() => {
    if (!searchTerm) {
      setFilteredData(data);
      return;
    }

    const filtered = data.filter((record) =>
      record[searchCategory]
        .toString()
        .toLowerCase()
        .includes(searchTerm.toLowerCase())
    );
    setFilteredData(filtered);
  }, [searchTerm, searchCategory, data]);

  // Handle sorting
  const handleSort = (category) => {
    const sortedData = [...filteredData].sort((a, b) => {
      if (category === "name") {
        const nameA = a[category] || "";
        const nameB = b[category] || "";
        return nameSortOrder === "asc"
          ? nameA.localeCompare(nameB)
          : nameB.localeCompare(nameA);
      } else if (category === "address") {
        const addressA = a[category] || "";
        const addressB = b[category] || "";
        return addressSortOrder === "asc"
          ? addressA.localeCompare(addressB)
          : addressB.localeCompare(addressA);
      }
      return 0;
    });

    setFilteredData(sortedData);
    if (category === "name") {
      setNameSortOrder(nameSortOrder === "asc" ? "desc" : "asc");
    } else if (category === "address") {
      setAddressSortOrder(addressSortOrder === "asc" ? "desc" : "asc");
    }
  };

  //DELETE FUNCTION
  const handleDelete = async (id) => {
    try {
      let answer = window.prompt(
        "Are You Sure You Want To Delete This Donar",
        "Sure"
      );
      if (!answer) return;
      const { data } = await API.delete(`/admin/delete-donor/${id}`);
      alert(data?.message);
      window.location.reload();
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <Layout>
      <div className="container">
        {/* Search input fields */}
        <div className="mb-3 mt-2">
          <input
            type="text"
            className="form-control mb-2"
            placeholder="Search term"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <select
            className="form-select"
            value={searchCategory}
            onChange={(e) => setSearchCategory(e.target.value)}
          >
            <option value="">Select category</option>
            <option value="name">Name</option>
            <option value="email">Email</option>
            <option value="phone">Phone</option>
            <option value="address">Address</option>
          </select>
        </div>

        <div className="mt-2">
          <table className="table table-striped table-bordered">
            <thead>
              <tr>
                <th scope="col" onClick={() => handleSort("name")}>
                  Name
                  <button className="btn btn-sm">
                    {nameSortOrder === "asc" ? "▲" : "▼"}
                  </button>
                </th>
                <th scope="col">Email</th>
                <th scope="col">Phone</th>
                <th scope="col" onClick={() => handleSort("address")}>
                  Address
                  <button className="btn btn-sm">
                    {addressSortOrder === "asc" ? "▲" : "▼"}
                  </button>
                </th>
                <th scope="col">Action</th>
              </tr>
            </thead>
            <tbody>
              {filteredData.map((record) => (
                <tr key={record._id}>
                  <td>{record.name || record.organisationName + "(ORG)"}</td>
                  <td>{record.email}</td>
                  <td>{record.phone}</td>
                  <td>{record.address}</td>
                  <td>
                    <button
                      className="btn btn-danger"
                      onClick={() => handleDelete(record._id)}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </Layout>
  );
};

export default DonorList;
