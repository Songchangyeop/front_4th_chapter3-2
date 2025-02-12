import {
  Checkbox,
  FormControl,
  FormLabel,
  Heading,
  HStack,
  Input,
  Select,
  Tooltip,
  VStack,
} from '@chakra-ui/react';
import { useMemo } from 'react';

import { Event, RepeatIntervalType, RepeatType } from '../types';
import { EventSubmitButton } from './EventSubmitButton';
import { useEventFormStore } from '../store/eventFormStore';
import { getTimeErrorMessage } from '../utils/timeValidation';

const CATEGORIES = ['업무', '개인', '가족', '기타'];

const getLastDayOfMonth = (year: number, month: number): number => {
  return new Date(year, month, 0).getDate();
};

const getNthWeekdayOfMonth = (date: Date): number => {
  const day = date.getDate();
  return Math.ceil(day / 7);
};

const NOTIFICATION_OPTIONS = [
  { value: 1, label: '1분 전' },
  { value: 10, label: '10분 전' },
  { value: 60, label: '1시간 전' },
  { value: 120, label: '2시간 전' },
  { value: 1440, label: '1일 전' },
];

interface EventFormProps {
  toggleDialog: () => void;
  addOverlappingEvents: (events: Event[]) => void;
}

export const EventForm = ({ toggleDialog, addOverlappingEvents }: EventFormProps) => {
  const {
    title,
    setTitle,
    date,
    setDate,
    startTimeError,
    startTime,
    endTime,
    editingEvent,
    endTimeError,
    handleEndTimeChange,
    handleStartTimeChange,
    description,
    setDescription,
    location,
    setLocation,
    category,
    setCategory,
    isRepeating,
    setIsRepeating,
    notificationTime,
    setNotificationTime,
    repeatType,
    setRepeatType,
    repeatInterval,
    setRepeatInterval,
    repeatEndDate,
    setRepeatEndDate,
  } = useEventFormStore();

  const repeatOptions = useMemo(() => {
    if (!date || repeatType === 'daily' || repeatType === 'weekly') return [];

    const selectedDate = new Date(date);
    const day = selectedDate.getDate();
    const month = selectedDate.getMonth() + 1;
    const year = selectedDate.getFullYear();
    const weekday = selectedDate.getDay();
    const nthWeekday = getNthWeekdayOfMonth(selectedDate);
    const lastDay = getLastDayOfMonth(year, month);
    const monthLabel = `${month}월`;
    const weekdayLabel = ['일', '월', '화', '수', '목', '금', '토'][weekday];

    if (repeatType === 'monthly') {
      return day === lastDay
        ? [
            { label: `${monthLabel}의 마지막 날`, value: 'same_month_last_day' },
            { label: `${monthLabel} ${day}일`, value: `same_date` },
            {
              label: `${monthLabel} ${nthWeekday}번째 ${weekdayLabel}요일`,
              value: `same_month_nth_weekday`,
            },
          ]
        : [
            { label: `${monthLabel} ${day}일`, value: `same_date` },
            {
              label: `${monthLabel} ${nthWeekday}번째 ${weekdayLabel}요일`,
              value: `same_month_nth_weekday`,
            },
          ];
    }

    if (repeatType === 'yearly') {
      return day === lastDay
        ? [
            { label: `${monthLabel}의 마지막 날`, value: 'same_month_last_day' },
            { label: `${monthLabel} ${day}일`, value: `same_date` },
            {
              label: `${monthLabel} ${nthWeekday}번째 ${weekdayLabel}요일`,
              value: `same_month_nth_weekday`,
            },
          ]
        : [
            { label: `${monthLabel} ${day}일`, value: `same_date` },
            {
              label: `${monthLabel} ${nthWeekday}번째 ${weekdayLabel}요일`,
              value: `same_month_nth_weekday`,
            },
          ];
    }

    return [];
  }, [date, repeatType]);

  return (
    <VStack w="400px" spacing={5} align="stretch">
      <Heading>{editingEvent ? '일정 수정' : '일정 추가'}</Heading>

      <FormControl>
        <FormLabel>제목</FormLabel>
        <Input value={title} onChange={(e) => setTitle(e.target.value)} />
      </FormControl>

      <FormControl>
        <FormLabel>날짜</FormLabel>
        <Input type="date" value={date} onChange={(e) => setDate(e.target.value)} />
      </FormControl>

      <HStack width="100%">
        <FormControl>
          <FormLabel>시작 시간</FormLabel>
          <Tooltip label={startTimeError} isOpen={!!startTimeError} placement="top">
            <Input
              type="time"
              value={startTime}
              onChange={handleStartTimeChange}
              onBlur={() => getTimeErrorMessage(startTime, endTime)}
              isInvalid={!!startTimeError}
            />
          </Tooltip>
        </FormControl>
        <FormControl>
          <FormLabel>종료 시간</FormLabel>
          <Tooltip label={endTimeError} isOpen={!!endTimeError} placement="top">
            <Input
              type="time"
              value={endTime}
              onChange={handleEndTimeChange}
              onBlur={() => getTimeErrorMessage(startTime, endTime)}
              isInvalid={!!endTimeError}
            />
          </Tooltip>
        </FormControl>
      </HStack>

      <FormControl>
        <FormLabel>설명</FormLabel>
        <Input value={description} onChange={(e) => setDescription(e.target.value)} />
      </FormControl>

      <FormControl>
        <FormLabel>위치</FormLabel>
        <Input value={location} onChange={(e) => setLocation(e.target.value)} />
      </FormControl>

      <FormControl>
        <FormLabel>카테고리</FormLabel>
        <Select value={category} onChange={(e) => setCategory(e.target.value)}>
          <option value="">카테고리 선택</option>
          {CATEGORIES.map((cat) => (
            <option key={cat} value={cat}>
              {cat}
            </option>
          ))}
        </Select>
      </FormControl>

      <FormControl>
        <FormLabel>반복 설정</FormLabel>
        <Checkbox isChecked={isRepeating} onChange={(e) => setIsRepeating(e.target.checked)}>
          반복 일정
        </Checkbox>
      </FormControl>

      <FormControl>
        <FormLabel>알림 설정</FormLabel>
        <Select
          value={notificationTime}
          onChange={(e) => setNotificationTime(Number(e.target.value))}
        >
          {NOTIFICATION_OPTIONS.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </Select>
      </FormControl>

      {isRepeating && (
        <VStack width="100%">
          <FormControl>
            <FormLabel>반복 유형</FormLabel>
            <Select
              value={repeatType}
              onChange={(e) => setRepeatType(e.target.value as RepeatType)}
            >
              <option value="daily">매일</option>
              <option value="weekly">매주</option>
              <option value="monthly">매월</option>
              <option value="yearly">매년</option>
            </Select>
          </FormControl>
          <HStack width="100%">
            {repeatOptions.length > 0 && (
              <FormControl>
                <FormLabel>반복 간격</FormLabel>
                <Select
                  value={repeatInterval}
                  onChange={(e) => setRepeatInterval(e.target.value as RepeatIntervalType)}
                >
                  {repeatOptions.map((option, index) => (
                    <option key={index} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </Select>
              </FormControl>
            )}
            <FormControl>
              <FormLabel>반복 종료일</FormLabel>
              <Input
                type="date"
                value={repeatEndDate}
                onChange={(e) => setRepeatEndDate(e.target.value)}
              />
            </FormControl>
          </HStack>
        </VStack>
      )}

      <EventSubmitButton toggleDialog={toggleDialog} addOverlappingEvents={addOverlappingEvents} />
    </VStack>
  );
};

// 반복 유형을 선택하면 그에 따르는 반복 간격의 옵션이 변경된다
// 매일, 매주는 반복 간격이 없다
// 매월은 28일, 4번쨰 금요일, 월의 마지막 날 3개
// 매년은 2월 28일, 2월 4번째 금요일, 2월 마지막날 3개
// 만약 월의 마지막날이 아니라면 ?
// 매월은 20일, 3번쨰 목요일
// 2월 20일, 2월 3번째 목요일
