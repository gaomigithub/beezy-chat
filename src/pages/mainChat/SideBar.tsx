/** @jsxImportSource @emotion/react */
import Button from '@/pages/components/Button'
import SvgIcon from '@/pages/components/SvgIcon'
import { useLoginDialogStore } from '@/pages/mainChat/store/dialog'
import { useLoginUserStore } from '@/pages/store/loginUser'

import { ReactComponent as IconGrayPortrait } from '@assets/img/grayPortrait.svg'
import { ReactComponent as IconPortrait } from '@assets/img/portrait.svg'
import { css } from '@emotion/react'
import { Dropdown } from 'antd'
import { memo, useCallback, useMemo } from 'react'

export const EncooBeeSideBar = memo(() => {
  const authInfo = useLoginUserStore((state) => state.authInfo)
  const open = useLoginDialogStore((state) => state.open)
  const logout = useLoginUserStore((state) => state.logout)

  const changeRouter = useCallback(() => {
    if (!authInfo) {
      open()
    }
  }, [open, authInfo])

  const loginOptions = useMemo(() => {
    return [
      {
        label: 'logout', //formatMessage(localeSidebar.logout),
        key: 'logout',
      },
    ]
  }, [])

  const changeSelectType = useCallback(
    (info: { key: string }) => {
      const { key } = info
      if (key === 'logout') {
        logout()
      }
    },
    [logout]
  )

  const menuOptions = useMemo(() => {
    return {
      items: loginOptions,
      onClick: changeSelectType,
      multiple: false,
    }
  }, [changeSelectType, loginOptions])

  const cssButton = css`
    width: 52px;
    height: 52px;
    display: flex;
    align-items: center;
    flex-direction: column;
    padding: 4px;

    font-size: 12px;
    color: #3d3d3d;
    :disabled {
      color: #3d3d3d !important;
      background-color: #f4f4f4;
    }
  `

  return (
    <div
      className="flex flex-col w-full h-full justify-between"
      css={css`
        background: #fafcff;
        padding: 10px 0 20px 0;
        color: #1e293e;
        border-right: solid 1px #ebebeb;
        font-size: 12px;
      `}
    >
      <ul
        className="flex flex-col"
        css={css`
          row-gap: 16px;
          li {
            display: flex;
            flex-direction: column;
            align-items: center;
            .ant-btn {
              margin: 0 auto;
            }
          }
        `}
      >
        <li>
          <Button type="text" css={cssButton}>
            {/* <img
              css={css`
                margin: auto;
              `}
              src="imgs/logo.png"
              alt=""
              width={24}
              height={24}
            ></img> */}
            B
          </Button>
        </li>

        <li>
          {/* <Button type="text">
            <SvgIcon SvgComponent={IconRemind} value={30} />
          </Button> */}
        </li>
        <li>
          {/* <Button type="text">
            <SvgIcon SvgComponent={IconQuestions} value={30} />
          </Button> */}
        </li>
      </ul>
      <div className="flex flex-col items-center">
        {/* <SvgIcon SvgComponent={IconMarket} value={24} />
        {formatMessage(localeSidebar.market)} */}

        {authInfo ? (
          <Dropdown menu={menuOptions}>
            <Button type="text">
              <SvgIcon SvgComponent={IconPortrait} value={30} />
            </Button>
          </Dropdown>
        ) : (
          <Button type="text" onClick={changeRouter}>
            <SvgIcon SvgComponent={IconGrayPortrait} value={30} />
          </Button>
        )}
      </div>
    </div>
  )
})
