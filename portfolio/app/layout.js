import { Caveat_Brush } from "next/font/google";
import { ThemeProvider } from "@mui/material";
import theme from "./theme";
import "./globals.css";

const caveatBrush = Caveat_Brush({
  subsets: ["latin"],
  weight: "400"
})

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={caveatBrush.className}>
        <ThemeProvider theme={theme}>
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
