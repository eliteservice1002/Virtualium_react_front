import React, { Children, useEffect, useRef, cloneElement, Fragment } from 'react';
import cx from 'classnames';
import idgen from '../utils/idgen';
import PropTypes from 'prop-types';

import Tab from './Tab';

const scope = `tabs-${idgen()}`;

const Tabs = ({ children, className, defaultValue, options, onChange }) => {
	const _tabsRef = useRef(null);

	useEffect(() => {
		const instance = M.Tabs.init(_tabsRef.current, options);
		return () => instance.destroy();
	}, [options]);

	return (
		<Fragment>
			<ul className={cx('tabs', className)} ref={_tabsRef}>
				{Children.map(children, (child, id) => {
					const idx = `${scope}${id}`;
					const { active, disabled, tabWidth, title } = child.props;

					const classes = {
						[`s${tabWidth}`]: tabWidth,
						tab: true,
						disabled,
						col: true
					};

					return (
						<li className={cx(classes)} key={idx}>
							<a
								href={`#tab_${idx}`}
								className={active || defaultValue === idx ? 'active' : ''}
								{...(disabled ? {} : { onClick: onChange })}
							>
								{title}
							</a>
						</li>
					);
				})}
			</ul>
			<div>
				{Children.map(children, (child, id) => {
					const idx = `${scope}${id}`;
					return cloneElement(child, { idx });
				})}
			</div>
		</Fragment>
	);
};

Tabs.propTypes = {
	onChange: PropTypes.func,
	className: PropTypes.string,
	defaultValue: PropTypes.string,
	children: PropTypes.node.isRequired,
	/**
	 * More info
	 * <a href='http://materializecss.com/tabs.html'>http://materializecss.com/tabs.html</a>
	 */
	options: PropTypes.shape({
		/**
		 * Transition duration in milliseconds.
		 * @default 300
		 */
		duration: PropTypes.number,
		/**
		 * Callback for when a new tab content is showns.
		 * @default null
		 */
		onShow: PropTypes.func,
		/**
		 * Set to true to enable swipeable tabs. This also uses the responsiveThreshold option.
		 * @default false
		 */
		swipeable: PropTypes.bool,
		/**
		 * The maximum width of the screen, in pixels, where the swipeable functionality initializes.
		 * @default Infinity
		 */
		responsiveThreshold: PropTypes.number
	})
};

Tab.defaultProps = {
	options: {
		duration: 300,
		onShow: null,
		swipeable: false,
		responsiveThreshold: Infinity
	}
};

export default Tabs;