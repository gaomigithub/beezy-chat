import { useState, useEffect } from 'react'
import logo from '../logo.svg'
const useFreeLogin = () => {
  const [userInfo, setUserInfo] = useState({
    avatar: logo,
    name: 'react app',
  })
  const [code, setCode] = useState('')
  const init = async () => {
    try {
      if (window.h5sdk) {
        const appId = await fetch('/get_app_id').then((res) => res.text())
        // 通过error接口处理API验证失败后的回调
        window.h5sdk.error((err) => {
          throw ('h5sdk error:', JSON.stringify(err))
        })

        // 通过ready接口确认环境准备就绪后才能调用API
        window.h5sdk.ready(() => {
          console.log('window.h5sdk.ready')
          // 调用JSAPI tt.requestAuthCode 获取 authorization code
          window.tt.requestAuthCode({
            appId,
            // 获取成功后的回调
            async success(res) {
              console.log('getAuthCode succeed')
              setCode(res.code)
              alert(res.code)

              console.log({ authcode: res.code })

              //authorization code 存储在 res.code
              // 此处通过fetch把code传递给接入方服务端Route: callback，并获得user_info
              // 服务端Route: callback的具体内容请参阅服务端模块server.py的callback()函数
              //   const useInfo = await fetch(
              //     `/get_user_info?code=${res.code}`
              //   ).then((res) => res.json())
              //   setUserInfo({
              //     avatar: useInfo.avatar_url,
              //     name: useInfo.name,
              //   })
            },
            // 获取失败后的回调
            fail(err) {
              console.log(`getAuthCode failed, err:`, JSON.stringify(err))
            },
          })
        })
      } else {
        alert('window.h5sdk不存在,请在飞书客户端打开')
      }
    } catch (error) {
      console.log(error)
    }
  }

  useEffect(() => {
    init()
  }, [])

  return { userInfo, code }
}

export default useFreeLogin
