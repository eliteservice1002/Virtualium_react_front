import React from 'react';

/* style */
import style from './slider.css';

const Progressbar = ({ width }) => {
	return(
		<div
			className={style.progressbar}
			style={{ width: `${width}px`}}
		></div>
	)
};

export default Progressbar;