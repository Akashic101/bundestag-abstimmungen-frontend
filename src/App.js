import React from "react";
import SpecificMember from "./components/SpecificMember/SpecificMember.tsx";
import TopTen from "./components/TopTen/TopTen.tsx";
import WorstTen from "./components/WorstTen/WorstTen.tsx";
import "@mantine/charts/styles.css";
import { Divider } from "@mantine/core";

function App() {
  return (
    <div className="root">
      <TopTen />
      <Divider my="md" />
      <WorstTen />
      <Divider my="md" />
      <SpecificMember />
    </div>
  );
}

export default App;
