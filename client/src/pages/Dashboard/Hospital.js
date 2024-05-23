import React, { useEffect, useState } from "react";
import Layout from "../../components/shared/Layout/Layout";
import API from "../../services/Api";

const Hospital = () => {
  const [data, setData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [searchCategory, setSearchCategory] = useState("");
  const [nameSortOrder, setNameSortOrder] = useState("asc");
  const [addressSortOrder, setAddressSortOrder] = useState("asc");

  const getHospitals = async () => {
    try {
      const { data } = await API.get("/inventory/get-hospitals");
      if (data?.success) {
        setData(data?.hospitals);
        setFilteredData(data?.hospitals);
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getHospitals();
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
      if (category === "hospitalName") {
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
    if (category === "hospitalName") {
      setNameSortOrder(nameSortOrder === "asc" ? "desc" : "asc");
    } else if (category === "address") {
      setAddressSortOrder(addressSortOrder === "asc" ? "desc" : "asc");
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
            <option value="hospitalName">Name</option>
            <option value="email">Email</option>
            <option value="phone">Phone</option>
            <option value="address">Address</option>{" "}
          </select>
        </div>
        <table className="table table-striped table-bordered">
          <thead>
            <tr>
              <th scope="col" onClick={() => handleSort("hospitalName")}>
                Name
                <button className="btn btn-sm float-end">
                  {nameSortOrder === "asc" ? "▲" : "▼"}
                </button>
              </th>
              <th scope="col">Email</th>
              <th scope="col">Phone</th>
              <th scope="col" onClick={() => handleSort("address")}>
                Address
                <button className="btn btn-sm float-end">
                  {addressSortOrder === "asc" ? "▲" : "▼"}
                </button>
              </th>
            </tr>
          </thead>
          <tbody>
            {filteredData.map((record) => (
              <tr key={record._id}>
                <td>{record.hospitalName}</td>
                <td>{record.email}</td>
                <td>{record.phone}</td>
                <td>{record.address}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Layout>
  );
};

export default Hospital;
