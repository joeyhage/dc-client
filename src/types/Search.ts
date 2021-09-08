import { Dispatch, SetStateAction } from 'react';

export enum SearchType {
  customer = 'customer',
  company = 'company',
  address = 'address'
}

export interface Query {
  query: string;
  searchType: SearchType;
}

export interface DoSearch {
  doSearch: Dispatch<SetStateAction<Query>>;
}

export type Search = Query & DoSearch;
