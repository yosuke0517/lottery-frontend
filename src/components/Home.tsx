import React, { FC, useReducer } from 'react';
import { useCookies, withCookies } from 'react-cookie';
import { createStyles, Theme, makeStyles } from '@material-ui/core/styles';
import Breadcrumbs from '@material-ui/core/Breadcrumbs';
import Link from '@material-ui/core/Link';
import Container from '@material-ui/core/Container';
import Login from './Login';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      height: '100%',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',
    },
  }),
);

const Home: FC<{}> = (props: any) => {
  const classes = useStyles();
  const [cookies, setCookie] = useCookies(['current-token']);

  return (
    <>
      <Container maxWidth="sm" className={classes.root}>
        {cookies['current-token'] ? (
          <Breadcrumbs aria-label="breadcrumb">
            <Link color="inherit" href="/miniloto">
              miniLoto
            </Link>
            <Link color="inherit" href="/lotosix">
              loto6
            </Link>
            <Link color="inherit" href="/lotoseven">
              loto7
            </Link>
          </Breadcrumbs>
        ) : (
          <Login />
        )}
      </Container>
    </>
  );
};

export default withCookies(Home);
