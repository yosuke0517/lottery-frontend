import React, { FC } from 'react';
import './App.css';
import { createMuiTheme } from '@material-ui/core/styles';
import { ThemeProvider } from '@material-ui/core/styles';
import { lightBlue } from '@material-ui/core/colors';
// eslint-disable-next-line import/no-cycle
import Navbar from './components/Navbar';
import Lotos from './components/Lotos';

const theme = createMuiTheme({
  palette: {
    primary: lightBlue,
    secondary: {
      main: '#f44336',
    },
  },
  typography: {
    fontFamily: 'Comic Neue',
  },
});

const App: FC = props => (
  <ThemeProvider theme={theme}>
    <div className="App">
      <Navbar />
      <Lotos />
    </div>
  </ThemeProvider>
);

export default App;
