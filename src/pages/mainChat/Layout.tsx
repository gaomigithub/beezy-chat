/** @jsxImportSource @emotion/react */
import { CollectionNotification } from '@/pages/components/Notification'
import { ChatMain } from '@/pages/mainChat/ChatMain'
import { LoginDialog } from '@/pages/mainChat/LoginDialog'
import { EncooBeeSideBar } from '@/pages/mainChat/SideBar'

import { useLoginDialogStore } from '@/pages/mainChat/store/dialog'
import { css } from '@emotion/react'
import { memo, useCallback, useEffect } from 'react'
import { EncooHttpService } from '../service/EncooHttpService'
import axios from 'axios'
import useFreeLogin from '@/client/use-free-login'
import { FeishuAuthService } from '../service/EncooAuthService/authService/FeishuAuthService'

export const EncooLayout = memo(() => {
  // todo 暂时没去弄路由跟store结合的好方法。 暂时先放到这里
  // useEffect(() => {
  //   const callback = (payload: unknown) => {
  //     const p = payload as { to: string; option: NavigateOptions };
  //     navigate(p.to, p.option);
  //     tableServicer.eventTracking({ eventKey: "START-UP", content: p.to });
  //   };
  //   serviceWorkerReceiver.addListener("NavigateNotification", callback);

  //   return () => {
  //     serviceWorkerReceiver.removeListener("NavigateNotification", callback);
  //   };
  // }, [navigate, tableServicer]);
  const { code } = useFreeLogin()

  const authService = new FeishuAuthService((authStatus) => {
    console.log(authStatus)
  })
  const requestFeishuAuthInfo = useCallback(() => {
    EncooHttpService.config.getConfig().then(async (config) => {
      let path = 'connect/token'
      if (!config.endpoints.sso.endsWith('/')) {
        path = '/' + path
      }
      //   const authInfo = axios.post(`${config.endpoints.sso}${path}`)
      if (code.length > 0) {
        let params = new URLSearchParams()
        params.append('code', code)
        params.append('client_id', 'Honeybee')
        params.append('provider', 'FeiShu')
        params.append('grant_type', 'provider')

        const response = await axios.post(
          `${config.endpoints.sso}${path}`,
          params,
          { headers: { 'Content-Type': 'application/x-www-form-urlencoded' } }
        )

        if (response) {
          const _res = response.data
          console.log({ _res })
          window.postMessage(_res, '*')
        }
      }
    })
  }, [code])

  useEffect(() => {
    requestFeishuAuthInfo()
  }, [requestFeishuAuthInfo])

  return (
    <div
      className="flex flex-row"
      css={css`
        width: 100%;
        height: 100%;
      `}
    >
      {/* <div
        className="flex flex-shrink-0"
        css={css`
          min-width: 64px;
          width: 64px;
          height: 100%;
          z-index: 2;
        `}
      >
        <EncooBeeSideBar />
      </div> */}
      <div
        className="flex flex-1 relative"
        css={css`
          min-width: 0;
        `}
      >
        <CollectionNotification>
          <ChatMain />
        </CollectionNotification>
      </div>
      {/* {isLoginOpen && <LoginDialog isOpen={isLoginOpen} />} */}
    </div>
  )
})
