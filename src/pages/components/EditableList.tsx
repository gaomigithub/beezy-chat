/** @jsxImportSource @emotion/react */
import { css } from "@emotion/react";
import { Tooltip } from "antd";
import { TooltipPlacement } from "antd/lib/tooltip";
import { memoize } from "lodash-es";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import Button from "./Button";

import { TextInput } from "./TextInput";

export interface EditableListItemOperation {
  key?: string;
  icon?: React.ReactNode;
  title?: string;
  fixed?: boolean;
  disabled?: boolean;
  hidden?: boolean;
}

export type EditableListItem = {
  key: string;
  title?: React.ReactNode;
  value?: string;
  editable?: boolean;
  error?: boolean;
  operations?: EditableListItemOperation[];
};

export interface EditableListProps {
  items?: EditableListItem[];
  className?: string;
  editItem?: EditableListItem;
  errorMessage?: string;
  valueMaxLength?: number;
  selectedKey?: string;
  selectable?: boolean;
  onSelect?: (selectedKey: string) => void;
  onClick?: (listItemKey: string) => void;
  onContextMenuClick?: (listItemKey: string, menuItemKey: string) => void;
  onOperationClick?: (listItemKey: string, operationKey: string) => void;
  onValidate?: (listItemKey: string, newValue: string) => string | undefined;
  onClickValidate?: (listItemKey: string) => boolean;
  onEditEnd?: (listItemKey: string, newValue: string) => void;
  onEditCancel?: (editKey: string) => void;
  tooltipPlacement?: TooltipPlacement;
  renderItemOperation?: (
    operation: EditableListItemOperation,
    item: EditableListItem,
    forceFixed: boolean,
    defaultRender: (
      operation: EditableListItemOperation,
      item: EditableListItem,
      forceFixed?: boolean
    ) => React.ReactNode
  ) => React.ReactNode;
  renderEditInput?: (defaultRender: () => React.ReactNode) => React.ReactNode;
}

export const ListContextMenuRenameItemKey = "rename";
export const ListContextMenuDeleteItemKey = "delete";

export const EditableList = React.memo(function EditableList(
  props: EditableListProps
) {
  const {
    items,
    className,
    editItem,
    errorMessage: errorMessageProp,
    valueMaxLength,
    selectedKey,
    selectable,
    onSelect,
    onClick,
    onContextMenuClick,
    onOperationClick,
    onValidate,
    onClickValidate,
    onEditEnd,
    onEditCancel,

    tooltipPlacement,

    renderItemOperation,
    renderEditInput,
  } = props;

  const [editKey, setEditKey] = useState<string | undefined>(undefined);
  const [editValue, setEditValue] = useState<string | undefined>(undefined);
  const [internalSelectedKey, setInternalSelectedKey] = useState<
    string | undefined
  >(undefined);
  const [contextMenuVisibleKey, setContextMenuVisibleKey] = useState<
    string | undefined
  >(undefined);

  const [errorMessage, setErrorMessage] = useState<string | undefined>(
    undefined
  );

  useEffect(() => {
    setErrorMessage(errorMessageProp);
  }, [errorMessageProp]);

  useEffect(() => {
    setEditKey(editItem?.key);
    setEditValue(editItem?.value);
  }, [editItem]);

  useEffect(() => {
    if (selectable) {
      setInternalSelectedKey(selectedKey);
    }
  }, [selectable, selectedKey]);

  useEffect(() => {
    if (internalSelectedKey) {
      onSelect?.(internalSelectedKey);
    }
  }, [internalSelectedKey, onSelect]);

  const internalOnEditEnd = useCallback(
    (isCancel?: boolean) => {
      if ((!editValue || errorMessage || isCancel) && editKey) {
        onEditCancel?.(editKey);
      } else if (!errorMessage && editKey) {
        onEditEnd?.(editKey, editValue ?? "");
      }

      setEditKey(undefined);
      setEditValue(undefined);
      setErrorMessage(undefined);
    },
    [editKey, editValue, errorMessage, onEditCancel, onEditEnd]
  );

  const internalOnEditCancel = useCallback(() => {
    if (editKey) {
      onEditCancel?.(editKey);
    }

    setEditKey(undefined);
    setEditValue(undefined);
    setErrorMessage(undefined);
  }, [editKey, onEditCancel]);

  const onValueChange = useCallback(
    (newValue: string | undefined) => {
      if (!editKey) {
        return;
      }
      const message = onValidate?.(editKey, newValue ?? "");
      setErrorMessage(message);
      setEditValue(newValue);
    },
    [editKey, onValidate]
  );

  const onEditInputFocus = useCallback(
    (event: React.FocusEvent<HTMLInputElement>) => {
      const input = event.target;
      setTimeout(() => {
        input.setSelectionRange?.(0, input.value.length);
      }, 0);
    },
    []
  );

  const onEditInputKeyDown = useCallback(
    (event: React.KeyboardEvent<HTMLInputElement>) => {
      const key = event.key;
      if (key === "Escape") {
        internalOnEditCancel();
      } else if (key === "Enter") {
        internalOnEditEnd();
      }
    },
    [internalOnEditCancel, internalOnEditEnd]
  );

  const onEditInputBlur = useCallback(() => {
    internalOnEditEnd(editItem?.value === editValue);
  }, [editItem?.value, editValue, internalOnEditEnd]);

  const internalOnClick = useMemo(() => {
    return memoize((item: EditableListItem) => {
      return (_event: React.MouseEvent<HTMLLIElement, MouseEvent>) => {
        if (onClickValidate && !onClickValidate(item.key)) {
          return;
        }
        if (selectable) {
          setInternalSelectedKey(item.key);
        }

        onClick?.(item.key);
      };
    });
  }, [onClick, onClickValidate, selectable]);

  const hasFixedOperationItem = useCallback((item: EditableListItem) => {
    return item.operations?.some((operation) => operation.fixed);
  }, []);

  const onInternalOperationClick = useMemo(
    () =>
      memoize((key: string) => {
        return () => {
          const [listItemKey, operationKey] = key.split("|");
          onOperationClick?.(listItemKey, operationKey);
        };
      }),
    [onOperationClick]
  );

  const cssItem = css`
    display: flex;
    padding: 0 10px;
    height: 30px;
    line-height: 30px;
    align-items: center;
    color: #3e434d;

    .operations_hovered {
      opacity: 0;
    }

    .operations_fixed {
      opacity: 1;
      background-color: #f4f4f4;
    }

    :hover {
      background-color: #f4f4f4;
      .operations_hovered {
        opacity: 1;
        position: absolute;
        margin-left: auto;
        background-color: #f4f4f4;
      }

      .operations_fixed {
        opacity: 0;
      }
    }
  `;
  const cssErrorItem = css`
    border: 1px solid #e03200;
  `;
  const cssSelectedItem = css`
    background-color: #f4f4f4;
  `;

  const defaultRenderItemOperation = useCallback(
    (
      operation: EditableListItemOperation,
      item: EditableListItem,
      forceFixed?: boolean
    ) =>
      !operation.hidden ? (
        <div
          css={css`
            margin-left: 3px;
            opacity: ${operation.fixed || forceFixed ? 1 : 0};
          `}
          key={operation.key}
        >
          <Button
            css={css`
              color: ${operation.disabled ? "#bec5d4" : "#8f9bb3"};
              cursor: ${operation.disabled ? "not-allowed" : "pointer"};
              :hover {
                color: ${operation.disabled ? "#bec5d4" : "#8f9bb3"};
              }
              :focus {
                color: ${operation.disabled ? "#bec5d4" : "#8f9bb3"};
              }

              & > svg {
                font-size: 24px;
              }
            `}
            type="link"
            onClick={
              operation.disabled
                ? undefined
                : onInternalOperationClick(item.key + "|" + operation.key)
            }
          >
            {operation.icon}
            {operation.title}
          </Button>
        </div>
      ) : null,
    [onInternalOperationClick]
  );

  const defaultRenderEditInput = useCallback(
    () => (
      <TextInput
        css={css`
          width: 100%;
          height: 24px;
          font-size: 12px;
        `}
        onBlur={onEditInputBlur}
        onFocus={onEditInputFocus}
        onValueChange={onValueChange}
        onKeyDown={onEditInputKeyDown}
        error={errorMessage !== undefined}
        autoFocus={true}
        maxLength={valueMaxLength}
        value={editValue}
      />
    ),
    [
      editValue,
      errorMessage,
      onEditInputBlur,
      onEditInputFocus,
      onEditInputKeyDown,
      onValueChange,
      valueMaxLength,
    ]
  );

  return (
    <ul
      css={css`
        list-style-type: none;
        background-color: #ffffff;
        margin: 0;
        padding: 0;
        border-radius: 0 0 2px 2px;
      `}
      className={className}
    >
      {items?.map((item) => (
        <li
          css={[
            cssItem,
            internalSelectedKey === item.key && cssSelectedItem,
            item.error && cssErrorItem,
          ]}
          key={item.key}
          onClick={internalOnClick(item)}
        >
          {editKey === item.key ? (
            <div
              css={css`
                position: relative;
                width: 100%;
              `}
            >
              {renderEditInput
                ? renderEditInput(defaultRenderEditInput)
                : defaultRenderEditInput()}
              {errorMessage && (
                <div
                  css={css`
                    position: absolute;
                    left: 0px;
                    width: 100%;
                    padding: 5px 10px;
                    font-size: 12px;
                    line-height: 16px;
                    color: #0042ac;
                    background-color: #3e434d;
                    z-index: 10;
                  `}
                >
                  {errorMessage}
                </div>
              )}
            </div>
          ) : (
            <div
              css={css`
                display: flex;
                position: relative;
                width: 100%;
              `}
            >
              {typeof item.title === "string" ? (
                <Tooltip title={item.title} placement={tooltipPlacement}>
                  <span
                    css={css`
                      overflow: hidden;
                      text-overflow: ellipsis;
                      white-space: nowrap;
                    `}
                  >
                    {item.title}
                  </span>
                </Tooltip>
              ) : (
                item.title
              )}

              <div
                css={css`
                  display: flex;
                  align-items: center;
                  position: absolute;
                  right: 0;
                  top: 0;
                  height: 100%;
                `}
                className="operations_hovered"
              >
                {item.operations?.map((operation: EditableListItemOperation) =>
                  renderItemOperation
                    ? renderItemOperation(
                        operation,
                        item,
                        true,
                        defaultRenderItemOperation
                      )
                    : defaultRenderItemOperation(operation, item, true)
                )}
              </div>
              {hasFixedOperationItem(item) && (
                <div
                  css={css`
                    display: flex;
                    align-items: center;
                    position: absolute;
                    right: 0;
                    top: 0;
                    height: 100%;
                  `}
                  className="operations_fixed"
                >
                  {item.operations?.map(
                    (operation: EditableListItemOperation) =>
                      renderItemOperation
                        ? renderItemOperation(
                            operation,
                            item,
                            false,
                            defaultRenderItemOperation
                          )
                        : defaultRenderItemOperation(operation, item, false)
                  )}
                </div>
              )}
            </div>
          )}
        </li>
      ))}
    </ul>
  );
});
