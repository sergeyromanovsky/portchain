import React from 'react';
import Loader from 'components/Loader';

import { useQuery } from 'react-query';
import { defaultQueryFn as handleFetch } from 'utils/fetch';
import { useSetRecoilState } from 'recoil';
import { portState } from 'atoms/port.atom';
import {
  IPortMetadata,
  IVessel,
  IVesselDetails,
} from 'pages/VesselList/interfaces';
import Stats from './Stats';
import {
  calculateArrivalsCount,
  calculatePercentile,
  calculatePortCallDuration,
  calculatePortCallsCount,
  getCallDelay,
} from 'utils';

function Home() {
  const setPortState = useSetRecoilState(portState);
  const { isLoading } = useQuery<IVessel[]>('vessels', {
    onSuccess: async (data) => {
      const promiseArr = data.map(({ imo }) => handleFetch(`schedule/${imo}`));
      const result: IVesselDetails[] = await Promise.all(promiseArr);
      if (result) {
        let totalPortCalls = 0;
        const portsMeta = result.reduce((acc, { portCalls }) => {
          totalPortCalls += portCalls.length;
          portCalls.forEach(({ port, arrival, departure, isOmitted }) => {
            const portId = port.id;
            acc[port.id] = {
              name: port.name,
              arrivalsCount: calculateArrivalsCount({
                acc,
                isOmitted,
                portId,
              }),
              portCallsCount: calculatePortCallsCount({ acc, portId }),
              callDuration: calculatePortCallDuration({
                acc,
                portId,
                arrival,
                departure,
              }),
            };
          });

          return acc;
        }, {} as Record<string, IPortMetadata>);

        const resultWithCallDelay = result.map(({ portCalls, vessel }) =>
          getCallDelay(portCalls, {
            delayInFourteenDays: 0,
            delayInSevenDays: 0,
            delayInTwoDays: 0,
            vessel,
          })
        );

        const portValues = Object.values(portsMeta);

        const topByArrivals = portValues
          .slice(0)
          .sort((a, b) => b.arrivalsCount - a.arrivalsCount)
          .slice(0, 5);

        const topByFewestPortCalls = portValues
          .slice(0)
          .sort((a, b) => a.portCallsCount - b.portCallsCount)
          .slice(0, 5);

        const ascSortedByCallDuration = portValues
          .slice(0)
          .sort((a, b) => a.callDuration - b.callDuration);

        const ascSortedByDelayInFourteenDays = resultWithCallDelay
          .slice(0)
          .sort((a, b) => a.delayInFourteenDays - b.delayInFourteenDays);

        const ascSortedByDelayInSevenDays = resultWithCallDelay
          .slice(0)
          .sort((a, b) => a.delayInSevenDays - b.delayInSevenDays);

        const ascSortedByDelayInTwoDays = resultWithCallDelay
          .slice(0)
          .sort((a, b) => a.delayInTwoDays - b.delayInTwoDays);

        setPortState({
          topByArrivals,
          topByFewestPortCalls,
          totalPortCalls,
          percentile: {
            byCallDuration: calculatePercentile(
              [5, 20, 50, 75, 90],
              ascSortedByCallDuration
            ),
            byDelayInFourteenDays: calculatePercentile(
              [5, 50, 80],
              ascSortedByDelayInFourteenDays
            ),
            byDelayInSevenDays: calculatePercentile(
              [5, 50, 80],
              ascSortedByDelayInSevenDays
            ),
            byDelayInTwoDays: calculatePercentile(
              [5, 50, 80],
              ascSortedByDelayInTwoDays
            ),
          },
        });
      } else {
        alert('Failed to fetch all vessel details');
      }
    },
  });

  if (isLoading) {
    return <Loader />;
  }

  return <Stats />;
}

export default Home;
