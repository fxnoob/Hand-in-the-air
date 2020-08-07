import React from "react";
import clsx from "clsx";
import propTypes from 'prop-types';
import { lighten, makeStyles } from "@material-ui/core/styles";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableHead from "@material-ui/core/TableHead";
import TablePagination from "@material-ui/core/TablePagination";
import TableRow from "@material-ui/core/TableRow";
import TableSortLabel from "@material-ui/core/TableSortLabel";
import Toolbar from "@material-ui/core/Toolbar";
import Typography from "@material-ui/core/Typography";
import Paper from "@material-ui/core/Paper";
import Checkbox from "@material-ui/core/Checkbox";
import IconButton from "@material-ui/core/IconButton";
import Tooltip from "@material-ui/core/Tooltip";
import DeleteIcon from "@material-ui/icons/Delete";
import FilterListIcon from "@material-ui/icons/FilterList";
import Switch from "@material-ui/core/Switch";
import Db from "../../../lib/db";
import { timeDifference } from "../../../lib/helper";
const db = new Db();

const fetchAllData = () => {
  return db.get(null);
};

const headCells = [
  { id: "domain", numeric: false, disablePadding: true, label: "Domain" },
  { id: "code", numeric: true, disablePadding: false, label: "Code" },
  { id: "created", numeric: true, disablePadding: false, label: "Created" },
  { id: "action", numeric: true, disablePadding: false, label: "Action" }
];
const rows = [];

function EnhancedTableHead(props) {
  const {
    classes,
    onSelectAllClick,
    order,
    orderBy,
    numSelected,
    rowCount,
    onRequestSort
  } = props;
  const createSortHandler = property => event => {
    onRequestSort(event, property);
  };

  return (
    <TableHead>
      <TableRow>
        <TableCell padding="checkbox">
          <Checkbox
            indeterminate={numSelected > 0 && numSelected < rowCount}
            checked={numSelected === rowCount}
            onChange={onSelectAllClick}
            inputProps={{ "aria-label": "select all handlers" }}
          />
        </TableCell>
        {headCells.map(headCell =>
          <TableCell
            key={headCell.id}
            align={headCell.numeric ? "right" : "left"}
            padding={headCell.disablePadding ? "none" : "default"}
            sortDirection={orderBy === headCell.id ? order : false}
          >
            <TableSortLabel
              active={orderBy === headCell.id}
              direction={order}
              onClick={createSortHandler(headCell.id)}
            >
              {headCell.label}
              {orderBy === headCell.id ?
                <span className={classes.visuallyHidden}>
                  {order === "desc" ? "sorted descending" : "sorted ascending"}
                </span>
                : null}
            </TableSortLabel>
          </TableCell>
        )}
      </TableRow>
    </TableHead>
  );
}
EnhancedTableHead.propTypes = {
  classes: propTypes.node,
  onSelectAllClick: propTypes.func,
  order: propTypes.string,
  orderBy: propTypes.string,
  numSelected: propTypes.number,
  rowCount: propTypes.number,
  onRequestSort: propTypes.func
};


const useToolbarStyles = makeStyles(theme => ({
  root: {
    paddingLeft: theme.spacing(2),
    paddingRight: theme.spacing(1)
  },
  highlight:
    theme.palette.type === "light"
      ? {
        color: theme.palette.secondary.main,
        backgroundColor: lighten(theme.palette.secondary.light, 0.85)
      }
      : {
        color: theme.palette.text.primary,
        backgroundColor: theme.palette.secondary.dark
      },
  spacer: {
    flex: "1 1 100%"
  },
  actions: {
    color: theme.palette.text.secondary
  },
  title: {
    flex: "0 0 auto"
  }
}));

const deleteSelected = selectedId => {
  db.remove(selectedId).then(() => {
    alert("deleted");
    window.location.reload();
  });
};

const EnhancedTableToolbar = props => {
  const classes = useToolbarStyles();
  const { numSelected, selectedId } = props;

  return (
    <Toolbar
      className={clsx(classes.root, {
        [classes.highlight]: numSelected > 0
      })}
    >
      <div className={classes.title}>
        {numSelected > 0 ?
          <Typography color="inherit" variant="subtitle1">
            {numSelected} selected
          </Typography>
          :
          <Typography variant="h6" id="tableTitle">
            Custom Handlers List
          </Typography>
        }
      </div>
      <div className={classes.spacer} />
      <div className={classes.actions}>
        {numSelected > 0 ?
          <Tooltip title="Delete">
            <IconButton aria-label="delete">
              <DeleteIcon onClick={() => deleteSelected(selectedId)} />
            </IconButton>
          </Tooltip>
          :
          <Tooltip title="Filter list">
            <IconButton aria-label="filter list">
              <FilterListIcon />
            </IconButton>
          </Tooltip>
        }
      </div>
    </Toolbar>
  );
};
EnhancedTableToolbar.propTypes = {
  numSelected: propTypes.number,
  selectedId: propTypes.string
};

const useStyles = makeStyles(theme => ({
  root: {
    width: "100%",
    marginTop: theme.spacing(3)
  },
  paper: {
    width: "100%",
    marginBottom: theme.spacing(2)
  },
  table: {
    minWidth: 300
  },
  tableWrapper: {
    overflowX: "auto"
  },
  visuallyHidden: {
    border: 0,
    clip: "rect(0 0 0 0)",
    height: 1,
    margin: -1,
    overflow: "hidden",
    padding: 0,
    position: "absolute",
    top: 20,
    width: 1
  }
}));

export default function EnhancedTable(props) {
  const classes = useStyles();
  const [order, setOrder] = React.useState("asc");
  const [orderBy, setOrderBy] = React.useState("calories");
  const [selected, setSelected] = React.useState([]);
  const page = 0;
  const dense = false;
  const rowsPerPage = 5;
  const [RowVal, setRows] = React.useState({ rows: [] });
  const [loaded, setLoaded] = React.useState(0);

  React.useEffect(() => {
    const init = async () => {
      try {
        const res = await fetchAllData();
        let rows = [];
        for (let key in res) {
          if (res[key].hasOwnProperty("codeString")) {
            props.mode == res[key].mode || "";
            if (props.mode == res[key].mode) {
              rows.push({
                domain: key,
                codeString: res[key].codeString,
                created: res[key].created,
                createdHR: timeDifference(+new Date(), res[key].created),
                isActive: res[key].isActive
              });
            }
          }
        }
        setRows({ rows: rows });
        setLoaded(1);
      } catch (e) {
        /* eslint-disable no-console */
        console.log(e);
      }
    };
    init()
      .then(() => {})
      .catch(() => {});
  }, []);

  function handleRequestSort(event, property) {
    const isDesc = orderBy === property && order === "desc";
    setOrder(isDesc ? "asc" : "desc");
    setOrderBy(property);
  }

  function handleSelectAllClick(event) {
    if (event.target.checked) {
      const newSelecteds = RowVal.rows.map(n => n.domain);
      setSelected(newSelecteds);
      return;
    }
    setSelected([]);
  }

  function handleClick(event, name) {
    const selectedIndex = selected.indexOf(name);
    let newSelected = [];
    if (selectedIndex === -1) {
      newSelected = newSelected.concat(selected, name);
    } else if (selectedIndex === 0) {
      newSelected = newSelected.concat(selected.slice(1));
    } else if (selectedIndex === selected.length - 1) {
      newSelected = newSelected.concat(selected.slice(0, -1));
    } else if (selectedIndex > 0) {
      newSelected = newSelected.concat(
        selected.slice(0, selectedIndex),
        selected.slice(selectedIndex + 1)
      );
    }

    setSelected(newSelected);
  }

  const toggleActive = row => {
    const rows = RowVal.rows;
    row.isActive = !row.isActive;
    rows[row.domain] = row;
    db.set({
      [row.domain]: row
    });
    setRows({ rows: rows });
  };
  const isSelected = name => selected.indexOf(name) !== -1;
  return (
    <div className={classes.root}>
      <Paper className={classes.paper}>
        <EnhancedTableToolbar
          numSelected={selected.length}
          selectedId={selected}
        />
        <div className={classes.tableWrapper}>
          <Table
            className={classes.table}
            aria-labelledby="tableTitle"
            size={dense ? "small" : "medium"}
          >
            <EnhancedTableHead
              classes={classes}
              numSelected={selected.length}
              order={order}
              orderBy={orderBy}
              onSelectAllClick={handleSelectAllClick}
              onRequestSort={handleRequestSort}
              rowCount={RowVal.rows.length}
            />
            <TableBody>
              {RowVal.rows.map((row, index) => {
                const isItemSelected = isSelected(row.domain);
                const labelId = `enhanced-table-checkbox-${index}`;

                return (
                  <TableRow
                    hover
                    role="checkbox"
                    aria-checked={isItemSelected}
                    tabIndex={-1}
                    key={row.domain}
                    selected={isItemSelected}
                  >
                    <TableCell padding="checkbox">
                      <Checkbox
                        onClick={event => handleClick(event, row.domain)}
                        checked={isItemSelected}
                        inputProps={{ "aria-labelledby": labelId }}
                      />
                    </TableCell>
                    <TableCell
                      component="th"
                      id={labelId}
                      scope="row"
                      padding="none"
                    >
                      {row.domain}
                    </TableCell>
                    <TableCell align="right">{row.codeString}</TableCell>
                    <TableCell align="right">{row.createdHR}</TableCell>
                    <TableCell align="right">
                      {loaded ?
                        <Switch
                          checked={row.isActive}
                          value={row.isActive}
                          onChange={() => {
                            toggleActive(row);
                          }}
                          inputProps={{ "aria-label": "secondary checkbox" }}
                        />
                        :
                        "loading.."
                      }
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </div>
        <TablePagination
          rowsPerPageOptions={[5, 10, 25]}
          component="div"
          count={rows.length}
          onChangePage={() => {
          }}
          rowsPerPage={rowsPerPage}
          page={page}
          backIconButtonProps={{
            "aria-label": "previous page"
          }}
          nextIconButtonProps={{
            "aria-label": "next page"
          }}
        />
      </Paper>
    </div>
  );
}
EnhancedTable.propTypes = {
  mode: propTypes.string
};

