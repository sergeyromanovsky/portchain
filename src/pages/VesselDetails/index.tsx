import React from 'react';
import { useQuery } from 'react-query';
import { useParams } from 'react-router-dom';
import { IVesselDetails } from './interfaces';

function VesselDetails() {
  const { id } = useParams<{ id: string }>();

  const { data, isLoading } = useQuery<IVesselDetails>(`schedule/${id}`);
  console.log('data', data);

  return <div>{id}</div>;
}

export default VesselDetails;
