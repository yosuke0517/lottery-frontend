import React, { useState, useEffect } from 'react';
import axios, { AxiosError } from 'axios';
import { Simulate } from 'react-dom/test-utils';
import { LotoSevenType } from '../types/lotoSevenType';

export const LotoSevenList = () => {
  const [lotoSevens, setLotoSevens] = useState<LotoSevenType[]>([]);
  const [number, setNumber] = useState<string>('');
  const [searchResultLotoSevens, setSearchResultLotoSevens] = useState<
    LotoSevenType
  >();
  const getLotoSevens = async () => {
    const response = await axios
      .get('http://0.0.0.0:8000/api/loto_seven/')
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
      .get(`http://0.0.0.0:8000/api/loto_seven/${number}`)
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
            {`第${lotoSeven.times}回`}
            {lotoSeven.number}
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
      <h3>{searchResultLotoSevens?.number}</h3>
    </div>
  );
};
