import React from 'react';
import cx from 'classnames';
import PropTypes from 'prop-types';

/* constants */
import { PLACEMENTS, ICON_SIZES } from '../config.js';

const Icon = props => {
	const classes = {
		'material-icons': true
	};
	PLACEMENTS.forEach(p => {
		classes[p] = props[p];
	});
	ICON_SIZES.forEach(s => {
		classes[s] = props[s];
	});
	return <i className={cx(classes, props.className)}>{props.children}</i>;
};

Icon.propTypes = {
	/*
	 * Classname passed to i tag
	 */
	className: PropTypes.string,
	/*
	 * Icon type: <a href='https://material.io/icons/'>https://material.io/icons/</a>
	 */
	children: PropTypes.string.isRequired,
	/*
	 * Placement for icon if used beside a text ↓
	 */
	left: PropTypes.bool,
	center: PropTypes.bool,
	right: PropTypes.bool,
	/*
	 * Sizes for icons ↓
	 */
	tiny: PropTypes.bool,
	small: PropTypes.bool,
	medium: PropTypes.bool,
	large: PropTypes.bool
};

export default Icon;