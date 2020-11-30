import React, { useState } from "react";
import {
  Button,
  Container,
  Link,
  makeStyles,
  TextField,
  Typography,
} from "@material-ui/core";
import clsx from "clsx";
import Axios from "axios";
import { FileCopyOutlined } from "@material-ui/icons";

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
  text: {
    textAlign: "center",
  },
  h3: {
    // marginTop: "-12px",
    // marginBottom: "8px",
    // verticalAlign: "text-bottom",
    // msTextAutospace: "",
  },
  h5: {
    // marginTop: "-8px",
    // marginBottom: "12px",
  },
  button: {
    borderRadius: "50%",
    width: "64px",
    height: "64px",
    "&:hover": {
      WebkitTransform: "scale(0.8)",
      msTransform: "scale(0.8)",
      transform: "scale(0.8)",
      transition: "0.3s ease",
    },
  },
  iconButton: {
    borderRadius: "50%",
    width: "64px",
    height: "64px",
  },
}));

const HomePage = () => {
  const classes = useStyles();
  const [longUrl, setLongUrl] = useState({
    value: "",
    error: false,
    helperText: "",
  });
  const [smolUrl, setSmolUrl] = useState({
    value: "",
    error: false,
    helperText: "",
  });
  const [firstRender, setFirstRender] = useState(true);
  const [error, setError] = useState();
  const [response, setResponse] = useState();

  const longUrlTests = [
    {
      test: (value) =>
        /[(http(s)?)://(www.)?a-zA-Z0-9@:%._+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_+.~#?&//=]*)/.test(
          value
        ),
      onFailFeedback: "that's not a valid url D:<",
    },
  ];

  const smolTests = [
    {
      test: (value) => /^[\w-]*$/i.test(value),
      onFailFeedback: "smol contains invalid characters",
    },
    {
      test: (value) => value.length <= 5,
      onFailFeedback: "smol not smol enough",
    },
  ];

  const handleLongChange = (event) => {
    let newLongUrl = {};
    longUrlTests.some((validationTest) => {
      if (!validationTest.test(event.target.value)) {
        newLongUrl.error = true;
        newLongUrl.helperText = validationTest.onFailFeedback;
        return true;
      }
      return false;
    });
    newLongUrl.value = event.target.value;
    setLongUrl(newLongUrl);
    setFirstRender(false);
  };

  const handleSmolChange = (event) => {
    let newSmolUrl = {};
    smolTests.some((validationTest) => {
      if (!validationTest.test(event.target.value)) {
        newSmolUrl.error = true;
        newSmolUrl.helperText = validationTest.onFailFeedback;
        return true;
      }
      return false;
    });
    newSmolUrl.value = event.target.value;
    setSmolUrl(newSmolUrl);
  };

  const handleSubmit = async () => {
    try {
      const res = await Axios({
        method: "POST",
        url: `/url`, // change port in prod
        headers: {
          "content-type": "application/json",
        },
        data: {
          smol: smolUrl.value || undefined,
          url: longUrl.value,
        },
      });
      setResponse(res.data);
      setError();
      setLongUrl({
        value: "",
        error: false,
        helperText: "",
      });
      setSmolUrl({
        value: "",
        error: false,
        helperText: "",
      });
      setFirstRender(true);
    } catch (err) {
      setResponse();
      setError(err);
    }
  };

  const copyToClipboard = (str) => {
    const ele = document.createElement("textarea");
    ele.value = str;
    document.body.appendChild(ele);
    ele.select();
    document.execCommand("copy");
    document.body.removeChild(ele);
  };

  return (
    <Container className={clsx(classes.flexColContainer)} maxWidth="xs">
      <Typography
        className={clsx(classes.flexColItem, classes.text, classes.h3)}
        variant="h3"
      >
        smol url
      </Typography>
      <Typography
        className={clsx(classes.flexColItem, classes.text, classes.h5)}
        variant="h5"
      >
        for urls that should be smolr
      </Typography>
      <TextField
        className={clsx(classes.flexColItem)}
        autoFocus
        fullWidth
        variant="outlined"
        placeholder="paste longboi here"
        {...longUrl}
        onChange={handleLongChange}
      />
      <TextField
        className={clsx(classes.flexColItem)}
        variant="outlined"
        placeholder="choose a smol if you want"
        {...smolUrl}
        onChange={handleSmolChange}
      />
      <Button
        className={clsx(classes.flexColItem, classes.button)}
        variant="outlined"
        color="secondary"
        disabled={firstRender || smolUrl.error || longUrl.error}
        onClick={handleSubmit}
      >
        smol
      </Button>
      {response && (
        <>
          <Typography className={clsx(classes.flexColItem, classes.text)}>
            your new smol url is{" "}
            <Link color="inherit" href={response.link}>
              {response.link}
            </Link>
          </Typography>
          {/* <Tooltip title="copy to clipboard"> */}
          <Button
            className={clsx(classes.flexColItem, classes.iconButton)}
            variant="outlined"
            color="secondary"
            onClick={() => {
              copyToClipboard(response.link);
            }}
          >
            <FileCopyOutlined />
          </Button>
          {/* </Tooltip> */}
        </>
      )}
      {error && (
        <Typography className={clsx(classes.flexColItem, classes.text)}>
          {error?.response?.data?.message}
        </Typography>
      )}
    </Container>
  );
};

export default HomePage;
