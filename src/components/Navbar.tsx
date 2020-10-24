import React, { FC } from 'react';
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import ExitToAppIcon from '@material-ui/icons/ExitToApp';
import { withCookies } from 'react-cookie';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    menuButton: {
      marginRight: theme.spacing(2),
    },
    title: {
      flexGrow: 1,
    },
  }),
);

// eslint-disable-next-line @typescript-eslint/ban-types
const Navbar: FC<{}> = (props: any) => {
  const classes = useStyles();
  const [auth, setAuth] = React.useState(false);
  const Logout = () => () => {
    props.cookies.remove('current-token');
    window.location.href = '/';
  };

  return (
    <AppBar position="static">
      <Toolbar>
        <Typography variant="h5" className={classes.title}>
          Loto系宝くじ検索アプリ
        </Typography>
        <ExitToAppIcon className="signOut" onClick={Logout()} />
      </Toolbar>
    </AppBar>
  );
};

export default withCookies(Navbar);
