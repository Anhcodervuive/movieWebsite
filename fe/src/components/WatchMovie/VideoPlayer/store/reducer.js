import { Contant } from './index';

const initState = {
    eps: null,
    adsUrls: [],
    adsIsPlaying: false,
    videoRef: null,
    fakeVideoRef: null,
    wrapperRef: null,
    movie: '',
    playing: true,
    isLoading: true,
    isFullScreen: false,
    volumn: 0.5,
    language: null,
    currentTime: 0,
    duration: 0,
    isDragging: false,
    thumbnail: null,
    hoverTime: 0,
    isForward: false,
    isBackward: false,
    hoverPos: { left: 0, top: 0, show: false },
};

function reducer(state, action) {
    switch (action.type) {
        case Contant.SET_EPS:
            return {
                ...state,
                eps: action.payload,
            };
        case Contant.SET_WRAPPER_REF:
            return {
                ...state,
                wrapperRef: action.payload,
            };
        case Contant.SET_VIDEO_REF:
            return {
                ...state,
                videoRef: action.payload,
            };
        case Contant.SET_FAKE_VIDEO_REF:
            return {
                ...state,
                fakeVideoRef: action.payload,
            };
        case Contant.SET_MOVIE:
            return {
                ...state,
                movie: action.payload,
            };
        case Contant.SET_ISLOADING:
            return {
                ...state,
                isLoading: action.payload,
            };
        case Contant.SET_PLAYING:
            return { ...state, playing: action.payload };
        case Contant.SET_LANGUAGE:
            return {
                ...state,
                language: action.payload,
            };
        case Contant.SET_CURRENT_TIME:
            return {
                ...state,
                currentTime: action.payload,
            };
        case Contant.SET_DURATION:
            return {
                ...state,
                duration: action.payload,
            };
        case Contant.SET_HOVER_TIME:
            return {
                ...state,
                hoverTime: action.payload,
            };
        case Contant.SET_HOVER_POS:
            return {
                ...state,
                hoverPos: action.payload,
            };
        case Contant.SET_DRAGGING:
            return {
                ...state,
                isDragging: action.payload,
            };
        case Contant.SET_THUMBNAIL:
            return {
                ...state,
                thumbnail: action.payload,
            };
        case Contant.ADJUST_VOLUME:
            return {
                ...state,
                volumn: action.payload,
            };
        case Contant.TOGGLE_FULLSCREEN:
            return {
                ...state,
                isFullScreen: !state.isFullScreen,
            };
        case Contant.SET_ADVERTISE_URLS:
            return {
                ...state,
                adsUrls: action.payload,
            };
        case Contant.SET_IS_ADVERTISE_PLAYING:
            return {
                ...state,
                adsIsPlaying: action.payload,
            };
        case Contant.SET_IS_BACKWARD:
            return {
                ...state,
                isBackward: action.payload,
            };
        case Contant.SET_IS_FORWARD:
            return {
                ...state,
                isForward: action.payload,
            };
        default:
            throw new Error('Invalid action type: ' + action.type);
    }
}

export { initState };
export default reducer;
