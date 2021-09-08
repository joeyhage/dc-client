import classNames from 'classnames';
import React, { useEffect, useState } from 'react';

type ThisProps = {
  heading: string;
  tabContents: JSX.Element[];
  id?: string;
  panelTabNames?: string[];
  style?: any;
};

export const Panel: React.FC<ThisProps> = ({ heading, id, panelTabNames, style, tabContents }) => {
  const [activeTab, setActiveTab] = useState<number>(0);
  const [tabNameList, setTabNameList] = useState<JSX.Element[]>([]);

  useEffect(() => {
    if (panelTabNames) {
      setTabNameList(
        panelTabNames?.map(
          (name, index): JSX.Element => (
            // eslint-disable-next-line jsx-a11y/anchor-is-valid
            <a
              key={index}
              className={classNames({ 'is-active': activeTab === index })}
              onClick={() => setActiveTab(index)}
            >
              {name}
            </a>
          )
        ) || []
      );
    }
  }, [activeTab, panelTabNames]);

  return (
    <article className='panel' id={id} style={style}>
      <p className='panel-heading has-text-white' style={{ backgroundColor: '#a51300' }}>
        {heading}
      </p>
      {tabNameList.length > 0 && <p className='panel-tabs'>{tabNameList}</p>}
      <div className='panel-block'>{tabContents[activeTab]}</div>
    </article>
  );
};
