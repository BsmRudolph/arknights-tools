module.exports = {
  pathPrefix: "/arknights-tools",
  siteMetadata: {
    title: "Arknights Tools",
    titleTemplate: "%s - Arknights Tools",
    lang: "ja",
    description: "アークナイツ用の便利ツール",
    url: "https://BsmRudolph.github.io/arknights-tools",
    siteUrl: "https://BsmRudolph.github.io/arknights-tools",
    image: "/images/thumbnail.png",
    twitterUsername: "@BsmRudolph",
  },
  plugins: [
    {
      resolve: "gatsby-plugin-material-ui",
      options: {
        styleProvider: {
          injectFirst: true,
        },
      },
    },
    "gatsby-plugin-styled-components",
    "gatsby-plugin-react-helmet",
    "gatsby-plugin-sitemap",
    {
      resolve: "gatsby-plugin-manifest",
      options: {
        icon: "src/images/icon.png",
      },
    },
    "gatsby-transformer-json",
    {
      resolve: "gatsby-source-filesystem",
      options: {
        name: "data",
        path: `${__dirname}/src/data/`,
      },
    },
  ],
};
