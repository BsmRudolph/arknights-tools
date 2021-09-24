import { Link } from "gatsby";
import * as React from "react";
import Head from "../components/head";

const IndexPage = () => {
  return (
    <main>
      <Head title="Home" />
      <title>Home Page</title>
      <div>
        <Link to="/clue-search-speed-list">手がかり捜索速度一覧</Link>
      </div>
    </main>
  );
};

export default IndexPage;
