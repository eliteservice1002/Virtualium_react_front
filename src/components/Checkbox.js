import React, { useState, useEffect, useRef } from 'react';
import PropTypes from 'prop-types';
import cx from 'classnames';
import idgen from '../utils/idgen';

const Checkbox = ({
	id,
	label,
	value,
	onChange,
	filledIn,
	className,
	indeterminate,
	...props
}) => {
	const [checked, setChecked] = useState(value);
	const _input = useRef(null);

	useEffect(() => {
		if (_input.current) {
			_input.current.indeterminate = indeterminate;
			_input.current.checked = false;
			setChecked(false);
		}
	}, [indeterminate]);

	useEffect(() => {
		setChecked(value);
		_input.current.checked = value;
	}, [value]);

	return (
		<label htmlFor={id}>
			<input
				{...props}
				id={id}
				className={cx(
					{
						'filled-in': filledIn
					},
					className
				)}
				value={value}
				type="checkbox"
				ref={_input}
				checked={checked}
				onChange={e => {
					setChecked(prevChecked => !prevChecked);
					onChange && onChange(e);
				}}
			/>
			<span>{label}</span>
		</label>
	);
};

Checkbox.propTypes = {
	className: PropTypes.string,
	/*
	 * checkbox value
	 */
	value: PropTypes.oneOfType([
		PropTypes.bool,
		PropTypes.string,
		PropTypes.number,
	]).isRequired,
	/*
	 * filled-in styled checkbox
	 */
	filledIn: PropTypes.bool,
	/*
	 * label next to checkbox
	 */
	// label: PropTypes.string.isRequired,
	label: PropTypes.oneOfType([PropTypes.string, PropTypes.node]).isRequired,
	/*
	 * Indeterminate Style
	 */
	indeterminate: PropTypes.bool,
	/*
	 * onChange callback
	 */
	onChange: PropTypes.func,
	/*
	 * override id
	 * @default idgen()
	 */
	id: PropTypes.string,
	/*
	 * disabled input
	 */
	disabled: PropTypes.bool,
	/*
	 * A Boolean attribute indicating whether or not this checkbox is checked
	 */
	checked: PropTypes.bool
};

Checkbox.defaultProps = {
	id: `checkbox_${idgen()}`
};

export default Checkbox;