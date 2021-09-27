import React from "react";
import { Container } from "@material-ui/core";
import Head from "../components/head";
import Layout from "../components/layout";

const generateData = (char, maxtime) => {
  var skill = char.skills[0];
  var data = [];
  var waittime = skill.requiredSp - skill.initialSp;
  var duration = -1;
  var totalCost = 0;
  var generatePerSec = skill.durationTime === 0 ? skill.generatedCost : skill.generatedCost / skill.durationTime;

  for (var i = 0; i < maxtime; i++) {
    if (i < char.cost) {
      data[i] = null;
      continue;
    }
    if (waittime <= 0) {
      duration = skill.durationTime;
      waittime = skill.requiredSp;
    } else {
      waittime--;
    }

    if (duration >= 0) {
      totalCost += generatePerSec;
      duration--;
    } else {
      duration = -1;
    }

    data[i] = totalCost;
  }

  return data;
};

const Page = (props) => {
  const page = {
    title: "コスト生成速度グラフ",
    image: "/images/clue.png",
    description: "時間当たりのコスト生成速度をグラフで表示",
  };
  return (
    <Layout>
      <Head title={page.title} description={page.description} image={page.image} />
      <Container maxWidth="lg">
        <div style={{ marginBottom: "20px" }}>{page.title}</div>
      </Container>
    </Layout>
  );
};

export default Page;
