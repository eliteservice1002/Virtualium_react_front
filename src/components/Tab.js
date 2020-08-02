import React from 'react';
import PropTypes from 'prop-types';

// This is just a holder for the props and children for tab, thus
// there is no logic here.
const Tab = ({ children, idx, className }) => (
	<div id={`tab_${idx}`} className={className}>
		{children}
	</div>
);

Tab.propTypes = {
	idx: PropTypes.string,
	active: PropTypes.bool,
	children: PropTypes.node,
	disabled: PropTypes.bool,
	tabWidth: PropTypes.number,
	className: PropTypes.string,
	title: PropTypes.string.isRequired,
};

export default Tab;