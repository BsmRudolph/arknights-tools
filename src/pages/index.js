import React from "react";
import { Link } from "gatsby";
import { withPrefix } from 'gatsby'
import { Card, CardActionArea, CardMedia, CardContent } from "@material-ui/core";
import { Container } from "@material-ui/core";
import { Typography } from "@material-ui/core";
import Head from "../components/head";

const IndexPage = () => {
  return (
    <main>
      <Head title="Home" />
      <Container maxWidth="lg">
        <h1>Arknights Tools</h1>

        <Card style={{ maxWidth: 345 }}>
          <CardActionArea component={Link} to="/clue-search-speed-list">
            <CardMedia component="img" height="140" image={withPrefix("/images/clue.png")} alt="searching clue" />
            <CardContent>
              <Typography gutterBottom variant="h5" component="div" color="primary">
                手がかり捜索速度一覧
              </Typography>
              <Typography variant="body2">応接室に配置した場合のオペレータの手がかり捜索速度を補正込みでランク表示します</Typography>
            </CardContent>
          </CardActionArea>
        </Card>
      </Container>
    </main>
  );
};

export default IndexPage;
