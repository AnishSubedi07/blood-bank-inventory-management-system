import React, { useEffect, useState } from "react";
import Layout from "../../components/shared/Layout/Layout";
import { useSelector } from "react-redux";
import API from "../../services/Api";

const OrganisationPage = () => {
  // Get current user
  const { user } = useSelector((state) => state.auth);
  const [data, setData] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchCategory, setSearchCategory] = useState("organisationName");
  const [filteredData, setFilteredData] = useState([]);
  const [sortOrderName, setSortOrderName] = useState("asc");
  const [sortOrderAddress, setSortOrderAddress] = useState("asc");

  const getOrg = async () => {
    try {
      let response;
      if (user?.role === "donor") {
        response = await API.get("/inventory/get-organisation");
      } else if (user?.role === "hospital") {
        response = await API.get("/inventory/get-organisation-for-hospital");
      }
      if (response?.data?.success) {
        setData(response.data.organisations);
        setFilteredData(response.data.organisations);
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getOrg();
  }, [user]);

  // Filter data based on search query and category
  useEffect(() => {
    const filteredResults = data.filter((record) =>
      record[searchCategory]
        ? record[searchCategory]
            .toString()
            .toLowerCase()
            .includes(searchQuery.toLowerCase())
        : false
    );
    setFilteredData(filteredResults);
  }, [searchQuery, searchCategory, data]);

  // Handle sorting for Name column
  const handleSortName = () => {
    const sortedData = [...filteredData].sort((a, b) => {
      const valueA = a.organisationName || "";
      const valueB = b.organisationName || "";
      return sortOrderName === "asc"
        ? valueA.localeCompare(valueB)
        : valueB.localeCompare(valueA);
    });

    setFilteredData(sortedData);
    setSortOrderName(sortOrderName === "asc" ? "desc" : "asc");
  };

  // Handle sorting for Address column
  const handleSortAddress = () => {
    const sortedData = [...filteredData].sort((a, b) => {
      const valueA = a.address || "";
      const valueB = b.address || "";
      return sortOrderAddress === "asc"
        ? valueA.localeCompare(valueB)
        : valueB.localeCompare(valueA);
    });

    setFilteredData(sortedData);
    setSortOrderAddress(sortOrderAddress === "asc" ? "desc" : "asc");
  };

  return (
    <Layout>
      <div className="mb-3 mx-2 mt-2">
        <input
          type="text"
          className="form-control"
          placeholder="Search"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
        <select
          className="form-select mt-2"
          value={searchCategory}
          onChange={(e) => setSearchCategory(e.target.value)}
        >
          <option value="organisationName">Name</option>
          <option value="email">Email</option>
          <option value="phone">Phone</option>
          <option value="address">Address</option>
        </select>
      </div>
      <div className="mx-2">
        <table className="table table-striped table-bordered">
          <thead>
            <tr>
              <th scope="col" onClick={handleSortName}>
                Name
                <button className="btn btn-sm">
                  {sortOrderName === "asc" ? "▲" : "▼"}
                </button>
              </th>
              <th scope="col">Email</th>
              <th scope="col">Phone</th>
              <th scope="col" onClick={handleSortAddress}>
                Address
                <button className="btn btn-sm">
                  {sortOrderAddress === "asc" ? "▲" : "▼"}
                </button>
              </th>
            </tr>
          </thead>
          <tbody>
            {filteredData.map((record) => (
              <tr key={record._id}>
                <td>{record.organisationName || ""}</td>
                <td>{record.email || ""}</td>
                <td>{record.phone || ""}</td>
                <td>{record.address || ""}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Layout>
  );
};

export default OrganisationPage;
