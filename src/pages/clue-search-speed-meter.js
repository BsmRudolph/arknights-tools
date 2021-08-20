import * as React from "react";
import { Container, Hidden, Checkbox, Select, MenuItem, TableContainer, Table, TableHead, TableBody, TableRow, TableCell } from "@material-ui/core";
import { withStyles } from "@material-ui/core/styles";
import { Bar } from "react-chartjs-2";

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

const operatorsAll = [
  {
    id: 1,
    checked: true,
    name: "name1",
    rarity: 4,
    elite: 1,
    acceleration: 45,
    skills: [
      { value: 10, description: "incease seach speed (10%)" },
      { value: 20, description: "incease seach speed (20%)" },
      { value: 45, description: "incease seach speed (45%)" },
    ],
  },
  {
    id: 2,
    checked: true,
    name: "name2",
    rarity: 6,
    elite: 2,
    acceleration: 25,
    skills: [
      { value: 10, description: "incease seach speed (10%)" },
      { value: 20, description: "incease seach speed (20%)" },
      { value: 45, description: "incease seach speed (45%)" },
    ],
  },
  {
    id: 3,
    checked: true,
    name: "name3",
    rarity: 5,
    elite: 2,
    acceleration: 40,
    skills: [
      { value: 10, description: "incease seach speed (10%)" },
      { value: 20, description: "incease seach speed (20%)" },
      { value: 45, description: "incease seach speed (45%)" },
    ],
  },
  {
    id: 4,
    checked: true,
    name: "name4",
    rarity: 5,
    elite: 0,
    acceleration: 35,
    skills: [
      { value: 10, description: "incease seach speed (10%)" },
      { value: 20, description: "incease seach speed (20%)" },
      { value: 45, description: "incease seach speed (45%)" },
    ],
  },
  {
    id: 5,
    checked: true,
    name: "name5",
    rarity: 6,
    elite: 2,
    acceleration: 45,
    skills: [
      { value: 10, description: "incease seach speed (10%)" },
      { value: 20, description: "incease seach speed (20%)" },
      { value: 45, description: "incease seach speed (45%)" },
    ],
  },
];

const options = {
  indexAxis: "y",
  maintainAspectRatio: false,
  responsive: true,
  elements: {
    bar: {
      borderWidth: 1,
    },
  },
};

class MeterGraph extends React.Component {
  calc(operator) {
    return rarityBonuses[operator.rarity] + eliteBonuses[operator.elite] + operator.skills[operator.elite].value;
  }
  render() {
    const selections = this.props.operators.filter((op) => op.checked).slice();
    selections.sort((a, b) => this.calc(b) - this.calc(a));

    const labels = selections.map((op) => op.name);
    const chartData = {
      labels: labels,
      datasets: [{ data: selections.map((op) => this.calc(op)), label: "LABEL", barParcentage: 0.8 }],
    };

    return (
      <div style={{ height: "40vh" }}>
        <div style={{ position: "relative", width: "100%", height: "100%" }}>
          <Bar data={chartData} options={options} />
        </div>
      </div>
    );
  }
}

class OperatorTable extends React.Component {
  render() {
    const { classes } = this.props;
    return (
      <TableContainer>
        <Table area-label="table of operaters">
          <TableHead>
            <TableRow>
              <TableCell padding="checkbox">
                <Checkbox inputProps={{ "aria-label": "select all operators" }} />
              </TableCell>
              <TableCell>NAME</TableCell>
              <TableCell>RARITY</TableCell>
              <TableCell>ELITE</TableCell>
              <Hidden xsDown>
                <TableCell className="hidden-xs">SKILL</TableCell>
              </Hidden>
            </TableRow>
          </TableHead>
          <TableBody>
            {this.props.operators.map((op, i) => (
              <React.Fragment key={i}>
                <TableRow className={classes.mainRow}>
                  <TableCell padding="checkbox">
                    <Checkbox checked={op.checked} onChange={(e) => this.props.onSelectionChange(i, e)}></Checkbox>
                  </TableCell>
                  <TableCell>{op.name}</TableCell>
                  <TableCell>{op.rarity}</TableCell>
                  <TableCell>
                    <Select value={op.elite} onChange={(e) => this.props.onEliteClassChange(i, e)}>
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
  }
}

class Page extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      operators: operatorsAll.slice(),
      assigned: [],
    };
    this.handleSelectionChange = this.handleSelectionChange.bind(this);
    this.handleEliteClassChange = this.handleEliteClassChange.bind(this);
  }
  componentDidMount() {
    const current = localStorage.getItem("operators");
    if (current) {
      this.setState({
        operators: current,
      });
    }
  }
  handleSelectionChange(i, e) {
    const operators = this.state.operators.slice();
    operators[i].checked = e.target.checked;
    this.setState({ operators: operators });
  }
  handleEliteClassChange(i, e) {
    const operators = this.state.operators.slice();
    operators[i].elite = e.target.value;
    this.setState({ operators: operators });
  }

  render() {
    const { classes } = this.props;
    return (
      <main>
        <Container maxWidth="lg">
          <div>hoge hoge foo</div>
          <MeterGraph operators={this.state.operators}></MeterGraph>
          <OperatorTable
            classes={classes}
            operators={this.state.operators}
            onSelectionChange={(i, e) => this.handleSelectionChange(i, e)}
            onEliteClassChange={(i, e) => this.handleEliteClassChange(i, e)}></OperatorTable>
        </Container>
      </main>
    );
  }
}

/*
const Page = () => {
  const { classes } = this.props;
  return (
    <main>
      <MainPanel classes={classes}></MainPanel>
    </main>
  );
};
*/
export default withStyles(styles)(Page);
//export default Page;
