import { calculateCallDuration, calculateArrivalsCount } from 'utils';

it('calculateCallDuration should return the difference between arrival and departure', () => {
  const diff = calculateCallDuration({
    arrival: '2020-11-16',
    departure: '2020-11-17',
  });
  const oneDayTimestamp = 1000 * 3600 * 24;
  expect(oneDayTimestamp).toEqual(diff);
});

it('calculateArrivalsCount should increment if isOmitted = false', () => {
  const portId = 'acc';
  const count = 5;
  const acc = {
    [portId]: {
      arrivalsCount: count,
    },
  };
  let result = calculateArrivalsCount({ acc, isOmitted: false, portId });
  expect(result).toEqual(count + 1);

  result = calculateArrivalsCount({ acc, isOmitted: true, portId });
  expect(result).toEqual(count);
});
