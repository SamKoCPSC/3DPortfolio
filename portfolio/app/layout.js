import { Caveat_Brush } from "next/font/google";
import { ThemeProvider } from "@mui/material";
import theme from "./theme";
import "./globals.css";
import Navbar from './components/Navbar'

const caveatBrush = Caveat_Brush({
  subsets: ["latin"],
  weight: "400"
})

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={caveatBrush.className}>
        <Navbar/>
        <ThemeProvider theme={theme}>
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
