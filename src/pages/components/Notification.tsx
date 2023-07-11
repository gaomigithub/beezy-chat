/** @jsxImportSource @emotion/react */
import { css } from "@emotion/react";
import { Alert } from "antd";
import {
  createContext,
  memo,
  ReactNode,
  useCallback,
  useContext,
  useMemo,
  useRef,
  useState,
} from "react";

export const CollectionNotificationContext = createContext<{
  onOpen: (config: CollectionNotificationConfig) => void;
}>(
  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  undefined!
);

type CollectionNotificationType = "info" | "success" | "error" | "warning";
interface CollectionNotificationConfig {
  duration?: number;
  type: CollectionNotificationType;
  title: ReactNode;
  description?: ReactNode;
}

export const CollectionNotification = memo(
  (props: { children: ReactNode; duration?: number }) => {
    const { children, duration = 5 } = props;
    const notificationTimer = useRef<NodeJS.Timeout | null>();

    const [config, setConfig] = useState<CollectionNotificationConfig | null>(
      null
    );
    const onOpen = useCallback(
      (config: CollectionNotificationConfig) => {
        setConfig(config);
        if (notificationTimer.current) {
          clearTimeout(notificationTimer.current);
        }
        const timer = setTimeout(() => {
          setConfig(null);
          notificationTimer.current = null;
        }, (config.duration ?? duration) * 1000);
        notificationTimer.current = timer;
      },
      [duration, notificationTimer]
    );

    const onClose = useCallback(() => {
      setConfig(null);
    }, []);

    const contextValue = useMemo(() => {
      return {
        onOpen,
      };
    }, [onOpen]);

    const getBorderColor = useCallback((type: CollectionNotificationType) => {
      switch (type) {
        case "info":
          return "#409EFF";
        case "success":
          return "#67C23A";
        case "warning":
          return "#E6A23C";
        case "error":
          return "#F56C6C";
      }
    }, []);

    return (
      <CollectionNotificationContext.Provider value={contextValue}>
        {config ? (
          <div
            className="absolute top-0 w-full left-0 right-0"
            css={css`
              z-index: 1000;
              display: ${config ? "block" : "none"};
            `}
          >
            <Alert
              message={config.title}
              css={css`
                &.ant-alert-info {
                  border-width: 3px 0px 0px 0px;
                  border-color: ${getBorderColor(config.type)};
                }
              `}
              description={config.description}
              type={config.type}
              showIcon
              closable
              onClose={onClose}
            />
          </div>
        ) : null}
        {children}
      </CollectionNotificationContext.Provider>
    );
  }
);

export function useCollectionNotification() {
  const { onOpen } = useContext(CollectionNotificationContext);
  return useCallback(
    (config: CollectionNotificationConfig) => {
      onOpen(config);
    },
    [onOpen]
  );
}
