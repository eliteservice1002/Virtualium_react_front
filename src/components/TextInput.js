import React, { useState, useEffect, useRef, cloneElement } from 'react';
import cx from 'classnames';
import PropTypes from 'prop-types';
import idgen from '../utils/idgen';

/* constants */
import { SIZES } from '../config.js';

const TextInput = React.forwardRef(({
	s,
	m,
	l,
	xl,
	id,
	icon,
	type,
	value,
	label,
	error,
	email,
	success,
	password,
	children,
	disabled,
	validate,
	noLayout,
	inputSolid,
	placeholder,
	defaultValue,
	globalClasses,
	inputClassName,
	...other
}, ref ) => {
	const _inputRef = useRef(null);
	const [ classes, setClasses ] = useState('');

	useEffect(() => {
		if (typeof M !== undefined) {
			other['data-length'] && M.CharacterCounter.init(_inputRef.current);
		}
	}, [])
	
	useEffect(() => {
		const sizes = { s, m, l, xl };
		let responsiveClasses;
		if (!noLayout) {
			responsiveClasses = { col: true };
			SIZES.forEach(size => {
				responsiveClasses[size + sizes[size]] = sizes[size];
			});
		}
		setClasses(cx('input-field', responsiveClasses, globalClasses));
	}, [ s, m, l, xl, noLayout, globalClasses ])

	const inputProps = {
		type,
		value,
		disabled,
		...other,
		placeholder,
		defaultValue,
		id: id || `textinput-${idgen()}`,
	};

	const renderLabel = () =>
		label && (
			<label
				data-error={error}
				data-success={success}
				ref={(el) => {
					if(ref) ref.current = {
						...ref.current,
						_labelRef: el
					};
				}}
				htmlFor={inputProps.id}
				className={cx({
					active: value || placeholder,
					'label-icon': typeof label !== 'string'
				})}
			>
				{label}
			</label>
		);

	const renderHelper = () =>
		(error || success) && (
			<span
				className="helper-text"
				data-error={error}
				data-success={success}
			/>
		);

	const renderIcon = () => {
		if (!icon) return;

		if (typeof icon === 'string') {
			return <i className="material-icons prefix">{icon}</i>;
		}

		return cloneElement(icon, { className: 'prefix' });
	};

	return (type === 'file') ? (
		<div className={`${classes} file-field`}>
			<div className="btn">
				<span>{label}</span>
				<input
					type="file"
					ref={(el) => {
						if(ref) ref.current = {
							...ref.current,
							_inputRef: el
						};
						return (_inputRef.current = el);
					}}
					className={cx({ validate }, inputClassName, { inputSolid })}
					{...inputProps}
				/>
			</div>
			<div className="file-path-wrapper">
				<input
					ref={(el) => {
						if(ref) ref.current = {
							...ref.current,
							_filePathRef: el
						}
					}}
					className="file-path validate"
					type={type}
				/>
			</div>
			{renderHelper()}
			{children}
		</div>
	) : (
		<div className={classes}>
			{renderIcon()}
			<input
				ref={(el) => {
					if(ref) ref.current = {
						...ref.current,
						_inputRef: el
					};
					return (_inputRef.current = el);
				}}
				// ref={(el) => (ref.current = _inputRef.current = el)}
				className={cx({ validate }, inputClassName, { inputSolid })}
				{...inputProps}
			/>
			{renderLabel()}
			{renderHelper()}
			{children}
		</div>
	);
})

TextInput.propTypes = {
	children: PropTypes.node,
	/*
	 * Strip away all layout classes such as col and sX
	 */
	noLayout: PropTypes.bool,
	/*
	 * Responsive size for Mobile Devices
	 */
	s: PropTypes.number,
	/*
	 * Responsive size for Tablet Devices
	 */
	m: PropTypes.number,
	/*
	 * Responsive size for Desktop Devices
	 */
	l: PropTypes.number,
	/**
	 *  Responsive size for Large Desktop Devices
	 */
	xl: PropTypes.number,
	/*
	 * disabled input
	 */
	disabled: PropTypes.bool,
	/*
	 * Placeholder string
	 */
	placeholder: PropTypes.string,
	/*
	 * override id
	 * @default idgen()
	 */
	id: PropTypes.string,
	/*
	 * prefix icon, name of the icon or a node
	 */
	icon: PropTypes.node,
	/*
	 * label text
	 */
	label: PropTypes.oneOfType([PropTypes.string, PropTypes.node]),
	/*
	 * Input initial value
	 */
	defaultValue: PropTypes.string,
	/*
	 * Input value
	 */
	value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
	/*
	 * Add validate class to input
	 */
	validate: PropTypes.bool,
	/*
	 * Custom success message
	 */
	success: PropTypes.string,
	/*
	 * Custom error message
	 */
	error: PropTypes.string,
	/*
	 * Additional classes for input
	 */
	inputClassName: PropTypes.string,
	/*
	 * override type="text"
	 */
	type: PropTypes.string,
	/*
	 * onChange callback
	 */
	onChange: PropTypes.func,
	/*
	 * password type
	 */
	password: PropTypes.bool,
	/*
	 * email type
	 */
	email: PropTypes.bool
};

TextInput.defaultProps = {
	type: 'text'
}

export default TextInput;