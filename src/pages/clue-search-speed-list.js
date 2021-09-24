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
import * as Utils from "../commons/utils";

const VERSION = "20210921.175104";
const APPKEY = "clue-search-speed-meter";
const ELITECLASS_NAME = ["未昇進", "昇進１", "昇進２"];

const styles = (theme) => ({
  mainContainer: {
    [theme.breakpoints.down("xs")]: {
      padding: "5px",
    },
  },
  mainRow: {
    [theme.breakpoints.down("xs")]: {
      "& td": {},
    },
  },
  subRow: {
    display: "none",
    [theme.breakpoints.down("xs")]: {
      display: "table-row",
    },
  },
  mainCell: {
    [theme.breakpoints.down("xs")]: {
      padding: "4px 4px 4px 8px",
    },
  },
  checkboxCell: {
    width: "1em",
    padding: "0px 10px",
    [theme.breakpoints.down("xs")]: {
      padding: "0px 0px 0px 0px",
    },
  },
  headerCell: {
    [theme.breakpoints.down("xs")]: {
      padding: "4px 4px 8px 0px",
      verticalAlign: "top",
      textAlign: "center",
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
  const { data } = props;
  return (
    <div style={{ height: "80vh" }}>
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
      <Table size="small" area-label="table of operaters">
        <TableHead>
          <TableRow>
            <TableCell className={classes.checkboxCell}>
              <Checkbox color="default" checked={operators.every((op) => op.checked)} onChange={onHeaderSelectionChange} inputProps={{ "aria-label": "select all operators" }} />
            </TableCell>
            <TableCell className={classes.headerCell} style={{ width: "15em" }}>
              NAME
            </TableCell>
            <TableCell className={classes.headerCell} style={{ width: "2em" }}>
              <Hidden xsDown>RARITY</Hidden>
              <Hidden smUp>R</Hidden>
            </TableCell>
            <TableCell className={classes.headerCell} style={{ width: "3em" }}>
              <Select disableUnderline value={eleteClass} style={{ fontSize: "0.875rem" }} onChange={onHeaderEliteClassChange}>
                <MenuItem value={-1} key={-1}>
                  昇進
                </MenuItem>
                {renderMenuItem(6)}
              </Select>
            </TableCell>
            <TableCell className={classes.headerCell} style={{ width: "4em" }}>
              SPEED
            </TableCell>
            <TableCell className={classes.headerCell} style={{ paddingRight: "0px" }}>
              <Hidden xsDown>SKILL</Hidden>
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
                  <Grid container direction="row" alignItems="center">
                    <div style={{ backgroundColor: op.color, width: "1em", height: "1em", display: "inline-block", marginRight: "0.5em" }}></div>
                    {op.name}
                  </Grid>
                </TableCell>
                <TableCell className={classes.mainCell}>{op.rarity}</TableCell>
                <TableCell className={classes.mainCell}>
                  <Select disableUnderline style={{ fontSize: "0.875rem" }} value={op.elite} onChange={(e) => onEliteClassChange(i, e)}>
                    {renderMenuItem(op.rarity)}
                  </Select>
                </TableCell>
                <TableCell className={classes.mainCell}>+{op.speed}%</TableCell>
                <TableCell className={classes.mainCell} style={{ paddingRight: "0px" }}>
                  <Hidden xsDown>{op.skills[op.elite].description}</Hidden>
                  <Hidden smUp>
                    <Tooltip title={op.skills[op.elite].description} TransitionComponent={Zoom} arrow placement="bottom" leaveTouchDelay={3000} enterTouchDelay={50}>
                      <IconButton size="small" style={{ minWidth: "1em" }}>
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
  const [savedata, setSavedata] = React.useState(null);
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

    const ops = data.allOperatorsJson.nodes; //edges.map((d) => d.node);
    ops.forEach((op) => {
      op.checked = true;
      op.elite = 0;
      op.speed = rarityBonuses[op.rarity] + eliteBonuses[op.elite] + op.skills[op.elite].value;
      op.backgroundColor = Utils.transparentize(op.color, 0.5);
      op.borderColor = op.color;
    });
    return ops;
  };

  React.useEffect(() => {
    setSavedata(localStorage.getItem(APPKEY));
  }, [setSavedata]);

  const operators = loadOperators(savedata);
  const charData = createChartData(operators);
  const page = {
    title: "手がかり捜索速度一覧",
    image: "/images/clue.png",
    description: "description",
  };
  return (
    <main>
      <Head title={page.title} description={page.description} image={page.image} />
      <Container maxWidth="lg" className={classes.mainContainer}>
        <div style={{ marginBottom: "20px" }}>{page.title}</div>
        <Paper variant="outlined" style={{ padding: "10px", marginBottom: "20px" }}>
          <HorizontalBar ref={chartReference} data={charData} />
        </Paper>
        <Paper variant="outlined" style={{ padding: "10px 5px 30px 5px", marginBottom: "20px" }}>
          <OperatorTable classes={classes} operators={operators} onOperatorsChange={(ops) => handleOperatorsChange(ops)} />
        </Paper>
      </Container>
    </main>
  );
};

export default withStyles(styles)(Page);

export const query = graphql`
  query MyQuery {
    allOperatorsJson(sort: { fields: [rarity, name], order: [DESC, ASC] }) {
      nodes {
        color
        elite
        id
        name
        rarity
        skills {
          description
          value
        }
      }
    }
  }
`;
