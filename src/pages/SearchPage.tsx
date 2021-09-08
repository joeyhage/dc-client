import React, { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { RouteComponentProps } from 'react-router';
import { JobResult } from '../model';
import { NotificationType, NotificationLevel, SearchType, Query } from '../types';
import { searchForJobs } from '../util';
import { JobResultsTable, Loading, Notification } from '../components/common';
import { SearchBox } from '../components/search';

export const SearchPage: React.FC<RouteComponentProps> = ({ history }) => {
  const [isLoading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<NotificationType>({});

  const [search, setSearch] = useState<Query>({ query: '', searchType: SearchType.customer });
  const [searchResults, setSearchResults] = useState<JobResult[]>([]);

  useEffect(() => {
    function executeSearch() {
      setLoading(true);
      setError({});
      searchForJobs(search)
        .then((searchResults: JobResult[]) => {
          setSearchResults(searchResults);
          if (searchResults.length === 0) {
            setError({ level: NotificationLevel.Info, message: 'No results' });
          }
        })
        .catch((error) => {
          setError({
            level: NotificationLevel.Warning,
            message: <p>Error searching for jobs. Please try again.</p>,
            error
          });
        })
        .finally(() => setLoading(false));
    }

    if (search.query) {
      executeSearch();
    }
  }, [search]);

  return isLoading ? (
    <Loading />
  ) : (
    <div className='container is-fluid'>
      <Helmet>
        <title>Search Results | DC Database</title>
      </Helmet>
      <br />
      <br />
      <SearchBox search={{ ...search, doSearch: setSearch }} />
      <Notification notification={error} />
      <JobResultsTable jobResults={searchResults} push={history.push} />
    </div>
  );
};
