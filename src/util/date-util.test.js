import * as dateUtil from './date-util';

test('toUTC', () => {
  // given
  const date = new Date(1616284800018);

  // when
  const utcDate = dateUtil.toUTC(date);

  // then
  expect(utcDate.getTime()).toEqual(1616302800018);
});

test('toDayMonth', () => {
  // given
  const date = new Date(1616284800018);

  // when
  const dayMonth = dateUtil.toDayMonth(date);

  // then
  expect(dayMonth).toEqual('Mar 20');
});

test('toLocaleDateString', () => {
  // given
  const date = new Date(1616284800018);

  // when
  const localeDate = dateUtil.toLocaleDateString(date);

  // then
  expect(localeDate).toEqual('03/20/2021');
});
