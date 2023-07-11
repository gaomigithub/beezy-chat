/** @jsxImportSource @emotion/react */
import Button from '@/pages/components/Button'
import {
  EditableList,
  ListContextMenuDeleteItemKey,
  ListContextMenuRenameItemKey,
} from '@/pages/components/EditableList'
import SvgIcon from '@/pages/components/SvgIcon'
import { useLoginDialogStore } from '@/pages/mainChat/store/dialog'
import {
  useConversationListStore,
  useCurrentConversion,
} from '@/pages/store/chat'
import { useUploadDialogStore } from '@/pages/store/dialog.ts/upload'
import { useLoginUserStore } from '@/pages/store/loginUser'
import { ReactComponent as IconConversation } from '@assets/img/conversation.svg'
import { ReactComponent as IconConversationDel } from '@assets/img/conversationDel.svg'
import { ReactComponent as IconConversationEdit } from '@assets/img/conversionEdit.svg'
import { ReactComponent as IconBeta } from '@assets/img/icon-beta.svg'
import { ReactComponent as IconFile } from '@assets/img/icon-file.svg'
import { ReactComponent as IconNewChat } from '@assets/img/icon-new-chat.svg'
import { ReactComponent as IconNewFile } from '@assets/img/icon-new-file.svg'
import { ReactComponent as IconNo } from '@assets/img/icon-no.svg'
import { ReactComponent as IconYes } from '@assets/img/icon-yes.svg'

import { css } from '@emotion/react'
import { Input } from 'antd'
import { memo, useCallback, useEffect, useMemo, useState } from 'react'
// import Browser from "webextension-polyfill";

// const gMainChatExtensionUrl = Browser.runtime.getURL('mainChat.html')

export const ConversationList = memo(() => {
  const conversions = useConversationListStore((state) => state.conversations)
  const deleteConversation = useConversationListStore((state) => state.delete)
  const updateConversation = useConversationListStore((state) => state.update)
  const openUploadDialog = useUploadDialogStore((state) => state.open)
  const openLoginDialog = useLoginDialogStore((state) => state.open)
  const currentConversion = useCurrentConversion()
  const authInfo = useLoginUserStore((state) => state.authInfo)

  const onNewChart = useCallback(async () => {
    // document.location.href = gMainChatExtensionUrl + "#";
    window.location.href =
      globalThis.window?.location.origin +
      //   router.basePath +
      //   router.pathname +
      '#'
  }, [])
  const onNewPdfChat = useCallback(() => {
    if (!authInfo) {
      openLoginDialog()
      return
    }
    openUploadDialog()
  }, [authInfo, openLoginDialog, openUploadDialog])

  const [editId, setEditId] = useState<string | undefined>()
  const [editValue, setEditValue] = useState<string | undefined>()
  const [deleteId, setDeleteId] = useState<string | undefined>()

  useEffect(() => {
    if (editId) {
      const editItem = conversions.find((item) => item.id === editId)
      setEditValue(editItem?.title)
    } else {
      setEditValue(undefined)
    }
  }, [conversions, editId])

  const onEditInputChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setEditValue(e.target.value)
    },
    []
  )

  const conversionItems = useMemo(
    () =>
      [...conversions]
        .sort((c1, c2) => c2.createTime - c1.createTime)
        .map((conversion) => {
          return {
            key: conversion.id,
            title: (
              <div
                className="flex items-center"
                css={css`
                  width: 100%;
                `}
              >
                <SvgIcon
                  css={css`
                    margin-right: 5px;
                    margin-top: 2px;
                  `}
                  SvgComponent={
                    deleteId === conversion.id
                      ? IconConversationDel
                      : conversion.type?.name === 'file'
                      ? IconFile
                      : IconConversation
                  }
                  value={12}
                />
                <span
                  css={css`
                    max-width: calc(100% - 20px);
                    width: calc(100% - 20px);
                    overflow: hidden;
                    text-overflow: ellipsis;
                    white-space: nowrap;
                  `}
                >
                  {deleteId === conversion.id ? (
                    `删除 ${conversion.title} ?`
                  ) : editId === conversion.id ? (
                    <Input
                      css={css`
                        width: calc(100% - 30px);
                        height: 18px;

                        padding: 2px;
                        border-radius: 2px;
                        font-size: 12px;
                        border-color: #ffcc00 !important;
                      `}
                      value={editValue}
                      onChange={onEditInputChange}
                      autoFocus={true}
                      maxLength={50}
                    />
                  ) : (
                    conversion.title
                  )}
                </span>
              </div>
            ),
            value: conversion.title,
            operations:
              deleteId === conversion.id || editId === conversion.id
                ? [
                    {
                      icon: <SvgIcon SvgComponent={IconYes} value={12} />,
                      key: 'YES',
                      fixed: true,
                    },
                    {
                      icon: <SvgIcon SvgComponent={IconNo} value={12} />,
                      key: 'NO',
                      fixed: true,
                    },
                  ]
                : [
                    {
                      icon: (
                        <SvgIcon
                          SvgComponent={IconConversationEdit}
                          value={12}
                        />
                      ),
                      key: ListContextMenuRenameItemKey,
                    },
                    {
                      icon: (
                        <SvgIcon
                          SvgComponent={IconConversationDel}
                          value={12}
                        />
                      ),
                      key: ListContextMenuDeleteItemKey,
                    },
                  ],
          }
        }),
    [conversions, deleteId, editId, editValue, onEditInputChange]
  )

  const onOperationClick = useCallback(
    (listItemKey: string, operationKey: string) => {
      if (operationKey === ListContextMenuRenameItemKey) {
        setEditId(listItemKey)
      } else if (operationKey === ListContextMenuDeleteItemKey) {
        setDeleteId(listItemKey)
      } else if (deleteId && operationKey === 'YES') {
        deleteConversation(deleteId)
        setDeleteId(undefined)
      } else if (editId && operationKey === 'YES') {
        if (editValue) {
          const editConversation = conversions.find(
            (item) => item.id === listItemKey
          )
          if (editConversation) {
            updateConversation({ ...editConversation, title: editValue })
          }
        }

        setEditId(undefined)
      } else if (operationKey === 'NO') {
        setDeleteId(undefined)
        setEditId(undefined)
      }
    },
    [
      conversions,
      deleteConversation,
      deleteId,
      editId,
      editValue,
      updateConversation,
    ]
  )

  const onSelect = useCallback(
    (key: string) => {
      if (deleteId && deleteId !== key) {
        setDeleteId(undefined)
      }
      if (editId && editId !== key) {
        setEditId(undefined)
      }
      //   document.location.href = gMainChatExtensionUrl + '#id=' + key
      window.location.href =
        globalThis.window?.location.origin +
        // router.basePath +
        // router.pathname +
        '#id=' +
        key
    },
    [deleteId, editId]
  )

  return (
    <div
      className="w-full h-full flex flex-col"
      css={css`
        min-height: 0;
      `}
    >
      <div
        css={css`
          width: 100% !important;
          padding: 0 8px;
        `}
      >
        <Button
          className="flex items-center font-bold"
          css={css`
            width: 100% !important;
            margin-bottom: 8px;
            justify-content: center;
            min-height: 32px;
          `}
          backgroundColor="rgba(255, 204, 0, 0.1)"
          color="#FFCC00"
          icon={
            <SvgIcon
              css={css`
                margin-right: 3px;
              `}
              SvgComponent={IconNewChat}
              value={16}
            />
          }
          onClick={onNewChart}
        >
          新建会话
        </Button>

        <Button
          className="flex items-center font-bold"
          css={css`
            position: relative;
            width: 100% !important;
            margin-bottom: 8px;
            justify-content: center;
            min-height: 32px;
            padding-left: 21px;
          `}
          backgroundColor="rgba(54, 98, 236, 0.1);"
          color="#3662EC"
          icon={
            <SvgIcon
              css={css`
                margin-right: 3px;
              `}
              SvgComponent={IconNewFile}
              value={16}
            />
          }
          onClick={onNewPdfChat}
        >
          上传文件
          <SvgIcon
            css={css`
              margin-left: 3px;
            `}
            SvgComponent={IconBeta}
            value={21}
          />
        </Button>
      </div>

      <div
        css={css`
          padding: 0 8px;
          flex-grow: 1;
          overflow: auto;
        `}
      >
        <EditableList
          className="w-full h-full"
          items={conversionItems}
          onOperationClick={onOperationClick}
          selectable={true}
          selectedKey={currentConversion?.id}
          onSelect={onSelect}
        />
      </div>
    </div>
  )
})
