import React from 'react';
import PropTypes from 'prop-types';

/* style */
import cx from 'classnames';
import style from './slider.css';

/* constants */
import { PLACEMENTS } from '../../config.js';

const Caption = ({ className, placement, children, ...props }) => {
	return (
		<div
			className={cx(
				'caption',
				className,
				style.caption,
				`${placement}-align`,
			)}
			{...props}
		>
			{children}
		</div>
	);
};

Caption.propTypes = {
	children: PropTypes.node,
	className: PropTypes.string,
	/**
	 * Placement of the caption
	 * @default 'center'
	 */
	placement: PropTypes.oneOf(PLACEMENTS)
};

Caption.defaultProps = {
	placement: 'center'
};

export default Caption;