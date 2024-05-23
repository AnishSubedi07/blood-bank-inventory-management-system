import React, { useState, useEffect, useRef } from "react";
import Header from "../../components/shared/Layout/Header";
import API from "../../services/Api";
import Chart from "chart.js/auto";

const Analytics = () => {
  const [data, setData] = useState([]);
  const [selectedBloodGroup, setSelectedBloodGroup] = useState("");
  const [bloodGroupData, setBloodGroupData] = useState([]);
  const chartRef = useRef(null);

  const colors = [
    "#D6589F",
    "#FB6D48",
    "#A79277",
    "#007F73",
    "#9CAFAA",
    "#EFBC9B",
    "#008DDA",
    "#8576FF",
  ];

  // Function to fetch blood group data
  const getBloodGroupData = async () => {
    try {
      const { data } = await API.get("/analytics/bloodGroups-data");
      if (data?.success) {
        setData(data?.bloodGroupData);
      }
    } catch (error) {
      console.log(error);
    }
  };

  // Function to filter data based on selected blood group
  useEffect(() => {
    if (selectedBloodGroup) {
      const filteredData = data.filter(
        (record) => record.bloodGroup === selectedBloodGroup
      );
      setBloodGroupData(filteredData);
    } else {
      setBloodGroupData(data);
    }
  }, [selectedBloodGroup, data]);

  // Function to render line graph
  useEffect(() => {
    if (bloodGroupData.length > 0) {
      const ctx = document.getElementById("bloodGroupChart");
      if (chartRef.current) {
        chartRef.current.destroy();
      }
      chartRef.current = new Chart(ctx, {
        type: "line",
        data: {
          labels: bloodGroupData.map((record) => record.bloodGroup),
          datasets: [
            {
              label: "Total In (ML)",
              data: bloodGroupData.map((record) => record.totalIn),
              backgroundColor: "rgba(214, 88, 159, 0.5)",
              borderColor: "#D6589F",
              borderWidth: 1,
            },
            {
              label: "Total Out (ML)",
              data: bloodGroupData.map((record) => record.totalOut),
              backgroundColor: "rgba(0, 127, 115, 0.5)",
              borderColor: "#007F73",
              borderWidth: 1,
            },
          ],
        },
        options: {
          scales: {
            y: {
              beginAtZero: true,
            },
          },
        },
      });
    }
  }, [bloodGroupData]);

  useEffect(() => {
    getBloodGroupData();
  }, []);

  return (
    <>
      <Header />
      <div className="d-flex flex-row flex-wrap">
        {bloodGroupData.map((record, i) => (
          <div
            className="card m-2 p-1"
            key={i}
            style={{ width: "18rem", backgroundColor: `${colors[i]}` }}
          >
            <div className="card-body">
              <h5 className="card-title bg-light text-dark text-center mb-3">
                {record.bloodGroup}
              </h5>
              <p className="card-text">
                Total In: <b>{record.totalIn} (ML)</b>
              </p>
              <p className="card-text">
                Total Out: <b>{record.totalOut} (ML)</b>
              </p>
            </div>
            <div className="card-footer text-light bg-dark text-center">
              Total Available: <b>{record.availableBlood} (ML)</b>
            </div>
          </div>
        ))}
      </div>

      <h1 className="mt-4 mx-3">Graphical Representation</h1>
      <div
        className="card m-3 mt-3"
        style={{ width: "50rem", border: "solid" }}
      >
        <canvas id="bloodGroupChart"></canvas>
      </div>
    </>
  );
};

export default Analytics;
