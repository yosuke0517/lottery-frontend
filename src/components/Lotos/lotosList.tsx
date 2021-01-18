import React, { useState, useEffect, FC } from 'react';
import axios, { AxiosError } from 'axios';
import { Simulate } from 'react-dom/test-utils';
import { LotoSevenType } from '../../types/lotoSevenType';
// eslint-disable-next-line import/no-cycle
import ResultTable from '../ResultTable';
import CONST from '../../const/lotoTypes';

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

const columns: Column[] | [] = [
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

interface LotoListProps {
  data: LotoSevenType[];
  lotoType: string;
}

// eslint-disable-next-line @typescript-eslint/ban-types
export const LotosList: FC<LotoListProps> = lotoList => {
  const shavedDateData: LotoSevenType[] = [];
  // eslint-disable-next-line no-shadow
  const data = lotoList.data.map(data => {
    // eslint-disable-next-line no-param-reassign
    data.lottery_date = data.lottery_date.slice(0, 10);
    shavedDateData.push(data);

    return shavedDateData;
  });

  // lotoTypeに応じてヘッダーを編集
  const header = () => {
    switch (lotoList.lotoType.slice(1)) {
      case 'miniloto':
        return columns.filter(column => CONST.MINI_LOTO.includes(column.id));
      case 'lotosix':
        return columns.filter(column => CONST.LOTO_SIX.includes(column.id));
      case 'lotoseven':
        return columns.filter(column => CONST.LOTO_SEVEN.includes(column.id));
      default:
        return [];
    }
  };

  return (
    <div>
      <ResultTable header={header()} data={shavedDateData} />
    </div>
  );
};
