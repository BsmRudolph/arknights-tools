import React from "react";
import { graphql } from "gatsby";
import { Bar } from "react-chartjs-2";
import { withStyles } from "@material-ui/core/styles";
import { Container, Hidden, Checkbox, Select, MenuItem, TableContainer, Table, TableHead, TableBody, TableRow, TableCell } from "@material-ui/core";
import * as Utils from "../commons/utils";

const VERSION = "20210917.175102";
const APPKEY = "clue-search-speed-meter";

const styles = (theme) => ({
  mainRow: {
    [theme.breakpoints.down("xs")]: {
      "& td": {
        borderBottom: "none",
      },
    },
  },
  subRow: {
    display: "none",
    [theme.breakpoints.down("xs")]: {
      display: "table-row",
    },
  },
});

const rarityBonuses = {
  1: 5,
  2: 5,
  3: 5,
  4: 7,
  5: 8,
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
  elements: {
    bar: {
      borderWidth: 1,
    },
  },
};

const HorizontalBar = React.forwardRef((props, ref) => {
  const { data } = props;
  return (
    <div style={{ height: "40vh" }}>
      <div style={{ position: "relative", width: "100%", height: "100%" }}>
        <Bar ref={ref} data={data} options={options} />
      </div>
    </div>
  );
});

const OperatorTable = (props) => {
  const [operators, setOperators] = React.useState(props.operators);
  const { classes } = props;

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
  };
  const onHeaderSelectionChange = (e) => {
    const news = operators.slice();
    news.forEach((op) => (op.checked = e.target.checked));
    updateOperators(news);
  };

  return (
    <TableContainer>
      <Table area-label="table of operaters">
        <TableHead>
          <TableRow>
            <TableCell padding="checkbox">
              <Checkbox color="primary" checked={operators.every((op) => op.checked)} onChange={onHeaderSelectionChange} inputProps={{ "aria-label": "select all operators" }} />
            </TableCell>
            <TableCell>NAME</TableCell>
            <TableCell>RARITY</TableCell>
            <TableCell>ELITE</TableCell>
            <TableCell>SPEED</TableCell>
            <Hidden xsDown>
              <TableCell className="hidden-xs">SKILL</TableCell>
            </Hidden>
          </TableRow>
        </TableHead>
        <TableBody>
          {operators.map((op, i) => (
            <React.Fragment key={i}>
              <TableRow className={classes.mainRow}>
                <TableCell padding="checkbox">
                  <Checkbox color="primary" checked={op.checked} onChange={(e) => onSelectionChange(i, e)}></Checkbox>
                </TableCell>
                <TableCell>{op.name}</TableCell>
                <TableCell>{op.rarity}</TableCell>
                <TableCell>
                  <Select value={op.elite} onChange={(e) => onEliteClassChange(i, e)}>
                    <MenuItem value={0} key={0}>
                      E0
                    </MenuItem>
                    <MenuItem value={1} key={1}>
                      E1
                    </MenuItem>
                    <MenuItem value={2} key={2}>
                      E2
                    </MenuItem>
                  </Select>
                </TableCell>
                <TableCell>{op.speed}% up</TableCell>
                <Hidden xsDown>
                  <TableCell>{op.skills[op.elite].description}</TableCell>
                </Hidden>
              </TableRow>
              <TableRow className={classes.subRow}>
                <TableCell></TableCell>
                <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={3}>
                  {op.skills[op.elite].description}
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
      return rarityBonuses[op.rarity] + eliteBonuses[op.elite] + op.skills[op.elite].value;
    };

    const selections = ops.filter((op) => op.checked).slice();
    selections.sort((a, b) => calc(b) - calc(a));

    const labels = selections.map((op) => op.name);
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

    const ops = data.allOperatorsJson.edges.map((d) => d.node);
    ops.forEach((op) => {
      op.checked = true;
      op.elite = 0;
      op.speed = rarityBonuses[op.rarity] + eliteBonuses[op.elite] + op.skills[op.elite].value;
      op.backgroundColor = Utils.transparentize(op.color, 0.5);
      op.borderColor = op.color;
    });
    return ops;
  };
  const saveddata = localStorage.getItem(APPKEY);
  const operators = loadOperators(saveddata);
  const charData = createChartData(operators);

  return (
    <main>
      <Container maxWidth="lg">
        <div style={{ marginBottom: "20px" }}>hoge hoge foo</div>
        <div style={{ marginBottom: "20px" }}>
          <HorizontalBar ref={chartReference} data={charData} />
        </div>
        <div>
          <OperatorTable classes={classes} operators={operators} onOperatorsChange={(ops) => handleOperatorsChange(ops)} />
        </div>
      </Container>
    </main>
  );
};

export default withStyles(styles)(Page);

export const query = graphql`
  query MyQuery {
    allOperatorsJson {
      edges {
        node {
          id
          skills {
            description
            value
          }
          rarity
          name
          color
        }
      }
    }
  }
`;
