import { Button, Container, makeStyles, Typography } from "@material-ui/core";
import { Home } from "@material-ui/icons";
import clsx from "clsx";
import React from "react";
import { useHistory } from "react-router-dom";

const useStyles = makeStyles((theme) => ({
  flexColContainer: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    marginTop: theme.spacing(2),
  },
  flexColItem: {
    marginBottom: theme.spacing(3),
  },
  iconButton: {
    borderRadius: "50%",
    width: "64px",
    height: "64px",
  },
}));

const ErrorPage = () => {
  const classes = useStyles();
  const history = useHistory();

  return (
    <Container className={clsx(classes.flexColContainer)} maxWidth="xs">
      <Typography className={clsx(classes.flexColItem)} variant="h5">
        no such smol
      </Typography>
      <Button
        className={clsx(classes.flexColItem, classes.iconButton)}
        variant="outlined"
        color="secondary"
        onClick={() => history.push("/")}
      >
        <Home />
      </Button>
    </Container>
  );
};

export default ErrorPage;
