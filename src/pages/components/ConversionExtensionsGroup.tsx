/** @jsxImportSource @emotion/react */

import { ConversationMessageExtensionEnum } from "@/models/chat";
import Button from "@/pages/components/Button";
import { conversionExtensionConfig } from "@/pages/components/MessageFooterTools";
import SvgIcon from "@/pages/components/SvgIcon";
import {
  useChatExtensionStore,
  useExtensionsOfChannel,
} from "@/pages/store/chatExtension";
import { ReactComponent as IconClose } from "@assets/img/icon-ext-close.svg";
import { css } from "@emotion/react";
import { memoize } from "lodash-es";
import { memo, useMemo } from "react";

export const ConversionExtensionsGroup = memo(() => {
  const { channel, extensions } = useExtensionsOfChannel();

  const selectedConfigs = useMemo(() => {
    return conversionExtensionConfig.filter(
      (config) => extensions.indexOf(config.key) > -1
    );
  }, [extensions]);
  const removeExtension = useChatExtensionStore(
    (state) => state.removeExtension
  );

  const onClose = useMemo(
    () =>
      memoize((type: ConversationMessageExtensionEnum) => () => {
        removeExtension(channel, type);
      }),
    [channel, removeExtension]
  );

  return extensions.length === 0 ? null : (
    <div
      className="flex flex-row items-center"
      css={css`
        // todo 后面横滑
        padding: 3px 10px;
        width: 100%;
      `}
    >
      {selectedConfigs.map((config) => (
        <div
          className="flex flex-row items-center"
          css={css`
            font-size: 12px;
            background: #f4f5f7;
            height: 30px;
            border-radius: 15px;
            padding: 7px 8px;
          `}
          key={config.key}
        >
          <SvgIcon
            css={css`
              margin-right: 3px;
            `}
            SvgComponent={config.icon}
            value={16}
          />
          {config.name}
          <Button
            css={css`
              margin-left: 2px;
              padding: 8px 0 8px 10px;
            `}
            onClick={onClose(config.key)}
          >
            <SvgIcon SvgComponent={IconClose} value={16} />
          </Button>
        </div>
      ))}
    </div>
  );
});
