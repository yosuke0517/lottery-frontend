export interface LoginTypes {
  isLoading: false; // ローディング管理用
  isLoginView: true; // ログインか新規登録か
  error: '';
  // ログインの場合はユーザ名とパスワード（djangoの関係）
  credentialsLogin: {
    username: '';
    password: '';
  };
  // 登録の場合はemailでOK（djangoの関係）
  credentialsRegister: {
    email: '';
    password: '';
  };
}
