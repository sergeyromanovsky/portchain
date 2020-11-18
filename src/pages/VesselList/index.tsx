import React, { useState } from 'react';
import Loader from 'components/Loader';
import TopList from './TopList';
import PercentileList from './PercentileList';

import { useQuery } from 'react-query';
import { defaultQueryFn as handleFetch } from 'utils/fetch';
import {
  IPortMetadata,
  IVessel,
  IVesselDetails,
} from 'pages/VesselList/interfaces';
import {
  getCallDelay,
  getPortMeta,
  sort,
  calculatePercentile,
  IDaysDelay,
} from 'utils';
import { CALCULATE_FOR_DAYS } from 'utils/constants';

export type ITop = {
  title: string;
  value: IPortMetadata[];
  total?: number;
};

export type ICallDelayPercentile = Record<IDaysDelay | 'vessel', any>;

export type IPercantile = ICallDelayPercentile | IPortMetadata;

export type IPercantileList = {
  title: string;
  value: [number[], IPercantile[]];
}[];

function Home() {
  const [topList, setTopList] = useState<ITop[] | null>(null);
  const [percentileList, setPercentileList] = useState<IPercantileList | null>(
    null
  );
  useQuery<IVessel[]>('vessels', {
    onSuccess: async (data) => {
      const promiseArr = data.map(({ imo }) => handleFetch(`schedule/${imo}`));
      const result: IVesselDetails[] = await Promise.all(promiseArr);
      if (result) {
        const { totalCalls, portsMeta } = getPortMeta(result);

        const resultWithCallDelay = result.map(({ portCalls, ...rest }) => ({
          ...getCallDelay(portCalls, CALCULATE_FOR_DAYS),
          ...rest,
        }));

        const portValues = Object.values(portsMeta);

        const topList = [
          {
            title: 'Top 5 By Arrivals',
            value: sort({
              arr: portValues,
              modifier: (arr) => arr.slice(0, 5),
              sortExtractor: ({ arrivalsCount }) => arrivalsCount,
              order: 'desc',
            }),
          },
          {
            title: 'Top 5 By Fewest Port Calls',
            value: sort({
              arr: portValues,
              modifier: (arr) => arr.slice(0, 5),
              sortExtractor: ({ portCallsCount }) => portCallsCount,
            }),
            total: totalCalls,
          },
        ];

        const sortedByCallDuration = sort({
          arr: portValues,
          sortExtractor: ({ callDuration }) => callDuration,
        });

        const sortByDelayIn14Days = sort({
          arr: resultWithCallDelay,
          sortExtractor: (item) => item[14],
        });

        const sortByDelayIn7Days = sort({
          arr: resultWithCallDelay,
          sortExtractor: (item) => item[7],
        });

        const sortByDelayIn2Days = sort({
          arr: resultWithCallDelay,
          sortExtractor: (item) => item[2],
        });

        const percentileList = [
          {
            title: 'Percentile by Call Duration',
            value: calculatePercentile(
              [5, 20, 50, 75, 90],
              sortedByCallDuration
            ),
          },
          {
            title: 'Percentile by Port Call Delay in 14 Days',
            value: calculatePercentile([5, 50, 80], sortByDelayIn14Days),
          },
          {
            title: 'Percentile by Port Call Delay in 7 Days',
            value: calculatePercentile([5, 50, 80], sortByDelayIn7Days),
          },
          {
            title: 'Percentile by Port Call Delay in 2 Days',
            value: calculatePercentile([5, 50, 80], sortByDelayIn2Days),
          },
        ];

        setTopList(topList);
        setPercentileList(percentileList);
      } else {
        alert('Failed to fetch all vessel details');
      }
    },
  });

  if (!topList || !percentileList) {
    return <Loader />;
  }

  return (
    <>
      <TopList list={topList!} />
      <PercentileList list={percentileList!} />
    </>
  );
}

export default Home;
