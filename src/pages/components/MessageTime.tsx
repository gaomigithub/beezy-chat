/** @jsxImportSource @emotion/react */

import { css } from "@emotion/react";
import classNames from "classnames";
import dayjs from "dayjs";
import { memo, useCallback, useEffect, useMemo, useRef, useState } from "react";

export const MessageTime = memo(
  (props: { currentTime: number; prevTime?: number; className?: string }) => {
    const { currentTime, prevTime, className } = props;
    const [updateTime, setUpdateTime] = useState(Date.now());
    const timer = useRef<NodeJS.Timer | undefined>();

    const getTodayText = useCallback(
      (params: {
        toTodayDiffDayNumber: number;
        toTodayDiffHourNumber: number;
        toTodayDiffMinNumber: number;
        toTodayDiffSecondNumber: number;
        dateText: string;
      }) => {
        const {
          toTodayDiffSecondNumber,
          toTodayDiffMinNumber,
          toTodayDiffHourNumber,
          dateText,
        } = params;
        switch (true) {
          case toTodayDiffSecondNumber <= 60:
            return "刚刚";
          case toTodayDiffHourNumber < 1:
            return `${toTodayDiffMinNumber}分钟前`;
          default:
            return "今天".concat(dateText.slice(10));
        }
      },
      []
    );

    const option = useMemo(() => {
      const curDay = dayjs(currentTime);
      const prevDay = dayjs(prevTime);
      const nowDay = dayjs();
      const curDate = curDay.format("YYYY-MM-DD HH:mm");
      const prevDate = prevDay.format("YYYY-MM-DD HH:mm");
      const nowDate = nowDay.format("YYYY-MM-DD HH:mm");
      const options = {
        isSameHour: curDate.slice(0, 13) === prevDate.slice(0, 13),
        isSameYear: curDate.slice(0, 4) === nowDate.slice(0, 4),
        isSameDay: curDate.slice(0, 10) === prevDate.slice(0, 10),
        diffDay: curDay.diff(prevDay, "days"),
        diffhour: curDay.diff(prevDay, "hours"),
        diffMinutes: curDay.diff(prevDay, "minutes"),
        toTodayDiffDayNumber: nowDay.diff(curDate.slice(0, 10), "days"),
        toTodayDiffHourNumber: nowDay.diff(curDate.slice(0, 13), "hours"),
        toTodayDiffMinNumber: nowDay.diff(curDate.slice(0, 16), "minutes"),
        toTodayDiffSecondNumber: nowDay.diff(curDay, "seconds"),
        dateText: curDate,
      };
      return options;
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [currentTime, prevTime, updateTime]);

    const shoudMerge = useMemo(() => {
      if (!prevTime) {
        return false;
      }
      return (
        (option.isSameHour &&
          option.toTodayDiffDayNumber === 0 &&
          option.diffMinutes <= 2) ||
        option.toTodayDiffDayNumber >= 1
      );
    }, [
      option.diffMinutes,
      option.isSameHour,
      option.toTodayDiffDayNumber,
      prevTime,
    ]);

    const timeText = useMemo<string | null>(() => {
      switch (true) {
        //合并
        case shoudMerge:
          return null;
        //不同年
        case !option.isSameYear:
          return option.dateText.slice(10);
        //當天
        case option.toTodayDiffDayNumber === 0:
          return getTodayText(option);
        //昨天
        case option.toTodayDiffDayNumber === 1:
          return "昨天".concat(option.dateText.slice(10));
        //前天
        case option.toTodayDiffDayNumber === 2:
          return "前天".concat(option.dateText.slice(10));
        default:
          return option.dateText;
      }
    }, [getTodayText, option, shoudMerge]);

    const cleanTimer = useCallback(() => {
      if (timer.current) {
        clearInterval(timer.current);
      }
      timer.current = undefined;
    }, []);

    //todo 需要优化 之后使用worker
    useEffect(() => {
      if (!shoudMerge && option.toTodayDiffHourNumber < 1) {
        //需要去添加跟新
        timer.current = setInterval(() => {
          setUpdateTime(Date.now());
        }, 1000 * 50);
        return () => {
          cleanTimer();
        };
      }
      return cleanTimer;
    }, [cleanTimer, option.toTodayDiffHourNumber, shoudMerge]);

    useEffect(() => {
      if (option.toTodayDiffHourNumber >= 1 && timer.current) {
        cleanTimer();
      }
    }, [cleanTimer, option.toTodayDiffHourNumber]);

    return timeText ? (
      <div
        className={classNames("flex w-full flex-row justify-center", className)}
        css={css`
          font-size: 12px;
          color: #ccc;
        `}
      >
        {timeText}
      </div>
    ) : null;
  }
);
