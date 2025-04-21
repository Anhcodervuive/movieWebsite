import { StoreProvider } from './store';
import MainComponent from './MainComponent';
import { memo } from 'react';

function VideoPlayer({ eps, ads }) {
    return (
        <StoreProvider>
            <MainComponent eps={eps} ads={ads} />
        </StoreProvider>
    );
}

export default memo(VideoPlayer);
