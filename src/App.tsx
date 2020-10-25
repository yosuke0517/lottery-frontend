import React, { FC } from 'react';
import './App.css';
import { createMuiTheme } from '@material-ui/core/styles';
import { ThemeProvider } from '@material-ui/core/styles';
import { lightBlue } from '@material-ui/core/colors';
import { LotoSevenList } from './components/lotoSevenList';
// eslint-disable-next-line import/no-cycle
import Navbar from './components/Navbar';

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
      <header className="App-header">
        <LotoSevenList />
      </header>
    </div>
  </ThemeProvider>
);

export default App;
