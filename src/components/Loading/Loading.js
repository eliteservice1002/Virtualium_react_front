import React from 'react';

/* Components */
import Preloader from '../Preloader';

/* Style */
import style from './loading.css';

const Loading = () => {
	return(
		<div className={style.loading} >
			<Preloader
				active
				color="blue"
				size="big"
			/>
		</div>
	)
}

export default Loading;