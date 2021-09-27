import React from "react";
import { Link } from "gatsby";
import { Container } from "@material-ui/core";
import "./layout.css";

const Header = () => {
  return (
    <header style={{ marginBottom: "1em" }}>
      <Link to="/">Home</Link>
    </header>
  );
};
const Footer = () => {
  return <footer style={{ marginTop: "1em" }}>footer</footer>;
};

const Layout = ({ children }) => {
  return (
    <Container style={{ display: "flex", minHeight: "100vh", flexDirection: "column" }}>
      <Header />
      <main style={{ flexGrow: 1 }}>{children}</main>
      <Footer />
    </Container>
  );
};

export default Layout;
