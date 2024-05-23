import { useSelector } from "react-redux";
import { useState, useEffect } from "react";
import Spinner from "../components/shared/Spinner";
import Layout from "../components/shared/Layout/Layout";
import Modal from "../components/shared/modal/Modal";
import API from "../services/Api";
import moment from "moment";

const Homepage = () => {
  const { loading, error } = useSelector((state) => state.auth);
  const [data, setData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [searchCategory, setSearchCategory] = useState("");
  const [nameSortOrder, setNameSortOrder] = useState("asc");
  const [dateSortOrder, setDateSortOrder] = useState("asc");

  // Get blood records
  const getBloodRecords = async () => {
    try {
      const { data } = await API.get("/inventory/get-inventory");
      if (data?.success) {
        setData(data?.inventory);
        setFilteredData(data?.inventory);
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getBloodRecords();
  }, []);

  // Filter data based on search term and category
  useEffect(() => {
    if (!searchTerm) {
      setFilteredData(data);
      return;
    }

    const filtered = data.filter((record) => {
      if (searchCategory === "name") {
        const donorName = record.donor ? record.donor.name : null;
        const hospitalName = record.hospital
          ? record.hospital.hospitalName
          : null;
        const nameValue = donorName || hospitalName;
        const lowerCaseSearchTerm = searchTerm.toLowerCase();
        const lowerCaseNameValue = nameValue ? nameValue.toLowerCase() : "";
        return lowerCaseNameValue.includes(lowerCaseSearchTerm);
      }

      if (searchCategory === "createdAt") {
        const searchDate = moment(record.createdAt, "YYYY-MM-DD").format(
          "YYYY-MM-DD"
        );
        const searchTermDate = moment(searchTerm, "DD/MM/YYYY").format(
          "YYYY-MM-DD"
        );
        return searchDate === searchTermDate;
      }

      const searchValue = record[searchCategory];
      const lowerCaseSearchTerm = searchTerm.toLowerCase();
      const lowerCaseRecordValue = searchValue
        ? searchValue.toString().toLowerCase()
        : "";
      return lowerCaseRecordValue.includes(lowerCaseSearchTerm);
    });

    setFilteredData(filtered);
  }, [searchTerm, searchCategory, data]);

  // Handle sorting by name
  const handleNameSort = () => {
    const sortedData = [...filteredData].sort((a, b) => {
      const nameA = (a.donor ? a.donor.name : a.hospital.hospitalName) || "";
      const nameB = (b.donor ? b.donor.name : b.hospital.hospitalName) || "";
      return nameSortOrder === "asc"
        ? nameA.localeCompare(nameB)
        : nameB.localeCompare(nameA);
    });

    setFilteredData(sortedData);
    setNameSortOrder(nameSortOrder === "asc" ? "desc" : "asc");
  };

  // Handle sorting by date
  const handleDateSort = () => {
    const sortedData = [...filteredData].sort((a, b) => {
      return dateSortOrder === "asc"
        ? moment(a.createdAt).valueOf() - moment(b.createdAt).valueOf()
        : moment(b.createdAt).valueOf() - moment(a.createdAt).valueOf();
    });

    setFilteredData(sortedData);
    setDateSortOrder(dateSortOrder === "asc" ? "desc" : "asc");
  };

  return (
    <Layout>
      {error && <span>{alert(error)}</span>}
      {loading ? (
        <Spinner />
      ) : (
        <div className="container">
          <h4
            className="ms-4"
            data-bs-toggle="modal"
            data-bs-target="#staticBackdrop"
            style={{ cursor: "pointer" }}
          >
            <i className="fa-solid fa-plus text-success py-4"></i> Update
            Inventory
          </h4>

          {/* Search input fields */}
          <div className="mb-3">
            <input
              type="text"
              className="form-control mb-2"
              placeholder="Search"
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
              <option value="bloodGroup">Blood Group</option>
              <option value="inventoryType">Inventory Type</option>
              <option value="email">Email</option>
              <option value="createdAt">Date</option>
            </select>
          </div>

          <table className="table table-striped table-bordered">
            <thead>
              <tr>
                <th scope="col" onClick={handleNameSort}>
                  Name
                  <button className="btn btn-sm">
                    {nameSortOrder === "asc" ? "▲" : "▼"}
                  </button>
                </th>
                <th scope="col">Blood Group</th>
                <th scope="col">Inventory Type</th>
                <th scope="col">Quantity</th>
                <th scope="col">Email</th>
                <th scope="col" onClick={handleDateSort}>
                  Date & Time
                  <button className="btn btn-sm">
                    {dateSortOrder === "asc" ? "▲" : "▼"}
                  </button>
                </th>
              </tr>
            </thead>
            <tbody>
              {filteredData.map((record) => (
                <tr key={record._id}>
                  <td>
                    {record.donor
                      ? record.donor.name
                      : record.hospital.hospitalName}
                  </td>
                  <td>{record.bloodGroup}</td>
                  <td>{record.inventoryType}</td>
                  <td>{record.quantity} (ml)</td>
                  <td>{record.email}</td>
                  <td>
                    {moment(record.createdAt).format("DD/MM/YYYY hh:mm A")}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          <Modal />
        </div>
      )}
    </Layout>
  );
};

export default Homepage;
