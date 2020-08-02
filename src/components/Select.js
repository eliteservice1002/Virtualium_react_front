import React, {
	useRef,
	useState,
	Children,
	useEffect,
	cloneElement,
} from 'react';
import PropTypes from 'prop-types';
import cx from 'classnames';

/* utils */
import idgen from '../utils/idgen';
import { SIZES } from '../config.js';

const Select = ({
	s,
	m,
	l,
	xl,
	id,
	name,
	value,
	label,
	error,
	success,
	noLayout,
	onChange,
	multiple,
	disabled,
	validate,
	children,
	inputSolid,
	browserDefault,
	selectClassName,
	options = {
		classes: '',
		dropdownOptions: {
			alignment: 'left',
			autoTrigger: true,
			constrainWidth: true,
			container: null,
			coverTrigger: true,
			closeOnClick: true,
			hover: false,
			inDuration: 150,
			outDuration: 250,
			onOpenStart: null,
			onOpenEnd: null,
			onCloseStart: null,
			onCloseEnd: null
		}
	},
	...other
}) => {
	const _selectRef = useRef(null);
	const _selectInstance = useRef(null);
	const [ valueLocal, setValueLocal ] = useState(value);

	useEffect(() => {
		if (typeof M !== 'undefined') {
			_selectInstance.current = M.FormSelect.init(_selectRef.current, options);
		}

		return () => {
			if(_selectInstance.current) {
				_selectInstance.current.destroy();
			}
		}
	}, [_selectRef, children])

	useEffect(() => {
		setValueLocal(value)
	}, [value])

	const sizes = { s, m, l, xl };
	let responsiveClasses;
		if (!noLayout) {
			responsiveClasses = { col: true };
			SIZES.forEach(size => {
				responsiveClasses[size + sizes[size]] = sizes[size];
			});
		}

	const wrapperClasses = cx(
		'input-field',
		{ inputSolid },
		selectClassName,
		responsiveClasses,
	);

	const selectProps = {
		type: 'select',
		id: id || `select-${idgen()}`,
		disabled,
		multiple,
		...other
	};

	const handleChange = (event) => {
		let value = event.target.value;

		if (multiple) {
			value = _selectInstance.current.getSelectedValues();
		}

		if (onChange) onChange(event);

		setValueLocal(value);
	}

	const renderOption = child => {
		return (child) ? cloneElement(child, { key: child.props.value }) : null;
	}

	const renderOptions = () => Children.map(children, renderOption);

	const renderLabel = () => {
		return( (!label) ? null :
			<label
				data-success={success}
				data-error={error}
				htmlFor={selectProps.id}
			>
				{label}
			</label>
		)
	}


	return(
		<div className={wrapperClasses}>
			<select
				name={name}
				ref={_selectRef}
				value={valueLocal}
				onChange={handleChange}
				className={cx(
					{
						validate,
						multiple,
						['browser-default']: browserDefault
					}
				)}
				{...selectProps}
			>
				{renderOptions()}
			</select>
			{renderLabel()}
		</div>
	)
}

Select.propTypes = {
	/*
	 * Use browser default styles
	 */
	browserDefault: PropTypes.bool,
	/*
	 * Strip away all layout classes such as col and sX
	 */
	noLayout: PropTypes.bool,
	/*
	 * Responsive size for small size screens (Mobile Devices <= 600px)
	 */
	s: PropTypes.number,
	/*
	 * Responsive size for middle size screens (Tablet Devices > 600px)
	 */
	m: PropTypes.number,
	/*
	 * Responsive size for large size screens (Desktop Devices > 992px)
	 */
	l: PropTypes.number,
	/**
	 * Responsive size for extra large screens (Large Desktop Devices > 1200px)
	 */
	xl: PropTypes.number,
	/*
	 * disabled input
	 */
	disabled: PropTypes.bool,
	/*
	 * override id
	 * @default idgen()
	 */
	id: PropTypes.string,
	/*
	 * prefix icon
	 */
	icon: PropTypes.node,
	/*
	 * label text
	 */
	label: PropTypes.string,
	/*
	 * Input initial value
	 */
	value: PropTypes.oneOfType([PropTypes.string, PropTypes.array]),
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
	selectClassName: PropTypes.string,
	/*
	 * override type="text"
	 */
	type: PropTypes.string,
	/*
	 * onChange callback
	 */
	onChange: PropTypes.func,
	/*
	 * Render a multiple dropdown,
	 * use instance.getSelectedValues()
	 * to get array of selected values
	 */
	multiple: PropTypes.bool,
	children: PropTypes.any,
	name: PropTypes.string,
	/**
	 * Options for the select
	 * <a target="_blank" href="https://materializecss.com/select.html#options">https://materializecss.com/select.html</a>
	 */
	options: PropTypes.shape({
		classes: PropTypes.string,
		/**
		 * Options for the dropdown
		 * <a target="_blank" href="http://materializecss.com/dropdown.html#options">http://materializecss.com/dropdown.html</a>
		 */
		dropdownOptions: PropTypes.shape({
			alignment: PropTypes.oneOf(['left', 'right']),
			autoTrigger: PropTypes.bool,
			constrainWidth: PropTypes.bool,
			container: PropTypes.node,
			coverTrigger: PropTypes.bool,
			closeOnClick: PropTypes.bool,
			hover: PropTypes.bool,
			inDuration: PropTypes.number,
			outDuration: PropTypes.number,
			onOpenStart: PropTypes.func,
			onOpenEnd: PropTypes.func,
			onCloseStart: PropTypes.func,
			onCloseEnd: PropTypes.func
		})
	})
};

Select.defaultProps = {
	name: '',
}

export default Select;