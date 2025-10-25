![NPM Version](https://img.shields.io/npm/v/solid-modals) ![npm bundle size](https://img.shields.io/bundlephobia/min/solid-modals) ![NPM License](https://img.shields.io/npm/l/solid-modals)

# Solid Modal

Features:

-   Simple use
-   Smooth modal
-   Hamburger
-   Clear on route change
-   Use any where with your costume wrapper

## install

```sh
pnpm add solid-modals
```

or `npm`/`yarn`

## Init

base init in Solid-start app

```TypeScript
// app.tsx
import { Router } from "@solidjs/router";
import { FileRoutes } from "@solidjs/start/router";
import { Suspense } from "solid-js";
import { ModalRoot, ModalProvider } from "solid-modals";


export default function App() {
	return (
		<Router
			root={(props) => (
				<ModalProvider>
					<Suspense>
						{props.children}
						<ModalRoot />
					</Suspense>
				</ModalProvider>
			)}
		>
			<FileRoutes />
		</Router>
	);
}

```

## Base Modal

```TypeScript
// TestModal   .tsx
import { ModalBase, useModal } from "solid-modals";


export function TestModal() {
	const { onModal, onClear } = useModal();

	function onBaseModal() {
		onModal(
			<ModalBase onClear={onClear}>
				<div>hi</div>
			</ModalBase>
		);
	}

	return <button onClick={onBaseModal}>open modal</button>;
}

```

## Hamburger

```TypeScript
import { ModalHamburger, useModal } from "solid-modals";


export function TestHamburgerModal() {
	const { onModal, onClear } = useModal();

	function onHamburger() {
		onModal(
			<ModalHamburger onClear={onClear}>
				<ul>
					<li>1</li>
					<li>2</li>
					<li>3</li>
				</ul>
			</ModalHamburger>
		);
	}

	return <button onClick={onHamburger}>open modal</button>;
}
```
