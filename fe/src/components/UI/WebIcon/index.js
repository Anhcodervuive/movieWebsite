import { memo } from 'react';
import { PiMonitorPlayFill } from 'react-icons/pi';
import Button from '../Button';

function WebIcon() {
    return (
        <Button text>
            <PiMonitorPlayFill />
        </Button>
    );
}

export default memo(WebIcon);
