import React, { useContext, useState } from "react";

import {
  TableWrapper,
  FilterIcon,
  EditIcon,
  DeleteIcon,
} from "./body-table.styles";

import DeleteCompany from "./delete-company/delete-company.component";

import { InitialContext } from "../../../routes/dashboard/user-dashboard.component";

import Box from "@mui/material/Box";
import IconButton from "@mui/material/IconButton";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import TablePagination from "@mui/material/TablePagination";
import TableSortLabel from "@mui/material/TableSortLabel";
import Toolbar from "@mui/material/Toolbar";
import Tooltip from "@mui/material/Tooltip";
import Typography from "@mui/material/Typography";

import { visuallyHidden } from "@mui/utils";

const headCells = [
  { att: "uuid", label: "Id", sortable: false },
  {
    att: "companyName",
    label: "Company Name",
    sortable: true,
  },
  {
    att: "owner",
    label: "Owner",
    sortable: true,
  },
  {
    att: "phone",
    label: "Phone",
    sortable: false,
  },
  {
    att: "lastTrained",
    label: "Last Trained",
    sortable: true,
  },
  {
    att: "lastInspected",
    label: "Last Inspected",
    sortable: true,
  },
];

const descendingComparator = (a, b, orderBy) => {
  if (b[orderBy] < a[orderBy]) {
    return -1;
  }
  if (b[orderBy] > a[orderBy]) {
    return 1;
  }
  return 0;
};

const getComparator = (order, orderBy) => {
  return order === "desc"
    ? (a, b) => descendingComparator(a, b, orderBy)
    : (a, b) => -descendingComparator(a, b, orderBy);
};

const stableSort = (array, comparator) => {
  const stabilizedThis = array.map((el, index) => [el, index]);
  stabilizedThis.sort((a, b) => {
    const order = comparator(a[0], b[0]);
    if (order !== 0) {
      return order;
    }
    return a[1] - b[1];
  });
  return stabilizedThis.map((el) => el[0]);
};

const EnhancedTableHead = (props) => {
  const { order, orderBy, rowCount, onRequestSort } = props;

  const createSortHandler = (property) => (event) => {
    onRequestSort(event, property);
  };

  return (
    <TableHead>
      <TableRow>
        <TableCell>Action</TableCell>
        {headCells.map((headCell, idx) => {
          return (
            <TableCell
              key={idx}
              sortDirection={orderBy === headCell.id ? order : false}
            >
              <TableSortLabel
                active={orderBy === headCell.id}
                direction={orderBy === headCell.id ? order : "asc"}
              >
                {" "}
                {headCell.label}
                {orderBy === headCell.id ? (
                  <Box component="span" sx={visuallyHidden}>
                    {order === "desc"
                      ? "sorted descending"
                      : "sorted ascending"}
                  </Box>
                ) : null}
              </TableSortLabel>
            </TableCell>
          );
        })}
      </TableRow>
    </TableHead>
  );
};

const EnhancedTableToolbar = () => {
  return (
    <Toolbar
      sx={{
        pl: { sm: 2 },
        pr: { xs: 1, s: 1 },
      }}
    >
      <Typography
        sx={{ flex: "1 1 100%" }}
        variant="h6"
        id="tableTitle"
        component="div"
      >
        Companies
      </Typography>
      <Tooltip title="Filter">
        <IconButton>
          <FilterIcon />
        </IconButton>
      </Tooltip>
    </Toolbar>
  );
};

const BodyTable = () => {
  const [order, setOrder] = useState("asc");
  const [orderBy, setOrderBy] = useState("companyName");
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [deleteCompany, setDeleteCompany] = useState(false);
  const [editCompany, setEditCompany] = useState(false);
  const [compData, setComp] = useState();

  const {
    context: { companies },
  } = useContext(InitialContext);

  const handleRequestSort = (e, property) => {
    const isAsc = orderBy === property && order === "asc";
    setOrder(isAsc ? "desc" : "asc");
    setOrderBy(property);
  };

  const handleChangePage = (e, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (e) => {
    setRowsPerPage(parseInt(e.target.value, 10));
    setPage(0);
  };

  const handleDeleteInquiry = (e) => {
    console.log("handleDeleteInquiry");
    // extract uuid from target row
    const { uuid } = e.target.closest(".company").dataset;
    // run find function to get company details
    const company = companies.find((company) => company.uuid === uuid);

    setComp(company);
    setDeleteCompany(true);
  };

  const handleEditInquiry = (e) => {};

  // avoid a layout jump when reaching the last page with empty rows
  const emptyRows =
    page > 0 ? Math.max(0, (1 + page) * rowsPerPage - companies.length) : 0;

  console.log("companies -- BodyTable: ", companies);

  return (
    <TableWrapper>
      <EnhancedTableToolbar />
      <Table sx={{ minWidth: 750 }} aria-labelledby="tableCompany" size="small">
        <EnhancedTableHead
          order={order}
          orderBy={orderBy}
          onRequestSort={handleRequestSort}
          rowCount={companies.length}
        />
        <TableBody>
          {stableSort(companies, getComparator(order, orderBy))
            .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
            .map((company, idx) => {
              return (
                <TableRow
                  className="company"
                  data-uuid={company.uuid}
                  key={company.uuid}
                >
                  <TableCell sx={{ p: 0 }}>
                    <Tooltip title="Edit Company">
                      <IconButton size="small">
                        <EditIcon onClick={() => alert("clicked")} />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Delete Company">
                      <IconButton size="small">
                        <DeleteIcon onClick={handleDeleteInquiry} />
                      </IconButton>
                    </Tooltip>
                  </TableCell>
                  <TableCell>{company.uuid.slice(0, 6)}</TableCell>
                  <TableCell>{company.companyName}</TableCell>
                  <TableCell>{company.owner}</TableCell>
                  <TableCell>{company.phone}</TableCell>
                  <TableCell>{company.lastTrained}</TableCell>
                  <TableCell>{company.lastInspected}</TableCell>
                </TableRow>
              );
            })}
        </TableBody>
      </Table>
      <TablePagination
        rowsPerPageOptions={[5, 10]}
        component="div"
        count={companies.length}
        page={page}
        rowsPerPage={rowsPerPage}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />
      {deleteCompany ? (
        <DeleteCompany compData={compData} setDeleteModal={setDeleteCompany} />
      ) : null}
      {editCompany ? null : null}
    </TableWrapper>
  );
};

export default BodyTable;
