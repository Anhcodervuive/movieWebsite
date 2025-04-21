import React from 'react';
import ReactDOM from 'react-dom/client';
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import { persistor, store } from '@/core/store';
import App from '@/App';
import reportWebVitals from './reportWebVitals';
import GlobalStyle from './components/UI/GlobalStyle';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
    <GlobalStyle>
        <Provider store={store}>
            <PersistGate loading={null} persistor={persistor}>
                <App />
            </PersistGate>
        </Provider>
    </GlobalStyle>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
