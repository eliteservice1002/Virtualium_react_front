import React, { useRef, useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

/* style */
import cx from 'classnames';
import style from './navigation.css';

/* components */
import NavItem from './NavItem';
import NavGroup from './NavGroup';

const Navigation = ({ navContent, className }) => {
	const navItems = navContent.map((el) => {
		switch (el.type) {
			case 'item' :
				return <NavItem key={el.id} item={el} />;
			case 'group':
				return <NavGroup key={el.id} group={el}/>;
			default:
				return null;
		}
		return(
			<li key={key} >
				<Link to={el.url} > {el.title} </Link>
			</li>
		)
	})
	return(
		<div className={cx(className, style.mainContent)}>
			<ul>
				{navItems}
			</ul>
		</div>
	);
}
export default Navigation;