import React, { useEffect, useState } from "react";
import { Title } from "@mantine/core";
import { BarChart } from "@mantine/charts";
import "@mantine/charts/styles.css";
import styles from "./TopTen.module.css";

const getColor = (name) => {
  switch (name) {
    case "ja":
      return "green";
    case "nein":
      return "red";
    case "Enthaltung":
      return "blue";
    case "ungültig":
      return "brown";
    case "nichtabgegeben":
      return "gray";
    default:
      return "darkGray";
  }
};

const TopTen = () => {
  const [barChartData, setBarChartData] = useState([]);

  useEffect(() => {
    fetch(`http://localhost:3000/data/top10`)
      .then((response) => {
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        return response.json();
      })
      .then((data) => {
        setBarChartData(data);
      })
      .catch((error) => {
        console.error("There was a problem with the fetch operation:", error);
      });
  }, []);

  const DynamicBarChart = ({ data }) => {
    const keys = data.reduce((allKeys, item) => {
      Object.keys(item).forEach((key) => {
        if (key !== "bezeichnung" && !allKeys.includes(key)) {
          allKeys.push(key);
        }
      });
      return allKeys;
    }, []);

    const series = keys.map((key) => ({
      name: key,
      color: getColor(key.toLowerCase()),
    }));

    return (
      <div className={styles.topTen}>
        <Title order={1}>Top 10</Title>
        <BarChart
          h={300}
          data={data}
          dataKey="bezeichnung"
          tooltipAnimationDuration={200}
          type="stacked"
          yAxisProps={{ width: 80 }}
          series={series}
        />
      </div>
    );
  };

  return <DynamicBarChart data={barChartData} />;
};

export default TopTen;
