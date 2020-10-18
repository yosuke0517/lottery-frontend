import React, { useState, useEffect, FC } from 'react';
import axios, { AxiosError } from 'axios';
import { Simulate } from 'react-dom/test-utils';
import { LotoSevenType } from '../types/lotoSevenType';
// eslint-disable-next-line import/no-cycle
import ResultTable from './ResultTable';

export interface Column {
  id:
    | 'lottery_date'
    | 'times'
    | 'number_1'
    | 'number_2'
    | 'number_3'
    | 'number_4'
    | 'number_5'
    | 'number_6'
    | 'number_7'
    | 'bonus_number1'
    | 'bonus_number2'
    | 'lottery_number';
  label: string;
  minWidth?: number;
  align?: 'right';
  format?: (value: number) => string;
}

const columns: Column[] = [
  { id: 'lottery_date', label: '抽選日時', minWidth: 70 },
  { id: 'times', label: '開催回数（第何回）', minWidth: 70 },
  {
    id: 'number_1',
    label: '第1数字',
    minWidth: 70,
    align: 'right',
  },
  {
    id: 'number_2',
    label: '第2数字',
    minWidth: 70,
    align: 'right',
  },
  {
    id: 'number_3',
    label: '第3数字',
    minWidth: 70,
    align: 'right',
  },
  {
    id: 'number_4',
    label: '第4数字',
    minWidth: 70,
    align: 'right',
  },
  {
    id: 'number_5',
    label: '第5数字',
    minWidth: 70,
    align: 'right',
  },
  {
    id: 'number_6',
    label: '第6数字',
    minWidth: 70,
    align: 'right',
  },
  {
    id: 'number_7',
    label: '第7数字',
    minWidth: 70,
    align: 'right',
  },
  {
    id: 'bonus_number1',
    label: '第1ボーナス数字',
    minWidth: 70,
    align: 'right',
  },
  {
    id: 'bonus_number2',
    label: '第2ボーナス数字',
    minWidth: 70,
    align: 'right',
  },
];
// eslint-disable-next-line @typescript-eslint/ban-types
export const LotoSevenList: FC<{}> = () => {
  const [lotoSevens, setLotoSevens] = useState<LotoSevenType[]>([]);
  const [number, setNumber] = useState<string>('');
  const [searchResultLotoSevens, setSearchResultLotoSevens] = useState<
    LotoSevenType
  >();
  const getLotoSevens = async () => {
    const response = await axios
      .get('http://127.0.0.1:8888/api/lotoseven/')
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
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const searchLotoSevens = async () => {
    const response = await axios
      .get(`http://127.0.0.1:8888/api/lotoseven/${number}`)
      .catch((error: AxiosError) => {
        throw error;
      });
    if (response.status !== 200) {
      throw new Error('Server Error');
    }
    const res = response.data;

    return setSearchResultLotoSevens(res);
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
    <div>
      <ResultTable header={columns} data={lotoSevens} />
    </div>
  );
};
