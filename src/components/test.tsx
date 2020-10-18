import React, { FC, useState } from 'react';

interface Props {
  test: string;
}

interface UserData {
  id: number;
  name: string;
}
export const Test: FC<Props> = props => {
  // props はこんな感じで受け取る
  const { test } = props;
  // ジェネリクスでnull許容
  const [count, setCount] = useState<number | null>(0);
  // ジェネリクスでオブジェクトを型として指定
  const [user, setUser] = useState<UserData | null>({ id: 1, name: 'yosuke' });

  const [inputData, setInputData] = useState('');

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputData(e.target.value);
  };

  return (
    <div>
      <h1>{test}</h1>
      <input type="text" value={inputData} onChange={handleInputChange} />
      <h1>{inputData}</h1>
      <h1>{count}</h1>
      <h1>
        {user?.id} {user?.name}
      </h1>
    </div>
  );
};
