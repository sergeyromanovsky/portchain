import React, { useMemo } from 'react';
import Loader from 'components/Loader';

import { useQuery } from 'react-query';
import { ColDef, DataGrid } from '@material-ui/data-grid';
import { Link } from '@material-ui/core';
import { useHistory } from 'react-router-dom';
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
  const { data, isLoading } = useQuery<IVessel[]>('vessels', {
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

  const { push } = useHistory();

  const updData = useMemo(
    () => data?.map((vessel) => ({ ...vessel, id: vessel.imo })),
    [data]
  );

  const columns: ColDef[] = useMemo(
    () => [
      {
        field: 'imo',
        headerName: 'IMO',
        renderCell: ({ data }) => (
          <Link
            href='#'
            onClick={(e: React.MouseEvent<HTMLAnchorElement, MouseEvent>) => {
              e.preventDefault();
              push(`/${data.id}`);
            }}
          >
            {data.id}
          </Link>
        ),
      },
      { field: 'name', headerName: 'Vessel Name', width: 400 },
    ],
    []
  );

  if (isLoading) {
    return <Loader />;
  }

  if (!updData) {
    return <span>Something went wrong</span>;
  }

  return (
    <>
      <div style={{ height: '75%', width: '100%', overflowY: 'auto' }}>
        <DataGrid
          rows={updData}
          columns={columns}
          autoPageSize
          autoHeight
          disableSelectionOnClick
          hideFooter
        />
      </div>
      <Stats />
    </>
  );
}

export default Home;
