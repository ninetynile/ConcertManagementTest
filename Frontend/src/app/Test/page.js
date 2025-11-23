"use client";

import styles from "./page.module.css";

import HomeContent from "../Test/components/HomeContent.js";
import HistoryContent from "../Test/components/HistoryContent.js";
import Sidebar from "./components/Sidebar.js"; 
import { useState} from "react";

export default function Test() {
	const [currentView, setCurrentView] = useState("home");

	const handleMenuClick = (viewName) => {
		setCurrentView(viewName);
	};

	const renderMainContent = () => {
		switch (currentView) {
			case "home":
				return <HomeContent />;
			case "history":
				return <HistoryContent />;
			default:
				return <HomeContent />;
		}
	};

	return (
		<div className={styles.page}>
			<Sidebar currentView={currentView} onMenuClick={handleMenuClick} />
			<div className={styles.mainContent}>{renderMainContent()}</div>
		</div>
	);
}
