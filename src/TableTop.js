import { TableHead } from "@mui/material";
import { TableRow } from "@mui/material";
import { TableCell } from "@mui/material";
import { Typography } from "@mui/material";

const TableTop = () => {
  return (
    <TableHead>
      <TableRow>
        <TableCell>
          <Typography variant="inherit" color="white" component="div">
            Action
          </Typography>
        </TableCell>
        <TableCell align="right">
          <Typography variant="inherit" color="white" component="div">
            Total Value
          </Typography>
        </TableCell>
        <TableCell align="right">
          <Typography variant="inherit" color="white" component="div">
            Token Amount
          </Typography>
        </TableCell>
        <TableCell align="right">
          <Typography variant="inherit" color="white" component="div">
            Token Amount
          </Typography>
        </TableCell>
        <TableCell align="right">
          <Typography variant="inherit" color="white" component="div">
            Account
          </Typography>
        </TableCell>
        <TableCell align="right">
          <Typography variant="inherit" color="white" component="div">
            Time
          </Typography>
        </TableCell>
      </TableRow>
    </TableHead>
  );
};

export default TableTop;
