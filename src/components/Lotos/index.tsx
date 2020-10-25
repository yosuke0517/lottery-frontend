import React, { FC, useEffect, useReducer, useState } from 'react';
import { RouteComponentProps, withRouter } from 'react-router';
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import useMediaQuery from '@material-ui/core/useMediaQuery';
import { useTheme } from '@material-ui/core/styles';
import { Column, LotosList } from './lotosList';
import { TextField } from '@material-ui/core';
import { LoginTypes } from '../../types/loginTypes';
import { SearchTypes } from '../../types/searchTypes';
import {
  ERROR_CATCHED,
  FETCH_SUCCESS,
  INPUT_EDIT,
  START_FETCH,
  TOGGLE_MODE,
} from '../../types/actionTypes';
import { LotoSevenType } from '../../types/lotoSevenType';
import axios, { AxiosError } from 'axios';

const initialState: SearchTypes = {
  isLoading: false, // ローディング管理用
  error: '',
  exactMode: false, // デフォルトは部分一致検索でtoggleさせる
  number_1: '',
  number_2: '',
  number_3: '',
  number_4: '',
  number_5: '',
  number_6: '',
  number_7: '',
  bonus_number1: '',
  bonus_number2: '',
  lottery_number: '',
};

const searchReducer = (state: SearchTypes, action: any) => {
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
        error: 'エラー',
        isLoading: false,
      };
    }
    case INPUT_EDIT: {
      return {
        ...state,
        [action.inputName]: action.payload, // 各input stateで書き換えるstateを動的に変えられるようにする
        error: '',
      };
    }
    case TOGGLE_MODE: {
      return {
        ...state,
        exactMode: !state.exactMode, // exactModeをtoggleする
      };
    }
    default:
      return state;
  }
};

// propsはないけどこうしないとhistoryとかが受け取れないと思う
type LotosProps = {} & RouteComponentProps<{}>;

interface LotoListProps {
  header: Column[];
  data: LotoSevenType[];
}

const Lotos: FC<LotosProps> = ({ history, location, match }) => {
  const [open, setOpen] = React.useState(false);
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down('sm'));
  const [state, dispatch] = useReducer(searchReducer, initialState);
  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  /** 現状のstateを変数へ格納して入力値で書き換える（exact系の番号） */
  const inputChangedExactNumber = () => (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    // 現状のstateを変数へ格納して入力値で書き換える
    dispatch({
      type: INPUT_EDIT,
      inputName: event.target.name,
      payload: event.target.value,
    });
  };
  const lotoType = location.pathname;
  const [lotoSevens, setLotoSevens] = useState<LotoSevenType[]>([]);
  const [searchResultLotoSevens, setSearchResultLotoSevens] = useState<
    LotoSevenType
  >();
  const getLotoSevens = async () => {
    const response = await axios
      .get(`http://127.0.0.1:8888/api${lotoType}/`)
      // eslint-disable-next-line no-shadow
      .catch((error: AxiosError) => {
        throw error;
      });
    if (response.status !== 200) {
      throw new Error('Server Error');
    }
    const res = response.data;

    return setLotoSevens(res);
  };

  const search = async () => {
    // state.exactMode &&
    const response = await axios
      .get(`http://127.0.0.1:8888/api${location.pathname}/`, {
        params: { lottery_number: state.lottery_number },
      })
      // eslint-disable-next-line no-shadow
      .catch((error: AxiosError) => {
        throw error;
      });
    if (response.status !== 200) {
      throw new Error('Server Error');
    }
    const res = response.data;
    handleClose();

    return setLotoSevens(res);
  };

  // 一発目は全てのデータを取ってくる
  useEffect(() => {
    getLotoSevens();
  }, []);
  // 入力あるたびに検索したい
  // useEffect(() => {
  //   searchLotoSevens().catch((error: AxiosError) => {
  //     throw error;
  //   });
  // }, [number]);

  return (
    <>
      <Button variant="outlined" color="primary" onClick={handleClickOpen}>
        絞り込み検索
      </Button>
      <Dialog
        fullScreen={fullScreen}
        open={open}
        onClose={handleClose}
        aria-labelledby="responsive-dialog-title"
      >
        <DialogTitle id="responsive-dialog-title">絞り込み検索</DialogTitle>
        <DialogContent>
          <DialogContentText>
            番号の検索には「厳密検索モード」・「部分一致検索モード」があります。
            <br />
            ・厳密検索モード：数字の位置（第○数字）までを指定して対象の情報を検索します。
            <br />
            &nbsp;&nbsp;・例）第１数字が２のときの回があるかどうかを検索する。
            <br />
            ・部分一致検索モード：指定された番号が全て含まれている情報を検索します。
            <br />
            &nbsp;&nbsp;・例）1,11が結果に含まれている回があるかどうかを検索する
          </DialogContentText>
          <TextField
            autoFocus
            margin="dense"
            name="lottery_number"
            label="検索したい番号をカンマ（,）区切りで入力してください"
            fullWidth
            onChange={inputChangedExactNumber()}
          />
        </DialogContent>
        <DialogActions>
          <Button variant="outlined" onClick={handleClose} color="primary">
            閉じる
          </Button>
          <Button
            onClick={search}
            color="primary"
            autoFocus
            variant="contained"
          >
            検索
          </Button>
        </DialogActions>
      </Dialog>
      <LotosList data={lotoSevens} />
    </>
  );
};

export default withRouter(Lotos);
