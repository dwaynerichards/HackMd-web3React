import { createTheme, responsiveFontSizes } from "@mui/material/styles";

export const themeOptions = {
  palette: {
    type: "light",
    primary: {
      main: "#3f51b5",
    },
    secondary: {
      main: "#f50057",
    },
    background: {
      default: "#f5f5f5",
      paper: "#24e8ad",
    },
  },
  typography: {
    fontFamily: "Luxurious Roman",
    fontWeightLight: 400,
    fontSize: 17,
  },
};
let theme = createTheme(themeOptions);

//theme = responsiveFontSizes(theme);
export default theme;
