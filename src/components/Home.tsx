import React, { FC, useReducer } from 'react';
import { withCookies } from 'react-cookie';
import { createStyles, Theme, makeStyles } from '@material-ui/core/styles';
import List from '@material-ui/core/List';
import ListItem, { ListItemProps } from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import LotoTypes from '../const/lotoTypes';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      width: '100%',
      maxWidth: 360,
      backgroundColor: theme.palette.background.paper,
    },
  }),
);

const ListItemLink = (props: ListItemProps<'a', { button?: true }>) => {
  return <ListItem button component="a" {...props} />;
};

const Home: FC<{}> = (props: any) => {
  const classes = useStyles();

  return (
    <>
      <div className={classes.root}>
        <List component="nav" aria-label="secondary mailbox folders">
          <ListItemLink href="/login">
            <ListItemText primary="Login" />
          </ListItemLink>
          {LotoTypes.map((loto: string) => (
            <ListItemLink href={`/${loto}`}>
              <ListItemText primary={`${loto}`} />
            </ListItemLink>
          ))}
        </List>
      </div>
    </>
  );
};

export default withCookies(Home);
