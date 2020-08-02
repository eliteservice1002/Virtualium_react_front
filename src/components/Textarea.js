import React, { useEffect, useRef } from 'react';
import PropTypes from 'prop-types';

/* style */
import cx from 'classnames';

/* utils */
import idgen from '../utils/idgen';

/* constants */
import { SIZES } from '../config.js';

const Textarea = ({
	s,
	m,
	l,
	xl,
	id,
	icon,
	label,
	error,
	value,
	success,
	noLayout,
	onChange,
	validate,
	children,
	className,
	inputSolid,
	placeholder,
	defaultValue,
	iconClassName,
	...rest
}) => {
	const textareaRef = useRef(null);
	const dataLength = rest['data-length'];

	useEffect(() => {
		if (dataLength) {
			M.CharacterCounter.init(textareaRef.current);
		}
	}, [dataLength, children]);

	useEffect(() => {
		M.textareaAutoResize(textareaRef.current);
	}, [children]);

	const sizes = { s, m, l, xl };

	let responsiveClasses;
	if (!noLayout) {
		responsiveClasses = { col: true };
		SIZES.forEach(size => {
			responsiveClasses[size + sizes[size]] = sizes[size];
		});
	}

	return (
		<div className={cx('input-field', responsiveClasses)}>
			{Boolean(icon) && React.cloneElement(icon, { className: 'prefix' })}
			<textarea
				placeholder={placeholder}
				id={id}
				value={value}
				defaultValue={defaultValue}
				ref={textareaRef}
				onChange={onChange}
				{...rest}
				className={cx('materialize-textarea', { validate }, className, { inputSolid })}
			/>
			{Boolean(label) && (
				<label
					className={cx({
						active: value || placeholder,
						'label-icon': typeof label !== 'string'
					})}
					data-success={success}
					data-error={error}
					htmlFor={id}
				>
					{label}
				</label>
			)}
			{[error || success] && (
				<span
					className="helper-text"
					data-error={error}
					data-success={success}
				/>
			)}
			{children}
		</div>
	);
};

Textarea.propTypes = {
	children: PropTypes.node,
	/**
	 * Strip away all layout classes such as col and sX
	 */
	noLayout: PropTypes.bool,
	/**
	 * Responsive size for Mobile Devices
	 */
	s: PropTypes.number,
	/**
	 * Responsive size for Tablet Devices
	 */
	m: PropTypes.number,
	/**
	 * Responsive size for Desktop Devices
	 */
	l: PropTypes.number,
	/**
	 *  Responsive size for Large Desktop Devices
	 */
	xl: PropTypes.number,
	/**
	 * disabled input
	 */
	disabled: PropTypes.bool,
	/**
	 * Placeholder string
	 */
	placeholder: PropTypes.string,
	/**
	 * override id
	 * @default idgen()
	 */
	id: PropTypes.string,
	/**
	 * render icon next to input
	 */
	icon: PropTypes.node,
	/**
	 * icon classname
	 */
	iconClassName: PropTypes.string,
	/**
	 * textarea label
	 */
	label: PropTypes.string,
	/**
	 * Input initial value
	 */
	defaultValue: PropTypes.string,
	/**
	 * predefined value
	 */
	value: PropTypes.string,
	/**
	 * Add validate class to input
	 */
	validate: PropTypes.bool,
	/**
	 * Custom success message
	 */
	success: PropTypes.string,
	/**
	 * Custom error message
	 */
	error: PropTypes.string,
	/**
	 * textarea classname
	 */
	className: PropTypes.string,
	/**
	 * onChange callback
	 */
	onChange: PropTypes.func
};

Textarea.defaultProps = {
	id: `Textarea-${idgen()}`
};

export default Textarea;