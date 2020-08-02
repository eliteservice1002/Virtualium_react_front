import React, {
	useState,
	useEffect
} from 'react';
import { useLocation } from 'react-router-dom';

/* style */
import cx from 'classnames';
import style from './redesSociales.css';

/* CustomHooks */
import { useWindowSize } from '../../customHooks';

const RedesSociales = ({ scrollActive }) => {
	return(
		<div
			className={cx(
				style.contentRedesSociales,
				{ [`${style.scrollActive}`]: scrollActive },
			)}
		>
			<a
				target='_blank'
				href='https://twitter.com/Virtualiumshow1'
			>
				<img src='/img/icons/icon-twitter.svg' alt="Twitter"/>
			</a>

			<a
				target='_blank'
				href='https://www.facebook.com/virtualiumshowslive.virtualiumshowslive'
			>
				<img src='/img/icons/icon-facebook.svg' alt="Facebook"/>
			</a>

			<a
				target='_blank'
				href='https://www.instagram.com/virtualiumshowslive/'
			>
				<img src='/img/icons/icon-instagram.svg' alt="Instagram"/>
			</a>
		</div>
	)
}

export default RedesSociales;