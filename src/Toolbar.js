import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import IconButton from "@mui/material/IconButton";
import { Link } from "@mui/material";

export default function DenseAppBar() {
  const getPool = () => {
    return window.open(
      `https://info.uniswap.org/#/pools/0x8ad599c3a0ff1de082011efddc58f1908eb6e6d8`
    );
  };

  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="static">
        <Toolbar variant="dense">
          <Typography onClick={getPool} variant="h6" component="div">
            Uniswap USDC Ether Pool
          </Typography>
        </Toolbar>
      </AppBar>
    </Box>
  );
}
