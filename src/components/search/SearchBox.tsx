import React, { ChangeEvent, FormEvent, useEffect, useState } from 'react';
import { Search, SearchType } from '../../types';

type ThisProps = { search: Search };

export const SearchBox: React.FC<ThisProps> = ({ search }) => {
  const [query, setQuery] = useState<string>(search.query);
  const [searchType, setSearchType] = useState<SearchType>(search.searchType);
  const [placeholder, setPlaceholder] = useState<string>('');

  useEffect(() => {
    if (searchType === SearchType.customer) {
      setPlaceholder('last name');
    } else if (searchType === SearchType.company) {
      setPlaceholder('company name');
    } else if (searchType === SearchType.address) {
      setPlaceholder('address');
    }
  }, [searchType]);

  const updateQuery = ({ target }: ChangeEvent<HTMLInputElement>) => setQuery(target.value);
  const updateSearchType = ({ target }: ChangeEvent<HTMLSelectElement>) => setSearchType(target.value as SearchType);
  const performSearch = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    search.doSearch({ query, searchType });
  };

  return (
    <div className='columns'>
      <div className='column is-half-desktop is-offset-1-desktop'>
        <form onSubmit={performSearch}>
          <div className='field has-addons'>
            <p className='control'>
              <span className='select'>
                <select value={searchType} onChange={updateSearchType}>
                  <option value={SearchType.customer}>Customer</option>
                  <option value={SearchType.company}>Company</option>
                  <option value={SearchType.address}>Address</option>
                </select>
              </span>
            </p>
            <p className='control is-expanded'>
              <input className='input' type='text' value={query} placeholder={placeholder} onChange={updateQuery} />
            </p>
            <p className='control'>
              <button className='button is-info' type='submit' disabled={query === ''}>
                Search
              </button>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
};
