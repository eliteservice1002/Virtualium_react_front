import React, { useRef, useState, useEffect, Fragment } from 'react';

/* components */
import NavItem from './NavItem';

/* style */
import style from './navigation.css';

const NavGroup = ({ group }) => {
	var navItems = '';
	if (group.children) {
		navItems = group.children.map(item => {
			switch (item.type) {
				case 'item':
					return <NavItem key={item.id} item={item} />;
				default:
					return false;
			}
		});
	}
	return(
		<Fragment>
			<li key={group.id} className={style.menuCaption} ><label>{group.title}</label></li>
			{navItems}
		</Fragment>
	);
}
export default NavGroup;