import { Contant } from '.';

export const setEps = (payload) => ({
    type: Contant.SET_EPS,
    payload,
});

export const setWrapperRef = (payload) => ({
    type: Contant.SET_WRAPPER_REF,
    payload,
});

export const setVideoRef = (payload) => ({
    type: Contant.SET_VIDEO_REF,
    payload,
});

export const setFakeVideoRef = (payload) => ({
    type: Contant.SET_FAKE_VIDEO_REF,
    payload,
});

export const setMovie = (payload) => ({
    type: Contant.SET_MOVIE,
    payload,
});

export const setLoading = (payload) => ({
    type: Contant.SET_ISLOADING,
    payload,
});

export const setPlaying = (payload) => ({
    type: Contant.SET_PLAYING,
    payload,
});

export const setLanguage = (payload) => ({
    type: Contant.SET_LANGUAGE,
    payload,
});

export const setCurrentTime = (payload) => ({
    type: Contant.SET_CURRENT_TIME,
    payload,
});

export const setDurration = (payload) => ({
    type: Contant.SET_DURATION,
    payload,
});

export const setIsDragging = (payload) => ({
    type: Contant.SET_DRAGGING,
    payload,
});

export const setHoverTime = (payload) => ({
    type: Contant.SET_HOVER_TIME,
    payload,
});

export const setHoverPos = (payload) => ({
    type: Contant.SET_HOVER_POS,
    payload,
});

export const setThumbnail = (payload) => ({
    type: Contant.SET_THUMBNAIL,
    payload,
});

export const adjustVolumn = (payload) => ({
    type: Contant.ADJUST_VOLUME,
    payload,
});

export const toggleFullscreen = (payload) => ({
    type: Contant.TOGGLE_FULLSCREEN,
});

export const setAdvertiseUrl = (payload) => ({
    type: Contant.SET_ADVERTISE_URLS,
    payload,
});

export const setIsAdvertisePlaying = (payload) => ({
    type: Contant.SET_IS_ADVERTISE_PLAYING,
    payload,
});

export const setIsForward = (payload) => ({
    type: Contant.SET_IS_FORWARD,
    payload,
});

export const setIsBackward = (payload) => ({
    type: Contant.SET_IS_BACKWARD,
    payload,
});
