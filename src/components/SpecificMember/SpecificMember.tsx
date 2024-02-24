import React, { useEffect, useState } from "react";
import { NativeSelect, Grid } from "@mantine/core";
import { DonutChart } from "@mantine/charts";
import "@mantine/charts/styles.css";

interface DonutChartData {
  name: string;
  value: number;
  color: string;
}

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
      return "white";
  }
};

function SpecificMember() {
  const [aktuelleFraktion, setAktuelleFraktion] = useState("");
  const [fraktionGruppen, setFraktionGruppen] = useState([]);
  const [mitgliederDerFraktion, setMitgliederDerFraktion] = useState([]);
  const [aktuellesMitglied, setAktuellesMitglied] = useState("");
  const [donutChartData, setDonutChartData] = useState<DonutChartData[]>([]);

  useEffect(() => {
    fetch(`http://localhost:3000/fraktiongruppe`)
      .then((response) => {
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        return response.json();
      })
      .then((data) => {
        setFraktionGruppen(data.sort());
        setAktuelleFraktion(data[Math.floor(Math.random() * data.length)]);
      })
      .catch((error) => {
        console.error("There was a problem with the fetch operation:", error);
      });
  }, []);

  useEffect(() => {
    if (aktuelleFraktion) {
      fetch(
        `http://localhost:3000/fraktiongruppe/${encodeURIComponent(aktuelleFraktion)}/mitglieder`,
      )
        .then((response) => {
          if (!response.ok) {
            throw new Error("Network response was not ok");
          }
          return response.json();
        })
        .then((data) => {
          const bezeichnungArray = data.map((item) => item.Bezeichnung);
          setMitgliederDerFraktion(bezeichnungArray.sort());
          setAktuellesMitglied(
            bezeichnungArray[
              Math.floor(Math.random() * bezeichnungArray.length)
            ],
          );
        })
        .catch((error) => {
          console.error("There was a problem with the fetch operation:", error);
        });
    }
  }, [aktuelleFraktion]);

  useEffect(() => {
    if (aktuelleFraktion) {
      fetch(
        `http://localhost:3000/mitglieder/${encodeURIComponent(aktuellesMitglied)}`,
      )
        .then((response) => {
          if (!response.ok) {
            throw new Error("Network response was not ok");
          }
          return response.json();
        })
        .then((data) => {
          const chartDataMap = {};

          data.forEach((item) => {
            const keys = [
              "ja",
              "nein",
              "Enthaltung",
              "ungültig",
              "nichtabgegeben",
            ];
            keys.forEach((key) => {
              if (item[key]) {
                let keyName = key;
                if (key === "nichtabgegeben" && item.Bemerkung) {
                  keyName += ` (${item.Bemerkung})`;
                }
                chartDataMap[keyName] = (chartDataMap[keyName] || 0) + 1;
              }
            });
          });

          const transformedData = Object.entries(chartDataMap).map(
            ([name, value]) => ({
              name: name.charAt(0).toUpperCase() + name.slice(1),
              value,
              color: getColor(name),
            }),
          );
          setDonutChartData(transformedData);
        })
        .catch((error) => {
          console.error("There was a problem with the fetch operation:", error);
        });
    }
  }, [aktuelleFraktion, aktuellesMitglied]);

  return (
    <Grid>
      <Grid.Col span={4}>
        <NativeSelect
          label="Fraktion/Gruppe"
          description="Wähle die Fraktion/Gruppe aus"
          onChange={(event) => setAktuelleFraktion(event.currentTarget.value)}
          value={aktuelleFraktion}
          data={fraktionGruppen}
        />
      </Grid.Col>
      <Grid.Col span={4}>
        <NativeSelect
          label="Abgeordneter"
          description="Wähle den Abgeordneten der ausgewählten Partei aus"
          value={aktuellesMitglied}
          disabled={!aktuelleFraktion}
          onChange={(event) => setAktuellesMitglied(event.currentTarget.value)}
          data={mitgliederDerFraktion}
        />
      </Grid.Col>
      <Grid.Col span={4}>
        <DonutChart
          paddingAngle={2}
          withLabelsLine
          withLabels
          chartLabel={aktuellesMitglied}
          data={donutChartData}
        />
      </Grid.Col>
    </Grid>
  );
}

export default SpecificMember;
