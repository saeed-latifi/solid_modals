// import { Component, createEffect, createMemo, createSignal, onCleanup } from 'solid-js';
// import toast, { Toaster } from '../../src';

import { createEffect } from "solid-js";

export function App() {
	return (
		<div class="px-6">
			<Toaster position="top-center" />
			<h1>Solid Toast Examples</h1>
			<div
				style={{
					display: "flex",
					"flex-direction": "column",
					"align-items": "flex-start",
					gap: "0.5rem",
				}}
			>
				<button class={"blank"} onClick={popBlank}>
					Blank Toast
				</button>
				<button class={"success"} onClick={popSuccess}>
					Success Toast
				</button>
				<button class={"error"} onClick={popError}>
					Error Toast
				</button>
				<button class={"loading"} onClick={popLoading}>
					Loading Toast
				</button>
				<button class={"promise"} onClick={popPromise}>
					Promise Toast
				</button>
				<button class={"custom"} onClick={popCustom}>
					Custom Styles
				</button>
				<button class={"timer"} onClick={popTimer}>
					Toast Timer
				</button>
				<button class={"close"} onClick={closeAll}>
					Close all toasts
				</button>
			</div>
		</div>
	);
}

export default App;
