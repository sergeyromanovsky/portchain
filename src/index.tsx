import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './pages';
import { BrowserRouter } from 'react-router-dom';
import { QueryCache, ReactQueryCacheProvider } from 'react-query';
import { RecoilRoot } from 'recoil';
import { defaultQueryFn } from './utils/fetch';

const queryCache = new QueryCache({
  defaultConfig: {
    queries: {
      queryFn: defaultQueryFn,
      staleTime: 1000 * 3600 * 24,
    },
  },
});

ReactDOM.render(
  <React.StrictMode>
    <BrowserRouter>
      <RecoilRoot>
        <ReactQueryCacheProvider queryCache={queryCache}>
          <App />
        </ReactQueryCacheProvider>
      </RecoilRoot>
    </BrowserRouter>
  </React.StrictMode>,
  document.getElementById('root')
);
