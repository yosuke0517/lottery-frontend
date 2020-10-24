import React, { FC, useReducer } from 'react';
import { withCookies } from 'react-cookie';
import axios, { AxiosResponse } from 'axios';
import Avatar from '@material-ui/core/Avatar';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import LockOutlinedIcon from '@material-ui/icons/LockOutlined';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
import Container from '@material-ui/core/Container';
import CircularProgress from '@material-ui/core/CircularProgress';
import Alert from '@material-ui/lab/Alert';

import {
  START_FETCH,
  FETCH_SUCCESS,
  ERROR_CATCHED,
  INPUT_EDIT,
  TOGGLE_MODE,
} from '../types/actionTypes';
import { LoginTypes } from '../types/loginTypes';

const useStyles = makeStyles(theme => ({
  paper: {
    marginTop: theme.spacing(8),
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  avatar: {
    margin: theme.spacing(1),
    backgroundColor: theme.palette.secondary.main,
  },
  form: {
    width: '100%', // Fix IE 11 issue.
    marginTop: theme.spacing(1),
  },
  submit: {
    margin: theme.spacing(3, 0, 2),
  },
  span: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    color: 'teal',
  },
  spanError: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    color: 'red',
  },
}));

const initialState: LoginTypes = {
  isLoading: false, // ローディング管理用
  isLoginView: true, // ログインか新規登録か
  error: '',
  // ログインの場合はユーザ名とパスワード（djangoの関係）
  credentialsLogin: {
    username: '',
    password: '',
  },
  // 登録の場合はemailでOK（djangoの関係）
  credentialsRegister: {
    email: '',
    password: '',
  },
};

const loginReducer = (state: LoginTypes, action: any) => {
  switch (action.type) {
    case START_FETCH: {
      return {
        ...state, // スプレッド構文でstateを展開してisLoadingのみ変更する
        isLoading: true,
      };
    }
    case FETCH_SUCCESS: {
      return {
        ...state,
        isLoading: false,
      };
    }
    case ERROR_CATCHED: {
      return {
        ...state,
        error: 'Email or password is not correct',
        isLoading: false,
      };
    }
    case INPUT_EDIT: {
      return {
        ...state,
        [action.inputName]: action.payload, // ログイン・登録で書き換えるstateを動的に変えられるようにする
        error: '',
      };
    }
    case TOGGLE_MODE: {
      return {
        ...state,
        isLoginView: !state.isLoginView, // ログイン・新規登録をtoggleする
      };
    }
    default:
      return state;
  }
};

const Login: FC<{}> = (props: any) => {
  const classes = useStyles();
  // reducerの初期化
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  const [state, dispatch] = useReducer(loginReducer, initialState);

  /** 現状のstateを変数へ格納して入力値で書き換える（ログイン） */
  const inputChangedLog = () => (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    // 現状のstateを変数へ格納して入力値で書き換える
    const cred = state.credentialsLogin;
    cred[event.target.name] = event.target.value; // 入力したusername, passwordの情報を格納
    dispatch({
      type: INPUT_EDIT,
      inputName: 'state.credentialsLogin',
      payload: cred,
    });
  };

  /** 現状のstateを変数へ格納して入力値で書き換える（登録） */
  const inputChangedReg = () => (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const cred = state.credentialsRegister;
    cred[event.target.name] = event.target.value; // 入力したemail, passwordの情報を格納
    dispatch({
      type: INPUT_EDIT,
      inputName: 'state.credentialReg',
      payload: cred,
    });
  };

  /** ログイン処理 */
  const login = async (event: any) => {
    event.preventDefault(); // submitなのでURLへ遷移しようとしてリフレッシュされてしまう。今回は不要なので、させないようにする
    /** ログインの場合 */
    if (state.isLoginView) {
      // TODO 共通化できる
      dispatch({ type: START_FETCH });
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      const res: AxiosResponse = await axios
        .post('http://127.0.0.1:8888/authen/', state.credentialsLogin, {
          headers: {
            'Content-Type': 'application/json',
          },
        })
        .catch(error => {
          dispatch({
            type: ERROR_CATCHED,
          });
          throw error;
          // TODO エラー画面へ飛ばす処理またはトースターを出す処理
        });
      props.cookies.set('current-token', res.data.token);
      // eslint-disable-next-line no-unused-expressions
      res.data.token
        ? (window.location.href = '/lotoseven')
        : (window.location.href = '/');
      dispatch({
        type: FETCH_SUCCESS,
      });
      /** 新規登録の場合 */
    } else {
      dispatch({
        type: START_FETCH,
      });
      await axios
        .post('http://127.0.0.1:8888/api/create/', state.credentialsRegister, {
          headers: {
            'Content-Type': 'application/json',
          },
        })
        .catch(error => {
          dispatch({
            type: ERROR_CATCHED,
          });
          throw error;
          // TODO エラー画面へ飛ばす処理またはトースターを出す処理
        });
      dispatch({ type: FETCH_SUCCESS });
      dispatch({ type: TOGGLE_MODE }); // 登録が終わったらログイン画面へ切り替える
      // TODO 登録が無事終わったらログインしてくださいアラートを出す
    }
  };

  /** ログインと新規登録ボタンの切り替え */
  const toggleView = () => {
    dispatch({ type: TOGGLE_MODE });
  };

  return (
    <div>
      <Container maxWidth="xs">
        {state.error && <Alert severity="error">{state.error}</Alert>}
        <form onSubmit={login}>
          <div className={classes.paper}>
            {state.isLoading && <CircularProgress />}
            <Avatar className={classes.avatar}>
              <LockOutlinedIcon />
            </Avatar>
            <Typography variant="h5">
              {state.isLoginView ? 'ログイン' : '新規登録'}
            </Typography>

            {state.isLoginView ? (
              <TextField
                variant="outlined"
                margin="normal"
                fullWidth
                label="Email"
                name="username"
                value={state.credentialsLogin.username}
                onChange={inputChangedLog()}
                autoFocus
              />
            ) : (
              <TextField
                variant="outlined"
                margin="normal"
                fullWidth
                label="Email"
                name="email"
                value={state.credentialsRegister.email}
                onChange={inputChangedReg()}
                autoFocus
              />
            )}

            {state.isLoginView ? (
              <TextField
                variant="outlined"
                margin="normal"
                fullWidth
                label="Password"
                name="password"
                type="password"
                value={state.credentialsLogin.password}
                onChange={inputChangedLog()}
              />
            ) : (
              <TextField
                variant="outlined"
                margin="normal"
                fullWidth
                label="Password"
                name="password"
                type="password"
                value={state.credentialsRegister.password}
                onChange={inputChangedReg()}
              />
            )}
            {/* <span className={classes.spanError}>{state.error}</span>*/}

            {/* eslint-disable-next-line no-nested-ternary */}
            {state.isLoginView ? (
              !state.credentialsLogin.password ||
              !state.credentialsLogin.username ? (
                <Button
                  className={classes.submit}
                  type="submit"
                  fullWidth
                  disabled
                  variant="contained"
                  color="primary"
                >
                  Login
                </Button>
              ) : (
                <Button
                  className={classes.submit}
                  type="submit"
                  fullWidth
                  variant="contained"
                  color="primary"
                >
                  Login
                </Button>
              )
            ) : !state.credentialsRegister.password ||
              !state.credentialsRegister.email ? (
              <Button
                className={classes.submit}
                type="submit"
                fullWidth
                disabled
                variant="contained"
                color="primary"
              >
                Register
              </Button>
            ) : (
              <Button
                className={classes.submit}
                type="submit"
                fullWidth
                variant="contained"
                color="primary"
              >
                Register
              </Button>
            )}

            {/* eslint-disable-next-line jsx-a11y/no-static-element-interactions,jsx-a11y/click-events-have-key-events */}
            <span onClick={() => toggleView()} className={classes.span}>
              {state.isLoginView ? 'アカウントを作成する' : 'ログインする'}
            </span>
          </div>
        </form>
      </Container>
    </div>
  );
};

export default withCookies(Login);
