/**
 * ------- axios共通処理 -------
 */
export default function ({ $axios, redirect }) {
  /**
   * ------- リクエスト/レスポンス -------
   */
  /** リクエスト/レスポンス 共通エラー処理 */
  $axios.onError((_error) => {})

  /**
   * ------- リクエスト -------
   */
  /** リクエスト前処理 */
  $axios.onRequest((_config) => {})
  /** リクエストエラー処理 */
  $axios.onRequestError((_error) => {})

  /**
   * ------- レスポンス -------
   */
  /** レスポンス前処理 */
  $axios.onResponse((response) => {
    // eslint-disable-next-line no-console
    console.log('response後処理')
    // eslint-disable-next-line no-console
    // console.log(response)
  })
  /** レスポンスエラー処理 */
  $axios.onResponseError((error) => {
    switch (error.response?.status) {
      case 400:
        // *. パラメーターが無効 => InvalidQueryParameterValue
        // eslint-disable-next-line no-console
        console.log('400のerror')
        // redirect('/member/sign-in')
        break
      case 401:
        // *. cookieが無効 => InvalidAuthenticationInfo
        // eslint-disable-next-line no-console
        console.log('401のerror')
        // redirect('/member/sign-in')
        break
      case 404:
        // *. cookieが無効 => InvalidAuthenticationInfo
        // eslint-disable-next-line no-console
        console.log('404のerror')
        // redirect('/member/sign-in')
        break
      case 500:
        // *. APIサーバー内部エラー
        // eslint-disable-next-line no-console
        console.log('500のerror')
        // redirect('/member/sign-in')
        break
    }
  })
}
