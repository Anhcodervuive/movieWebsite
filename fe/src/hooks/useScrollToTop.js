import { useEffect, useState } from 'react';

function useScrollToTop() {
    const [isAtTop, setIsAtTop] = useState(true);

    const handleScroll = () => {
        const scrollTop = window.scrollY;
        setIsAtTop(scrollTop === 0);
    };

    const scrollToTop = () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    useEffect(() => {
        window.addEventListener('scroll', handleScroll);
        return () => {
            window.removeEventListener('scroll', handleScroll);
        };
    }, []);

    return [isAtTop, scrollToTop];
}

export default useScrollToTop;
