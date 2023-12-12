import "./assets/global.css";
import { useReducer } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { LoginPage } from "./pages/LoginPage/LoginPage";
import { Theme, presetGpnDark } from "@consta/uikit/Theme";
import { Dashboard } from "./pages/Dashboard/Dashboard";
import { Task } from "./pages/Task/Task";
import { ModuleStart } from "./pages/ModuleStart/ModuleStart";
import { ModuleFinal } from "./pages/ModuleFinal/ModuleFinal";
import { LessonStart } from "./pages/LessonStart/LessonStart";
import { LessonFinal } from "./pages/LessonFinal/LessonFinal";
import { CreatePassword } from "./pages/CreatePassword/CreatePassword";
import { Diploma } from "./pages/Diploma/Diploma";
import { Counselor } from "./pages/Counselor/Counselor";
import { Footer } from "./components/custom/Footer/Footer";
import { SnackBar } from "@consta/uikit/SnackBar";
import { PaymentSuccess } from "./pages/PaymentSuccess/PaymentSuccess";
import { NextStep } from "./pages/NextStep/NextStep";

type Item = {
	key: number;
	message: string;
	status: string;
	progressMode: "line";
};

function reducer(
	state: Item[],
	action: { type: "add" | "remove"; item: Item }
): Item[] {
	switch (action.type) {
		case "add":
			return [...state, action.item];
		case "remove":
			return state.filter((itemInState) => itemInState.key !== action.item.key);
	}
}

const getItemShowProgress = (item: Item) => item.progressMode;

export default function App() {
	const [items, dispatchItems] = useReducer<
		React.Reducer<
			Item[],
			{ type: "add" | "remove"; item: Item; key?: number | string }
		>
	>(reducer, []);

	function Informer(status: string, message: string) {
		const key = items.length + 1;
		const item: Item = {
			key,
			message,
			status,
			progressMode: "line",
		};
		dispatchItems({ type: "add", item });
	}

	return (
		<Theme className="container" preset={presetGpnDark}>
			<Router>
				<Routes>
					<Route path="/login" element={<LoginPage addInformer={Informer} />} />
					<Route
						path="/paymentSuccess"
						element={<PaymentSuccess addInformer={Informer} />}
					/>
					<Route path="/nextStep" element={<NextStep />} />
					<Route
						path="/createPassword"
						element={<CreatePassword addInformer={Informer} />}
					/>
					<Route path="/" element={<Dashboard />} />
					<Route path="/:module" element={<ModuleStart />} />
					<Route path="/:module/:lesson" element={<LessonStart />} />
					<Route path="/:module/:lesson/:task" element={<Task />} />
					<Route path="/:module/:lesson/final" element={<LessonFinal />} />
					<Route path="/:module/final" element={<ModuleFinal />} />
					<Route path="/:module/diploma" element={<Diploma />} />
					<Route path="/counselor" element={<Counselor />} />
				</Routes>
			</Router>
			<SnackBar
				items={items}
				onItemClose={(item: any) => dispatchItems({ type: "remove", item })}
				getItemShowProgress={getItemShowProgress}
				getItemAutoClose={() => 5}
			/>
			<Footer />
		</Theme>
	);
}
