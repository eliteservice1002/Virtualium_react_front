import React, { useRef, useState, useEffect, Fragment } from 'react';
import { NavLink } from 'react-router-dom';

/* style */
import style from './navigation.css';

const NavItem = ({ item }) => {
	return(
		<Fragment>
			<li className={style.menuItem} >
				<NavLink to={item.url} >
					{item.title}
				</NavLink>
			</li>
		</Fragment>
	);
}
export default NavItem;