import React, { useState, useEffect, FC } from 'react';
import axios, { AxiosError } from 'axios';
import { Simulate } from 'react-dom/test-utils';
import { LotoSevenType } from '../types/lotoSevenType';

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
  useEffect(() => {
    getLotoSevens();
  }, []);
  // 入力あるたびに検索したい
  // useEffect(() => {
  //   console.log('number');
  //   searchLotoSevens().catch((error: AxiosError) => {
  //     throw error;
  //   });
  // }, [number]);

  return (
    <div>
      <p>LotoSeven</p>
      <ul>
        {lotoSevens.map((lotoSeven: any) => (
          <li key={lotoSeven.times}>
            {`第${lotoSeven.times}回 `}
            {`${lotoSeven.number_1},`}
            {`${lotoSeven.number_2},`}
            {`${lotoSeven.number_3},`}
            {`${lotoSeven.number_4},`}
            {`${lotoSeven.number_5},`}
            {`${lotoSeven.number_6},`}
            {`${lotoSeven.number_7},`}
            {`${lotoSeven.bonus_number1},`}
            {`${lotoSeven.bonus_number2}`}
          </li>
        ))}
      </ul>
      <input
        type="text"
        value={number}
        onChange={event => setNumber(event.target.value)}
      />
      <button type="button" onClick={() => searchLotoSevens()}>
        Search
      </button>
    </div>
  );
};
