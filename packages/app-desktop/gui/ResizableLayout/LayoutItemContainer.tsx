import * as React from 'react';
import { Resizable, ResizeCallback, ResizeStartCallback, Size } from 're-resizable';
import { LayoutItem } from './utils/types';
import { itemMinHeight, itemMinWidth, itemSize, LayoutItemSizes } from './utils/useLayoutItemSizes';

interface Props {
	item: LayoutItem;
	parent: LayoutItem | null;
	sizes: LayoutItemSizes;
	resizedItemMaxSize: Size | null;
	onResizeStart: ResizeStartCallback;
	onResize: ResizeCallback;
	onResizeStop: ResizeCallback;
	children: React.ReactNode;
	isLastChild: boolean;
	visible: boolean;
}

const LayoutItemContainer: React.FC<Props> = ({
	item, visible, parent, sizes, resizedItemMaxSize, onResize, onResizeStart, onResizeStop, children, isLastChild,
}) => {

	// The calculation function for calculate the default notebook title
	const calculateHeaderBasedMinWidth = (itemKey: string) => {
		if (itemKey === 'sideBar') {
			// Create a temporary element to measure the "NOTEBOOKS" text
			const measureElement = document.createElement('span');
			measureElement.style.visibility = 'hidden';
			measureElement.style.position = 'absolute';
			measureElement.style.whiteSpace = 'nowrap';
			measureElement.textContent = 'NOTEBOOKS';

			// Measure the folder icon
			const folderIcon = document.querySelector('.sidebar-header-container i, .sidebar-header-container svg, .sidebar-header-container img') ||
                  document.querySelector('.sidebar-header-button *[role="img"]') ||
                  document.querySelector('.sidebar-header-button *[class*="icon"]');
			const iconWidth = (folderIcon as HTMLElement)?.offsetWidth || 20;

			// Try to get the actual font styles from the sidebar header
			const sidebarHeader = document.querySelector('.sidebar-header-container') || document.body;
			const computedStyle = window.getComputedStyle(sidebarHeader);

			measureElement.style.fontSize = computedStyle.fontSize;
			measureElement.style.fontFamily = computedStyle.fontFamily;
			measureElement.style.fontWeight = computedStyle.fontWeight;

			document.body.appendChild(measureElement);
			const textWidth = measureElement.offsetWidth;
			document.body.removeChild(measureElement);

			// Multiply icon 4 times for icon width and padding
			return textWidth + iconWidth * 6;
		}
		return itemMinWidth;
	};

	const style: React.CSSProperties = {
		display: visible ? 'flex' : 'none',
		flexDirection: item.direction,
	};

	const size: Size = itemSize(item, parent, sizes, true);

	const className = `resizableLayoutItem rli-${item.key}`;
	if (item.resizableRight || item.resizableBottom) {
		const enable = {
			top: false,
			right: !!item.resizableRight && !isLastChild,
			bottom: !!item.resizableBottom && !isLastChild,
			left: false,
			topRight: false,
			bottomRight: false,
			bottomLeft: false,
			topLeft: false,
		};

		return (
			<Resizable
				key={item.key}
				className={className}
				style={style}
				size={size}
				onResizeStart={onResizeStart}
				onResize={onResize}
				onResizeStop={onResizeStop}
				enable={enable}
				minWidth={'minWidth' in item ? item.minWidth : calculateHeaderBasedMinWidth(item.key)}
				minHeight={'minHeight' in item ? item.minHeight : itemMinHeight}
				maxWidth={resizedItemMaxSize?.width}
				maxHeight={resizedItemMaxSize?.height}
			>
				{children}
			</Resizable>
		);
	} else {
		return (
			<div key={item.key} className={className} style={{ ...style, ...size }}>
				{children}
			</div>
		);
	}
};

export default LayoutItemContainer;
