import { useLocation } from "@solidjs/router";
import { JSXElement, createSignal, createEffect, onMount } from "solid-js";
import { JSX } from "solid-js";
import { createStore } from "solid-js/store";

export interface Modal {
	modal?: JSX.Element;
}

const [store, setStore] = createStore<Modal>({});

export function useModal() {
	function showModal(modal: JSX.Element) {
		setStore("modal", modal);
	}

	function clearModal() {
		setStore("modal", undefined);
	}

	const location = useLocation();
	createEffect(() => {
		location.pathname;
		clearModal();
	});

	return { showModal, clearModal };
}

export function ModalRoot() {
	return <>{store.modal}</>;
}

// =====================================================

export type modalBaseArgs = {
	onClear: () => void;
	outsideClose?: boolean;
	children: JSXElement;
	withAnimation?: boolean;
};

export function ModalBase({ children, onClear, outsideClose: outsideClose = true, withAnimation = true }: modalBaseArgs) {
	const baseWrapperStyle: JSX.CSSProperties = {
		width: "100%",
		"min-height": "100.1%",
		height: "100%",
		"overflow-y": "auto" as const,
		"background-attachment": "fixed" as const,
		transition: "all 200ms",
		"background-color": "black",
	};

	const wrapperCloseStyle: JSX.CSSProperties = {
		...baseWrapperStyle,
		"background-color": "rgba(0, 0, 0, 0)",
	};

	const wrapperOpenStyle: JSX.CSSProperties = {
		...baseWrapperStyle,
		"background-color": "rgba(0, 0, 0, 0.7)",
	};

	const baseBackStyle: JSX.CSSProperties = {
		display: "flex",
		"align-items": "center",
		"justify-content": "center",
		padding: "48px 16px",
		width: "100%",
		height: "max-content",
		"min-height": "100%",
		transition: "all 200ms",
	};

	const backCloseStyle: JSX.CSSProperties = {
		...baseBackStyle,
		opacity: "0",
		transform: "scale(0.9)",
	};

	const backOpenStyle: JSX.CSSProperties = {
		...baseBackStyle,
		opacity: "1",
		transform: "scale(1)",
	};

	const [backgroundStyle, setBackgroundStyle] = createSignal(withAnimation ? backCloseStyle : backOpenStyle);
	const [wrapperStyle, setWrapperStyle] = createSignal(withAnimation ? wrapperCloseStyle : wrapperOpenStyle);
	const [onClose, setOnClose] = createSignal(false);

	onMount(() => {
		if (withAnimation) {
			setBackgroundStyle(backOpenStyle);
			setWrapperStyle(wrapperOpenStyle);
		}
	});

	const handleWrapperClick = () => {
		if (outsideClose) {
			setOnClose(true);
			if (withAnimation) {
				setBackgroundStyle(backCloseStyle);
				setWrapperStyle(wrapperCloseStyle);
			} else {
				onClear();
			}
		}
	};

	const handleTransitionEnd = (e: TransitionEvent) => {
		if (onClose() && e.propertyName === "opacity") {
			onClear();
		}
	};

	return (
		<div
			style={{
				position: "fixed" as const,
				top: "0",
				right: "0",
				bottom: "0",
				left: "0",
				"z-index": 50,
				"background-attachment": "fixed" as const,
				"overflow-y": "auto" as const,
				width: "100%",
				"overscroll-behavior": "none",
			}}
		>
			<div style={{ ...wrapperStyle() }} onClick={handleWrapperClick}>
				<div style={backgroundStyle()} onTransitionEnd={handleTransitionEnd}>
					<div
						style={{
							display: "flex",
							"align-items": "center",
							"justify-content": "center",
							"max-width": "100%",
						}}
						onClick={(e) => e.stopPropagation()}
					>
						{children}
					</div>
				</div>
			</div>
		</div>
	);
}

export function ModalHamburger({ onClear, children }: { onClear: () => void; children: JSXElement }) {
	const baseWrapperStyle: JSX.CSSProperties = {
		width: "100%",
		height: "100.1%",
		"overflow-y": "auto" as const,
		"background-attachment": "fixed" as const,
		transition: "all 300ms",
		"background-color": "black",
	};

	const wrapperCloseStyle: JSX.CSSProperties = {
		...baseWrapperStyle,
		"background-color": "rgba(0, 0, 0, 0)",
	};

	const wrapperOpenStyle: JSX.CSSProperties = {
		...baseWrapperStyle,
		"background-color": "rgba(0, 0, 0, 0.7)",
	};

	const baseBackStyle: JSX.CSSProperties = {
		position: "absolute" as const,
		display: "flex",
		"flex-direction": "column" as const,
		height: "100%",
		width: "21rem",
		"max-width": "75%",
		transition: "all 300ms",
	};

	const backCloseStyle: JSX.CSSProperties = {
		...baseBackStyle,
		right: "-24rem",
	};

	const backOpenStyle: JSX.CSSProperties = {
		...baseBackStyle,
		right: "0",
	};

	const [backgroundStyle, setBackgroundStyle] = createSignal(backCloseStyle);
	const [wrapperStyle, setWrapperStyle] = createSignal(wrapperCloseStyle);
	const [onClose, setOnClose] = createSignal(false);

	onMount(() => {
		setBackgroundStyle(backOpenStyle);
		setWrapperStyle(wrapperOpenStyle);
	});

	return (
		<div
			style={{
				position: "fixed" as const,
				top: "0",
				right: "0",
				bottom: "0",
				left: "0",
				"z-index": 50,
				"background-attachment": "fixed" as const,
				"overflow-y": "auto" as const,
				"overscroll-behavior": "none",
			}}
		>
			<div
				style={wrapperStyle()}
				onClick={() => {
					setOnClose(true);
					setBackgroundStyle(backCloseStyle);
					setWrapperStyle(wrapperCloseStyle);
				}}
			>
				<div style={backgroundStyle()} onTransitionEnd={(e) => onClose() && (e as TransitionEvent).propertyName === "right" && onClear()}>
					<div
						style={{
							display: "flex",
							"flex-direction": "column" as const,
							width: "100%",
							height: "100%",
						}}
						onClick={(e) => e.stopPropagation()}
					>
						{children}
					</div>
				</div>
			</div>
		</div>
	);
}
