import combineReducers from './combineReducers';
import login from './login';
import evento from './evento';

const reducer = combineReducers({
	login,
	evento,
});

export default reducer;