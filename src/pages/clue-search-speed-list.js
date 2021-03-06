import React from "react";
import { graphql } from "gatsby";
import { Bar } from "react-chartjs-2";
import { withStyles } from "@material-ui/core/styles";
import { Container, Hidden, Checkbox, Select, MenuItem, TableContainer, Table, TableHead, TableBody, TableRow, TableCell, IconButton, Paper } from "@material-ui/core";
import { Tooltip } from "@material-ui/core";
import { Grid } from "@material-ui/core";
import { Zoom } from "@material-ui/core";
import MoreVertIcon from "@material-ui/icons/MoreVert";
import Head from "../components/head";
import Layout from "../components/layout";
import * as Utils from "../commons/utils";

const VERSION = "20210921.21260501";
const APPKEY = "clue-search-speed-meter";
const ELITECLASS_NAME = ["未昇進", "昇進１", "昇進２"];

const styles = (theme) => ({
  mainContainer: {
    [theme.breakpoints.down("xs")]: {
      padding: "5px",
    },
  },
  mainTable: {
    "& .MuiTableCell-sizeSmall": {
      "&:last-child": {
        paddingRight: "0px",
      },
    },
  },
  mainCell: {
    [theme.breakpoints.down("xs")]: {
      padding: "4px 4px 4px 8px",
    },
    [theme.breakpoints.down(350)]: {
      fontSize: "10px",
    },
  },
  skillCell: {
    minWidth: "40%",
    [theme.breakpoints.down("sm")]: {
      padding: "4px 4px 4px 8px",
      width: "1.0em",
      textAlign: "right",
    },
    [theme.breakpoints.down(350)]: {
      fontSize: "10px",
    },
  },
  checkboxCell: {
    width: "1em",
    padding: "0px 10px",
    [theme.breakpoints.down("xs")]: {
      padding: "0px 0px 0px 0px",
    },
    [theme.breakpoints.down(350)]: {
      fontSize: "10px",
    },
  },
  headerCell: {
    [theme.breakpoints.down("xs")]: {
      padding: "4px 4px 8px 0px",
      verticalAlign: "top",
      textAlign: "center",
    },
    [theme.breakpoints.down(350)]: {
      fontSize: "10px",
    },
  },
  horizontaBar: {
    minHeight: "500px",
    height: "60vh",
    [theme.breakpoints.down("xs")]: {
      //height: "75vh",
    },
  },
  operatorName: {
    whiteSpace: "nowrap",
    [theme.breakpoints.down("xs")]: {
      width: "5.2em",
      maxWidth: "100%",
      overflow: "hidden",
      textOverflow: "ellipsis",
    },
  },
  eliteSelect: {
    fontSize: "0.875rem",
    [theme.breakpoints.down(350)]: {
      fontSize: "10px",
    },
  },
});

const rarityBonuses = {
  1: 5,
  2: 5,
  3: 5,
  4: 7,
  5: 9,
  6: 10,
};
const eliteBonuses = {
  0: 0,
  1: 8,
  2: 16,
};
const options = {
  indexAxis: "y",
  maintainAspectRatio: false,
  responsive: true,
  plugins: {
    legend: {
      display: false,
    },
    tooltip: {
      callbacks: {
        label: function (context) {
          var label = context.dataset.label || "";
          return `${label}: +${context.raw}%`;
        },
      },
    },
  },
  scaleShowValues: true,
  scales: {
    yAxes: {
      ticks: {
        stepSize: 1,
        autoSkip: false,
      },
      scaleLabel: {
        display: true,
      },
    },
  },

  elements: {
    bar: {
      borderWidth: 1,
    },
  },
};

const HorizontalBar = React.forwardRef((props, ref) => {
  const { data, classes } = props;
  return (
    <div className={classes.horizontaBar}>
      <div style={{ position: "relative", width: "100%", height: "100%" }}>
        <Bar ref={ref} data={data} options={options} />
      </div>
    </div>
  );
});

const OperatorTable = (props) => {
  const { classes } = props;
  const [operators, setOperators] = React.useState(props.operators);
  const [eleteClass, setEleteClass] = React.useState(-1);

  const updateOperators = (ops) => {
    setOperators(ops);
    props.onOperatorsChange(ops);

    const savedata = {
      version: VERSION,
      data: ops,
    };
    localStorage.setItem(APPKEY, JSON.stringify(savedata));
  };
  const onSelectionChange = (i, e) => {
    const news = operators.slice();
    news[i].checked = e.target.checked;
    updateOperators(news);
  };
  const onEliteClassChange = (i, e) => {
    const news = operators.slice();
    const target = news[i];
    target.elite = e.target.value;
    target.speed = rarityBonuses[target.rarity] + eliteBonuses[target.elite] + target.skills[target.elite].value;
    updateOperators(news);
    setEleteClass(-1);
  };
  const onHeaderSelectionChange = (e) => {
    const news = operators.slice();
    news.forEach((op) => (op.checked = e.target.checked));
    updateOperators(news);
  };
  const onHeaderEliteClassChange = (e) => {
    const value = e.target.value;
    if (value >= 0) {
      const news = operators.slice();
      news.forEach((op) => {
        if (op.rarity >= 4) {
          op.elite = value;
        } else if (op.rarity === 3) {
          op.elite = value >= 2 ? 1 : value;
        }
        op.speed = rarityBonuses[op.rarity] + eliteBonuses[op.elite] + op.skills[op.elite].value;
      });
      updateOperators(news);
    }
    setEleteClass(value);
  };
  const renderMenuItem = (rarity) => {
    const limit = [-1, 0, 0, 1, 2, 2, 2];
    const indexes = rarity ? [...Array(limit[rarity] + 1).keys()] : [];
    return indexes.map((index) => {
      return (
        <MenuItem value={index} key={index}>
          {ELITECLASS_NAME[index]}
        </MenuItem>
      );
    });
  };
  return (
    <TableContainer>
      <Table size="small" area-label="table of operaters" className={classes.mainTable}>
        <TableHead>
          <TableRow>
            <TableCell className={classes.checkboxCell} style={{ width: "1em" }}>
              <Checkbox color="default" checked={operators.every((op) => op.checked)} onChange={onHeaderSelectionChange} inputProps={{ "aria-label": "select all operators" }} />
            </TableCell>
            <TableCell className={classes.headerCell} style={{ width: "auto" }}>
              NAME
            </TableCell>
            <TableCell className={classes.headerCell}>
              <Hidden smDown>RARITY</Hidden>
              <Hidden mdUp>R</Hidden>
            </TableCell>
            <TableCell className={classes.headerCell}>
              <Select disableUnderline value={eleteClass} className={classes.eliteSelect} onChange={onHeaderEliteClassChange}>
                <MenuItem value={-1} key={-1}>
                  昇進
                </MenuItem>
                {renderMenuItem(6)}
              </Select>
            </TableCell>
            <TableCell className={classes.headerCell}>SPEED</TableCell>
            <TableCell className={classes.skillCell}>
              <Hidden smDown>SKILL</Hidden>
            </TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {operators.map((op, i) => (
            <React.Fragment key={i}>
              <TableRow className={classes.mainRow}>
                <TableCell className={classes.checkboxCell}>
                  <Checkbox color="default" checked={op.checked} onChange={(e) => onSelectionChange(i, e)}></Checkbox>
                </TableCell>
                <TableCell className={classes.mainCell}>
                  <Tooltip title={op.name} TransitionComponent={Zoom} arrow placement="bottom" leaveTouchDelay={3000} enterTouchDelay={40} disableHoverListener>
                    <Grid container direction="row" alignItems="center" wrap="nowrap">
                      <div style={{ backgroundColor: op.color, width: "1em", height: "1em", display: "inline-block", marginRight: "0.5em" }}></div>
                      <span className={classes.operatorName}>{op.name}</span>
                    </Grid>
                  </Tooltip>
                </TableCell>
                <TableCell className={classes.mainCell}>{op.rarity}</TableCell>
                <TableCell className={classes.mainCell}>
                  <Select disableUnderline className={classes.eliteSelect} value={op.elite} onChange={(e) => onEliteClassChange(i, e)}>
                    {renderMenuItem(op.rarity)}
                  </Select>
                </TableCell>
                <TableCell className={classes.mainCell}>+{op.speed}%</TableCell>
                <TableCell className={classes.skillCell}>
                  <Hidden smDown>{op.skills[op.elite].description || "なし"}</Hidden>
                  <Hidden mdUp>
                    <Tooltip title={op.skills[op.elite].description || "なし"} TransitionComponent={Zoom} arrow placement="bottom" leaveTouchDelay={3000} enterTouchDelay={40}>
                      <IconButton size="small">
                        <MoreVertIcon color="action" />
                      </IconButton>
                    </Tooltip>
                  </Hidden>
                </TableCell>
              </TableRow>
            </React.Fragment>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

const Page = (props) => {
  const chartReference = React.useRef();
  const { classes, data } = props;

  const createChartData = (ops) => {
    const calc = (op) => {
      const rarityBonus = rarityBonuses[op.rarity];
      const eliteBonus = op.elite * 8;
      const skillValue = op.skills[op.elite].value;
      return rarityBonus + eliteBonus + skillValue;
    };

    const selections = ops.filter((op) => op.checked).slice();
    selections.sort((a, b) => calc(b) - calc(a));

    const labels = selections.map((op) => `${op.name} [${ELITECLASS_NAME[op.elite]}]`);
    const chartData = {
      labels: labels,
      datasets: [
        {
          label: "捜索速度",
          barParcentage: 0.8,
          data: selections.map((op) => calc(op)),
          backgroundColor: selections.map((op) => op.backgroundColor),
          borderColor: selections.map((op) => op.borderColor),
        },
      ],
    };
    return chartData;
  };

  const handleOperatorsChange = (ops) => {
    const chartData = createChartData(ops);
    const chart = chartReference.current;

    if (chart.data && chart.data.datasets.length) {
      chart.data.labels = chartData.labels;
      chart.data.datasets[0].data = chartData.datasets[0].data;
      chart.data.datasets[0].backgroundColor = chartData.datasets[0].backgroundColor;
      chart.data.datasets[0].borderColor = chartData.datasets[0].borderColor;
    } else {
      chart.data = chartData;
    }

    chart.update();
  };
  const loadOperators = (saveddata) => {
    if (saveddata) {
      const savedops = JSON.parse(saveddata);
      if (savedops.version === VERSION) {
        return savedops.data;
      }
    }

    const ops = JSON.parse(JSON.stringify(data.allOperatorsJson.nodes));
    ops.forEach((op) => {
      op.checked = true;
      op.elite = 0;
      op.skills = op.skills.reception;
      op.speed = rarityBonuses[op.rarity] + eliteBonuses[op.elite] + op.skills[op.elite].value;
      op.backgroundColor = Utils.transparentize(op.color, 0.5);
      op.borderColor = op.color;
    });
    return ops;
  };

  const saveddata = typeof localStorage !== "undefined" ? localStorage.getItem(APPKEY) : undefined;
  const operators = loadOperators(saveddata);
  const charData = createChartData(operators);
  const page = {
    title: "手がかり捜索速度一覧",
    image: "/images/clue.png",
    description: "応接室に配置した場合のオペレータの手がかり捜索速度を補正込みでランク表示します",
  };
  return (
    <Layout>
      <Head title={page.title} description={page.description} image={page.image} />
      <Container maxWidth="lg" className={classes.mainContainer}>
        <div style={{ marginBottom: "20px" }}>{page.title}</div>
        <Paper variant="outlined" style={{ padding: "10px", marginBottom: "20px" }}>
          <HorizontalBar classes={classes} ref={chartReference} data={charData} />
        </Paper>
        <Paper variant="outlined" style={{ padding: "10px 5px 30px 5px", marginBottom: "20px" }}>
          <OperatorTable classes={classes} operators={operators} onOperatorsChange={(ops) => handleOperatorsChange(ops)} />
        </Paper>
      </Container>
    </Layout>
  );
};

export default withStyles(styles)(Page);

export const query = graphql`
  query MyQuery {
    allOperatorsJson(sort: { fields: [rarity, name], order: [DESC, ASC] }, filter: { skills: { reception: { elemMatch: { value: { ne: null } } } } }) {
      nodes {
        id
        color
        name
        rarity
        skills {
          reception {
            description
            value
          }
        }
      }
    }
  }
`;
