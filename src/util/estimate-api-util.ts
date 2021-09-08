import { Customer, Job, JobResult } from '../model';
import { Query } from '../types';
import { oAuthFetch } from './auth-util';

const ESTIMATES_API = '/api/estimate';

export const searchForJobs = ({ query, searchType }: Query): Promise<JobResult[]> => {
  return new Promise<JobResult[]>(async (resolve, reject) => {
    oAuthFetch(`${ESTIMATES_API}/search?query=${query}&searchType=${searchType}`)
      .then((results) => resolve((results || []).map((searchResult: any) => new JobResult(searchResult))))
      .catch(reject);
  });
};

export const getRecentEstimates = (): Promise<JobResult[]> => {
  return new Promise<JobResult[]>(async (resolve, reject) => {
    oAuthFetch(`${ESTIMATES_API}/recent-estimates`)
      .then((results) => resolve((results || []).map((searchResult: any) => new JobResult(searchResult))))
      .catch(reject);
  });
};

export const getRecentlyReceived = (): Promise<JobResult[]> => {
  return new Promise<JobResult[]>(async (resolve, reject) => {
    oAuthFetch(`${ESTIMATES_API}/recently-received`)
      .then((results) => resolve((results || []).map((searchResult: any) => new JobResult(searchResult))))
      .catch(reject);
  });
};

export const getActiveContracts = (): Promise<JobResult[]> => {
  return new Promise<JobResult[]>(async (resolve, reject) => {
    oAuthFetch(`${ESTIMATES_API}/active-contracts`)
      .then((results) => resolve((results || []).map((searchResult: any) => new JobResult(searchResult))))
      .catch(reject);
  });
};

export const retrieveCustomerByID = (customerID: number): Promise<Customer> => {
  return new Promise<Customer>(async (resolve, reject) => {
    oAuthFetch(`${ESTIMATES_API}/customer/${customerID}`)
      .then((customerData: any) => resolve(new Customer(customerData || {})))
      .catch(reject);
  });
};

export const retrieveJobByID = (jobID: number): Promise<Job> => {
  return new Promise<Job>(async (resolve, reject) => {
    oAuthFetch(`${ESTIMATES_API}/job/${jobID}`)
      .then((jobData: any) => resolve(new Job(jobData || {})))
      .catch(reject);
  });
};
