// src/App.tsx

import { Fragment } from "react";

import Home from "./Home";
import CssBaseline from "@mui/material/CssBaseline";
import Container from "@mui/material/Container";

export default function App() {
  return (
    <Fragment>
      <CssBaseline enableColorScheme />
      <Container
        maxWidth="lg"
        sx={{
          py: 2,
          height: "calc(100vh - 64px)",
        }}
      >
        <Home />
      </Container>
    </Fragment>
  );
}
