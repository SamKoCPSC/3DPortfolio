'use client'
import { Caveat_Brush } from "next/font/google";
import { createTheme } from "@mui/material";

const caveatBrush = Caveat_Brush({
    subsets: ["latin"],
    weight: "400"
})

const theme = createTheme({
    typography: {
      fontFamily: caveatBrush.style.fontFamily,
    },
    // palette: {
    //   primary: {
    //     main: 'rgb(239, 184, 56)', // Warm gold
    //   },
    //   secondary: {
    //       main: 'rgb(155, 175, 136)', // Soft sage green
    //   },
    //   error: {
    //       main: 'rgb(229, 104, 103)', // Muted coral
    //       contrastText: 'rgb(0,0,0)'
    //   },
    //   info: {
    //       main: 'rgb(96, 165, 191)', // Muted sky blue
    //   },
    //   warning: {
    //       main: 'rgb(248, 191, 132)', // Peach
    //   },
    // },
  });
  
  export default theme;