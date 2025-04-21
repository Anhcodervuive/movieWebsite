import {
    FETCH_DATA_FAILURE,
    FETCH_DATA_REQUEST,
    FETCH_DATA_SUCCESS,
    REMOVE_ALL_WATCHED_MOVIES,
} from '../contant';
import MovieService from '@/service/web/movie.service';

const fetchData = () => async (dispatch) => {
    dispatch({ type: FETCH_DATA_REQUEST }); // Thông báo bắt đầu fetch
    try {
        const data = await MovieService.getHistory();
        // console.log(data);

        dispatch({
            type: FETCH_DATA_SUCCESS,
            payload: data.watchedMovies, // Gửi dữ liệu đã fetch tới reducer
        });
    } catch (error) {
        console.log(error);

        dispatch({
            type: FETCH_DATA_FAILURE,
            payload: error.message, // Gửi lỗi nếu fetch thất bại
        });
    }
};

const removeAllWatchedMovies = () => ({
    type: REMOVE_ALL_WATCHED_MOVIES,
});

export { fetchData, removeAllWatchedMovies };
