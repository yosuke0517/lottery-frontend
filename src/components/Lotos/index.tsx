import React, { FC, useEffect, useReducer, useState } from 'react';
import { RouteComponentProps, withRouter } from 'react-router';
import {
  createStyles,
  makeStyles,
  Theme,
  useTheme,
} from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import useMediaQuery from '@material-ui/core/useMediaQuery';

import axios, { AxiosError } from 'axios';
import Input from '@material-ui/core/Input';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import Chip from '@material-ui/core/Chip';
import { useCookies } from 'react-cookie';
import { Column, LotosList } from './lotosList';
import { SearchTypes } from '../../types/searchTypes';
import {
  ERROR_CATCHED,
  FETCH_SUCCESS,
  INPUT_EDIT,
  START_FETCH,
  TOGGLE_MODE,
} from '../../types/actionTypes';
import { LotoTypes } from '../../types/lotoTypes';
import { LotoSevenType } from '../../types/lotoSevenType';
import CONST from '../../const/lotoTypes';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    formControl: {
      margin: theme.spacing(1),
      minWidth: 120,
      maxWidth: 300,
    },
    chips: {
      display: 'flex',
      flexWrap: 'wrap',
    },
    chip: {
      margin: 2,
    },
    noLabel: {
      marginTop: theme.spacing(3),
    },
    lotoName: {
      marginRight: theme.spacing(3),
    },
  }),
);

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

const getStyles = (name: string, simpleSearchParam: string[], theme: Theme) => {
  return {
    fontWeight:
      simpleSearchParam.indexOf(name) === -1
        ? theme.typography.fontWeightRegular
        : theme.typography.fontWeightMedium,
  };
};

const Lotos: FC<LotosProps> = ({ history, location, match }) => {
  const classes = useStyles();
  const [cookies, setCookie] = useCookies(['current-token']);
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

  /**
   * 1桁の場合は0○にする
   * @param: inputNum
   * */
  const makeParam = (inputNum: string[]) => {
    // 照準じゃないと想定結果が得られないので昇順にソートする
    inputNum.sort();
    // 1桁の番号にprefixの0をつけて返す
    const prefixZeroArrayNum = inputNum.map(value => {
      if (value.length === 1) {
        return `0${value}`;
      }
      // 1桁以外の場合はそのままでOK
      // eslint-disable-next-line newline-before-return
      return value;
    });

    return prefixZeroArrayNum.join(',');
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
  // miniloto or lotosix or lotoseven
  const lotoType = location.pathname;

  // ロトタイプの英語表記,日本語表記をObjectで取得する
  const getLotoTypeObj = (): LotoTypes | undefined => {
    return CONST.LOTO_TYPES_OBJ.find(v => v.id === lotoType.slice(1));
  };

  const lotoTypeObj = getLotoTypeObj();

  // 検索時に選択するための番号（配列）をロトタイプに合わせて動的に生成する
  const makeSelectNumbers = (): string[] => {
    // デフォルトはミニロト
    let limitNum = 31;
    const numArray = [];
    switch (lotoType) {
      case '/lotosix':
        limitNum = 43;
        break;
      case '/lotoseven':
        limitNum = 37;
        break;
      default:
        break;
    }
    // eslint-disable-next-line no-plusplus
    for (let i = 1; i <= limitNum; i++) {
      numArray.push(i.toString());
    }

    return numArray;
  };

  const [simpleSearchParam, setSimpleSearchParam] = React.useState<string[]>(
    [],
  );

  const ITEM_HEIGHT = 48;
  const ITEM_PADDING_TOP = 8;

  const MenuProps = {
    PaperProps: {
      style: {
        maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
        width: 250,
      },
    },
  };

  const handleChange = (event: React.ChangeEvent<{ value: unknown }>) => {
    setSimpleSearchParam(event.target.value as string[]);
  };
  const [lotoSevens, setLotoSevens] = useState<LotoSevenType[]>([]);
  const [searchResultLotoSevens, setSearchResultLotoSevens] = useState<
    LotoSevenType
  >();

  // 取得した実施結果をソートする関数（ソートkeyは第n回）
  const resultSort = (data: LotoSevenType[]): LotoSevenType[] => {
    data.sort((a: LotoSevenType, b: LotoSevenType) => {
      if (a.times > b.times) {
        return -1;
      }
      if (a.times < b.times) {
        return 1;
      }

      return 0;
    });

    return data;
  };

  const getLotoResults = async () => {
    const response = await axios
      .get(`${process.env.REACT_APP_ENDPOINT}/api${lotoType}/`, {
        headers: {
          Authorization: `Token ${cookies['current-token']}`,
        },
      })
      // eslint-disable-next-line no-shadow
      .catch((error: AxiosError) => {
        if (error.response?.status === 401) {
          window.location.href = '/login';
        }
        throw error;
      });
    if (response.status !== 200) {
      throw new Error('Server Error');
    }
    const res: LotoSevenType[] = resultSort(response.data);

    // 同じ結果が複数表示される件に対する暫定対応（findIndexで取得したindexと現在のindexを比較することで表現）
    // TODO 本来はバックエンドで同じtimesのデータをDBに格納しないようにしなければいけない
    const filterResult = res.filter(
      (loto, index, self) =>
        self.findIndex(e => e.times === loto.times) === index,
    );

    return setLotoSevens(filterResult);
  };

  const search = async () => {
    // state.exactMode &&
    const params = makeParam(simpleSearchParam);
    const response = await axios
      .get(`${process.env.REACT_APP_ENDPOINT}/api${location.pathname}/`, {
        params: { lottery_number: params },
        headers: {
          Authorization: `Token ${cookies['current-token']}`,
        },
      })
      // eslint-disable-next-line no-shadow
      .catch((error: AxiosError) => {
        if (error.response?.status === 401) {
          window.location.href = '/login';
        }
        throw error;
      });
    if (response.status !== 200) {
      throw new Error('Server Error');
    }
    const res: LotoSevenType[] = resultSort(response.data);
    handleClose();

    return setLotoSevens(res);
  };

  // 一発目は全てのデータを取ってくる
  useEffect(() => {
    getLotoResults();
  }, []);

  return (
    <div className="App-header">
      <div className="searchButton">
        <span className={classes.lotoName}>{lotoTypeObj?.ja}</span>
        <Button variant="outlined" color="primary" onClick={handleClickOpen}>
          シンプル絞り込み検索
        </Button>
      </div>
      <Dialog
        fullScreen={fullScreen}
        open={open}
        onClose={handleClose}
        aria-labelledby="responsive-dialog-title"
      >
        <DialogTitle id="responsive-dialog-title">
          シンプル絞り込み検索
        </DialogTitle>
        <DialogContent>
          <DialogContentText>
            検索単位：開催日
            <br />
            &nbsp;&nbsp;・「番号選択」にて選択した番号が含まれている結果を開催日単位で表示します。
          </DialogContentText>
          <FormControl className={classes.formControl}>
            <InputLabel id="demo-mutiple-chip-label">番号選択</InputLabel>
            <Select
              labelId="demo-mutiple-chip-label"
              id="demo-mutiple-chip"
              multiple
              value={simpleSearchParam}
              onChange={handleChange}
              input={<Input id="select-multiple-chip" />}
              renderValue={selected => (
                <div className={classes.chips}>
                  {(selected as string[]).map(value => (
                    <Chip key={value} label={value} className={classes.chip} />
                  ))}
                </div>
              )}
              MenuProps={MenuProps}
            >
              {makeSelectNumbers().map(number => (
                <MenuItem
                  key={number}
                  value={number}
                  style={getStyles(number, simpleSearchParam, theme)}
                >
                  {number}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
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
      <LotosList data={lotoSevens} lotoType={lotoType} />
    </div>
  );
};

export default withRouter(Lotos);
