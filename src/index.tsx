// import { useLocation } from "@solidjs/router";
import { createContext, useContext, JSXElement, createSignal, createEffect, Show, ParentProps, onMount } from "solid-js";
import { Portal } from "solid-js/web";

export type ModalContextType = {
	onModal: (modal: JSXElement) => void;
	onClear: () => void;
	rawModal: () => JSXElement | undefined;
};

const ModalContext = createContext<ModalContextType>();

export function ModalProvider(props: ParentProps) {
	const [rawModal, setRawModal] = createSignal<JSXElement | undefined>();
	// const location = useLocation();

	function onModal(modal: JSXElement) {
		setRawModal(modal);
	}

	function onClear() {
		setRawModal(undefined);
	}

	// createEffect(() => {
	// 	// location.pathname;
	// 	onClear();
	// });

	const value: ModalContextType = {
		onModal,
		onClear,
		rawModal,
	};

	return <ModalContext.Provider value={value}>{props.children}</ModalContext.Provider>;
}

export function useModal() {
	const context = useContext(ModalContext);
	if (!context) {
		throw new Error("useModal must be used within a ModalProvider");
	}
	const { onClear, onModal } = context;
	return { onClear, onModal };
}

export function ModalRoot() {
	const context = useContext(ModalContext);
	if (!context) {
		throw new Error("useModal must be used within a ModalProvider");
	}

	return (
		<Portal>
			<Show when={!!context.rawModal()}>{context.rawModal()}</Show>
		</Portal>
	);
}

// =====================================================

type Props = {
	onClear: () => void;
	onOutClose?: boolean;
	children: JSXElement;
	withAnimation?: boolean;
};

export function ModalBase({ children, onClear, onOutClose = true, withAnimation = true }: Props) {
	const wrapperBase = "w-full min-h-[100.1%] h-full overflow-y-auto bg-fixed transition-all bg-black duration-200 bg-black";
	const wrapperClose = wrapperBase + " " + "bg-opacity-0";
	const wrapperOpen = wrapperBase + " " + "bg-opacity-70";

	const backBase = "flex items-center justify-center px-4 py-12 w-full h-max min-h-full transition-all duration-200";
	const backClose = backBase + " " + " opacity-0 scale-90";
	const backOpen = backBase + " " + " opacity-100 scale-100";

	const [backgroundStyle, setBackgroundStyle] = createSignal(withAnimation ? backClose : backOpen);
	const [wrapperStyle, setWrapperStyle] = createSignal(withAnimation ? wrapperClose : wrapperOpen);
	const [onClose, setOnClose] = createSignal(false);

	onMount(() => {
		if (withAnimation) {
			setBackgroundStyle(backOpen);
			setWrapperStyle(wrapperOpen);
		}
	});

	const handleWrapperClick = () => {
		if (onOutClose) {
			setOnClose(true);
			if (withAnimation) {
				setBackgroundStyle(backClose);
				setWrapperStyle(wrapperClose);
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
		<div class="fixed top-0 right-0 bottom-0 left-0 z-50 bg-fixed overscroll-none overflow-y-scroll w-full">
			<div style={{ height: "100%" }} class={wrapperStyle()} onClick={handleWrapperClick}>
				<div class={backgroundStyle()} onTransitionEnd={handleTransitionEnd}>
					<div class="flex items-center justify-center max-w-full" onClick={(e) => e.stopPropagation()}>
						{children}
					</div>
				</div>
			</div>
		</div>
	);
}

export function ModalHamburger({ onClear, children }: { onClear: () => void; children: JSXElement }) {
	const wrapper = "w-full h-[100.1%] overflow-y-auto bg-fixed transition-all bg-black duration-300";
	const wrapperClose = wrapper + " " + "bg-opacity-0";
	const wrapperOpen = wrapper + " " + "bg-opacity-70";

	const back = "absolute flex flex-col h-full w-[21rem] max-w-[75%] transition-all duration-300";
	const backClose = back + " " + " -right-96";
	const backOpen = back + " " + " right-0";

	const [backgroundStyle, setBackgroundStyle] = createSignal(backClose);
	const [wrapperStyle, setWrapperStyle] = createSignal(wrapperClose);
	const [onClose, setOnClose] = createSignal(false);

	onMount(() => {
		setBackgroundStyle(backOpen);
		setWrapperStyle(wrapperOpen);
	});

	return (
		<div class="fixed inset-0 z-50 bg-fixed overflow-y-scroll overscroll-none">
			<div
				class={wrapperStyle()}
				onClick={() => {
					setOnClose(true);
					setBackgroundStyle(backClose);
					setWrapperStyle(wrapperClose);
				}}
			>
				<div onTransitionEnd={(e) => onClose() && e.propertyName === "right" && onClear()} class={backgroundStyle()}>
					<div class="flex flex-col w-full h-full" onClick={(e) => e.stopPropagation()}>
						{children}
					</div>
				</div>
			</div>
		</div>
	);
}
