export const sanitizeText = (text: string) => {
	return text
		.replace(/[^a-zA-Z0-9\s]/g, " ")
		.replace(/\s+/g, " ")
		.trim()
		.toLowerCase()
}
