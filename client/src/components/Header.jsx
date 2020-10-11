import React, { useState } from "react";
import { NavLink } from "reactstrap";
import {
  Slide,
  AppBar,
  Toolbar,
  Typography,
  useScrollTrigger,
  IconButton,
  makeStyles,
} from "@material-ui/core";

import img from "../img/illuminati.png";

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
  },
  app: {
    marginBottom: "100px",
  },
  menuButton: {
    marginRight: theme.spacing(2),
  },
  title: {
    flexGrow: 1,
  },
  navMenu: {
    "& > * + *": {
      marginLeft: theme.spacing(2),
    },
    color: "white",

    "&:hover": {
      color: "white",
      textDecorationLine: "underline",
    },
  },
}));

function HideOnScroll(props) {
  const { children, window } = props;
  const trigger = useScrollTrigger({ target: window ? window() : undefined });

  return (
    <Slide appear={false} direction="down" in={!trigger}>
      {children}
    </Slide>
  );
}

const Header = (props) => {
  const classes = useStyles();
  const [isOpen, setIsOpen] = useState(false);

  const toggle = () => setIsOpen(!isOpen);

  return (
    <HideOnScroll {...props}>
      <AppBar className={classes.app}>
        <Toolbar>
          <IconButton
            edge="start"
            className={classes.menuButton}
            color="inherit"
            aria-label="menu"
          >
            <NavLink href="/">
              <img
                src={img}
                width="30"
                height="30"
                className="d-inline-block align-top"
              />
            </NavLink>
          </IconButton>
          <Typography variant="h6" className={classes.title}>
            iNVIGILATOR
          </Typography>

          <NavLink className={classes.navMenu} href="/New">
            New
          </NavLink>
          <NavLink className={classes.navMenu} href="/Test">
            Test
          </NavLink>
        </Toolbar>
      </AppBar>
    </HideOnScroll>
  );
};
export default Header;
