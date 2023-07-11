/** @jsxImportSource @emotion/react */
import { Dialog } from "@/pages/components/Dialog";
import SvgIcon from "@/pages/components/SvgIcon";
import { useLoginDialogStore } from "@/pages/mainChat/store/dialog";
import { LoginType } from "@/pages/service/EncooAuthService";
import { EncooHttpService } from "@/pages/service/EncooHttpService";
import { useLoginUserStore } from "@/pages/store/loginUser";
import { ReactComponent as IconGoogle } from "@assets/img/icon-google.svg";
import { ReactComponent as IconWechat } from "@assets/img/icon-wechat.svg";
import spinImg from "@assets/img/spin.png";
import { css, keyframes } from "@emotion/react";
import { Button } from "antd";
import { Fragment, memo, useCallback, useEffect, useState } from "react";
// todo 多语言

const spin = keyframes`
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
`;

const WechatLoginContent = memo(() => {
  const [loading, setLoading] = useState(false);
  const [loginUrl, setLoginUrl] = useState("");
  const onPrivacyClick = useCallback(() => {
    window.open("https://beezy.cool/privacy/");
  }, []);

  useEffect(() => {
    setLoading(true);
    EncooHttpService.config
      .getConfig()
      .then((config) => {
        let path = "qrlogin.html?client_id=Honeybee";
        if (!config.endpoints.sso.endsWith("/")) {
          path = "/" + path;
        }
        setLoginUrl(`${config.endpoints.sso}${path}`);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  return (
    <Fragment>
      <div
        className="text-center"
        css={css`
          width: 280px;
          font-size: 16px;
          line-height: 32px;
          .ant-btn {
            padding: 0px;
          }
        `}
      >
        请先
        <span
          css={css`
            color: #00b578;
          `}
        >
          「微信」
        </span>
        扫码关注公众号完成登录
        <div>👇 👇 👇</div>
      </div>
      <div
        css={css`
          width: 180px;
          height: 180px;
          margin: 0px auto;
          display: flex;
        `}
      >
        {loading ? (
          <img
            css={css`
              animation: ${spin} 1.2s infinite;
              animation-timing-function: linear;
              margin: auto;
            `}
            src={spinImg}
            alt={""}
          />
        ) : (
          <iframe
            title="weixin"
            width={180}
            height={180}
            css={css`
              border: none;
            `}
            src={loginUrl}
          />
        )}
      </div>

      <div
        css={css`
          .ant-btn {
            padding: 0 2px;
          }
        `}
      >
        登录即表示同意
        <Button type="link">《服务条款》</Button>和
        <Button type="link" onClick={onPrivacyClick}>
          《隐私条款》
        </Button>
      </div>
    </Fragment>
  );
});

const cssButton = css`
  display: flex;
  align-items: center;
  width: 266px;
  height: 44px;
  border: 1px solid #f0f0f0 !important;
  background: #ffffff;
  border-radius: 8px;
  padding: 0 40px !important;
  text-align: left;
`;

export const LoginDialog = memo((props: { isOpen: boolean }) => {
  const { isOpen } = props;
  const close = useLoginDialogStore((state) => state.close);
  const authInfo = useLoginUserStore((state) => state.authInfo);
  const login = useLoginUserStore((state) => state.login);
  const [loginType, setLoginType] = useState<LoginType | undefined>("wechat");
  // todo 顺序

  useEffect(() => {
    if (authInfo) {
      close();
    }
  }, [close, authInfo]);

  // useEffect(() => {
  //   if (isOpen) {
  //     setLoginType(undefined);
  //   }
  // }, [isOpen]);

  const onGoogleLogin = useCallback(() => {
    login("google");
  }, [login]);

  const onWechatClick = useCallback(() => {
    setLoginType("wechat");
  }, []);

  return (
    <Dialog visible={isOpen} onCancel={close}>
      <div
        className="w-full h-full flex relative"
        css={css`
          color: #1e293e;
          padding: 30px 0px 10px;
        `}
      >
        <div
          className="flex flex-col items-center justify-center flex-1"
          css={css`
            row-gap: 30px;
          `}
        >
          {loginType == null && (
            <Fragment>
              <div
                css={css`
                  font-family: Source Han Sans CN;
                  font-size: 16px;
                  font-weight: 500;
                  line-height: 17px;
                  letter-spacing: 0em;

                  color: #ffcc00;
                `}
              >
                Welcome to Chat Beezy!
              </div>
              <Button css={cssButton} onClick={onGoogleLogin}>
                <SvgIcon
                  css={css`
                    display: inline-block;
                    margin-right: 8px;
                  `}
                  SvgComponent={IconGoogle}
                  value={16}
                />
                SIGN UP WITH GOOGLE
              </Button>
              <Button css={cssButton} onClick={onWechatClick}>
                <SvgIcon
                  css={css`
                    display: inline-block;
                    margin-right: 8px;
                  `}
                  SvgComponent={IconWechat}
                  value={16}
                />
                微信登录
              </Button>
            </Fragment>
          )}

          {loginType === "wechat" && <WechatLoginContent />}
        </div>
      </div>
    </Dialog>
  );
});
