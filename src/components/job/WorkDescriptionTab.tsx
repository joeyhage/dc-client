import React, { Fragment, useEffect, useState } from 'react';
import { WorkItem } from '../../model';

type ThisProps = {
  totalAmount: string;
  workItems: WorkItem[];
};

export const WorkDescriptionTab: React.FC<ThisProps> = ({ totalAmount, workItems }) => {
  const [workItemRows, setWorkItemRows] = useState<JSX.Element[]>();

  useEffect(() => {
    setWorkItemRows(workItems?.map(buildWorkItemRow) || []);
  }, [workItems]);

  return (
    <section id='work-description-tab' className='section content' style={{ paddingTop: '1.5rem' }}>
      {workItemRows}
      <div className='tile is-ancestor'>
        <div className='tile is-12 is-parent'>
          <div className='tile is-child is-10' />
          <div className='tile is-child'>
            <p className='has-text-weight-bold'>Total: {totalAmount}</p>
          </div>
        </div>
      </div>
    </section>
  );
};

const buildWorkItemRow = (
  { jobContractAmount, jobContractDescription, workDescriptionType }: WorkItem,
  key: number
) => (
  <Fragment key={key}>
    <div className='tile is-ancestor'>
      <div className='tile is-12 is-parent'>
        <div className='tile is-child is-2'>
          <p className='has-text-weight-bold'>{workDescriptionType}</p>
        </div>
        <div className='tile is-child'>
          <p>{jobContractDescription}</p>
        </div>
        <div className='tile is-child is-2'>
          <p>${jobContractAmount}</p>
        </div>
      </div>
    </div>
    <hr />
  </Fragment>
);
