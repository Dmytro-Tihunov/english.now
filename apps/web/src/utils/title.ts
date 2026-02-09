/**
 * Title utils
 */

const BASE_TITLE = "English Now";

export const createTitle = (
	pageTitle: string,
	baseTitle: string = BASE_TITLE,
): string => `${pageTitle} | ${baseTitle}`;

/**
 * Common page titles
 */
export const PAGE_TITLE = {
	// Public
	home: "Home",
	conversation: "Conversation",
	// Auth
	login: "Login",
	register: "Register",
	forgotPassword: "Forgot Password",
	resetPassword: "Reset Password",
	verifyEmail: "Verify Email",
	//Dashboard
	dashboard: "Dashboard",
	vocabulary: "Vocabulary",
	pronunciation: "Pronunciation",
	practice: "Practice",
	settings: "Settings",
};
