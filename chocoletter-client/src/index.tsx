import ReactDOM from "react-dom/client";
import { RecoilRoot } from "recoil";
import "./styles/index.css";
import App from "./App";
import React from "react";

const root = ReactDOM.createRoot(
	document.getElementById("root") as HTMLElement
);
root.render(
	<React.StrictMode>
		<RecoilRoot>
			<div className="mx-auto w-full md:max-w-sm lg:min-h-screen">
				<App />
			</div>
		</RecoilRoot>
	</React.StrictMode>
);
