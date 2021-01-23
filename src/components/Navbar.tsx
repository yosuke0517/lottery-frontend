import React, { FC } from 'react';
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import clsx from 'clsx';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import ExitToAppIcon from '@material-ui/icons/ExitToApp';
import Drawer from '@material-ui/core/Drawer';
import Button from '@material-ui/core/Button';
import List from '@material-ui/core/List';
import Divider from '@material-ui/core/Divider';
import ListItem, { ListItemProps } from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import InboxIcon from '@material-ui/icons/MoveToInbox';
import HomeIcon from '@material-ui/icons/Home';
import AppsIcon from '@material-ui/icons/Apps';
import { withCookies } from 'react-cookie';
import CONST from '../const/lotoTypes';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    menuButton: {
      margin: theme.spacing(0),
      minWidth: 0,
    },
    title: {
      flexGrow: 1,
    },
    list: {
      width: 250,
    },
  }),
);

// eslint-disable-next-line @typescript-eslint/ban-types
const Navbar: FC<{}> = (props: any) => {
  const classes = useStyles();
  const [auth, setAuth] = React.useState(false);
  const [drawerState, setDrawerState] = React.useState(false);
  const toggleDrawer = (open: boolean) => (
    event: React.KeyboardEvent | React.MouseEvent,
  ) => {
    if (
      event.type === 'keydown' &&
      ((event as React.KeyboardEvent).key === 'Tab' ||
        (event as React.KeyboardEvent).key === 'Shift')
    ) {
      return;
    }
    setDrawerState(open);
  };

  /** ログアウト */
  const Logout = () => () => {
    props.cookies.remove('current-token');
    window.location.href = '/login';
  };
  const toHome = () => {
    window.location.href = '/';
  };

  /** サイドバーでの画面遷移（TODO window.locationは使いたくない)
   * @param index サイドバー項目上から0~
   */
  const sidebarClick = (index: number) => {
    // eslint-disable-next-line no-unused-expressions
    index === 0
      ? (window.location.href = '/')
      : (window.location.href = CONST.LOTO_TYPES[index - 1]);
  };

  /** DrawerList サンプル*/
  const list = () => (
    <div
      className={clsx(classes.list)}
      role="presentation"
      onClick={toggleDrawer(false)}
      onKeyDown={toggleDrawer(false)}
    >
      <List>
        {['ホーム', 'ミニロト', 'ロト6', 'ロト7'].map((loto, index) => (
          <ListItem button key={loto} onClick={() => sidebarClick(index)}>
            <ListItemIcon>
              {index === 0 ? <HomeIcon /> : <InboxIcon />}
            </ListItemIcon>
            <ListItemText primary={loto} />
          </ListItem>
        ))}
      </List>
      <Divider />
    </div>
  );

  return (
    <AppBar position="static">
      <Toolbar>
        <div>
          <Button className={classes.menuButton} onClick={toggleDrawer(true)}>
            <AppsIcon />
          </Button>
          <Drawer
            anchor="left"
            open={drawerState}
            onClose={toggleDrawer(false)}
          >
            {list()}
          </Drawer>
        </div>
        <Typography variant="h5" className={classes.title}>
          Loto系結果サーチ
        </Typography>
        <ExitToAppIcon className="signOut" onClick={Logout()} />
      </Toolbar>
    </AppBar>
  );
};

export default withCookies(Navbar);
