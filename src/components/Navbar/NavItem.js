import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';

const NavItem = ({ divider, ...props }) => {
	return(
		<li>
			<a {...props} />
		</li>
	)
};

NavItem.propTypes = {
	/**
	 * children can be a string value or a node
	 */
	children: PropTypes.oneOfType([PropTypes.string, PropTypes.node]),
	divider: PropTypes.bool,
	href: PropTypes.string,
	/**
	 * NavItem can have onClick. If it does have, href
	 * will not be rendered
	 */
	onClick: PropTypes.func
};

export default NavItem;