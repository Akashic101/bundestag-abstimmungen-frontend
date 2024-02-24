import React, { useEffect, useState } from "react";
import { Title } from "@mantine/core";
import { BarChart } from "@mantine/charts";
import "@mantine/charts/styles.css";
import styles from "./WorstTen.module.css";
import { SegmentedControl } from '@mantine/core';

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

const WorstTen = () => {
  const [barChartData, setBarChartData] = useState([]);
  const [datum, setDatum] = useState<[Date | null, Date | null]>([null, null]);
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear().toString());

  useEffect(() => {
    fetch(`http://localhost:3000/data/datum`)
      .then((response) => {
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        return response.json();
      })
      .then((data) => {
        const formattedDatum = data.map((dateString) => new Date(dateString));
        setDatum(formattedDatum);
      })
      .catch((error) => {
        console.error("There was a problem with the fetch operation:", error);
      });
  }, []);

  useEffect(() => {

    if(selectedYear == 'Alle') {
      setSelectedYear('')
    }

    fetch(`http://localhost:3000/data/worst10/${selectedYear}`)
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
  }, [selectedYear]);

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
        <Title order={1}>Worst 10</Title>
        <Title order={5}>
          Daten von {datum[0]?.toLocaleDateString('de-DE')} - {datum[1]?.toLocaleDateString('de-DE')}
        </Title>
        <SegmentedControl value={selectedYear} onChange={setSelectedYear} data={['Alle', `${new Date().getFullYear()}`, `${new Date().getFullYear()-1}`, `${new Date().getFullYear()-2}`]} />
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

export default WorstTen;
