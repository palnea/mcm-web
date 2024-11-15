// useApi.js
import { useState, useEffect } from 'react';
import axiosInstance from './axiosInstance';
import * as https from "https";
const useApi = (url, options = {}) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  useEffect(() => {
    const fetchData = async () => {
      // At request level
      const agent = new https.Agent({
        rejectUnauthorized: false
      });
      try {
        const response = await axiosInstance.get(url, { httpsAgent: agent });
        setData(response.data);
      } catch (err) {
        setError(err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [url, options]);
  return { data, loading, error };
};
export default useApi;
