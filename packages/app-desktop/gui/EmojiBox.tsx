import { useMemo, useRef, useState } from 'react';

interface Props {
	width: number;
	height: number;
	emoji: string;
}

const fontSizeCache_: Record<string, number> = {};

export default (props: Props) => {
	const containerRef = useRef(null);
	const [containerReady, setContainerReady] = useState(false);

	const fontSize = useMemo(() => {
		if (!containerReady) return props.height;

		const cacheKey = [props.width, props.height, props.emoji].join('-');
		if (fontSizeCache_[cacheKey]) {
			return fontSizeCache_[cacheKey];
		}

		// Create hidden element for calculation
		const span = document.createElement('span');
		span.innerText = props.emoji;
		span.style.position = 'absolute';
		span.style.visibility = 'hidden';
		span.style.fontSize = `${props.height}px`;

		// Append to container
		containerRef.current.appendChild(span);

		let spanFontSize = props.height;

		let rect = span.getBoundingClientRect();

		while (rect.height > props.height) {
			spanFontSize -= 0.5;
			span.style.fontSize = `${spanFontSize}px`;
			rect = span.getBoundingClientRect();
		}

		span.remove();

		fontSizeCache_[cacheKey] = spanFontSize;
		return spanFontSize;
	}, [props.width, props.height, props.emoji, containerReady]);

	return <div className="emoji-box" ref={el => { containerRef.current = el; setContainerReady(true); }} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: props.width, height: props.height, fontSize }}>{props.emoji}</div>;
};
