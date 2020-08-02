import twemoji from 'twemoji';
import React, { useRef, useEffect, useState } from 'react';
import style from './Twemoji.module.css';

export default function Twemoji(props) {
    const textRef = useRef();

    useEffect( () => {
        twemoji.parse(textRef.current,
	{
		className: style.resize_emoji
	});
    },[]);

    return (
        <span ref={textRef}>{props.children}</span>
    )
}
