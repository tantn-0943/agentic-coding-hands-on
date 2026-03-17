import type { Metadata } from "next";
import { Montserrat, Montserrat_Alternates } from "next/font/google";
import localFont from "next/font/local";
import "./globals.css";

const montserrat = Montserrat({
	variable: "--font-montserrat",
	subsets: ["latin", "vietnamese"],
	weight: ["400", "500", "700"],
	style: ["normal", "italic"],
});

const montserratAlternates = Montserrat_Alternates({
	variable: "--font-montserrat-alt",
	subsets: ["latin", "vietnamese"],
	weight: ["700"],
});

const digitalFont = localFont({
	src: "../../public/fonts/DSEG7Classic-Regular.ttf",
	variable: "--font-digital",
	display: "swap",
});

// SVN-Gotham: custom font for Kudos page
// TODO: Uncomment when SVN-Gotham font files are obtained from design team
// const svnGotham = localFont({
// 	src: [
// 		{ path: "../../public/fonts/SVN-Gotham-Regular.woff2", weight: "400", style: "normal" },
// 		{ path: "../../public/fonts/SVN-Gotham-Medium.woff2", weight: "500", style: "normal" },
// 		{ path: "../../public/fonts/SVN-Gotham-Bold.woff2", weight: "700", style: "normal" },
// 	],
// 	variable: "--font-svn-gotham",
// 	display: "swap",
// 	fallback: ["var(--font-montserrat)", "Arial", "sans-serif"],
// });

export const metadata: Metadata = {
	title: "Sun Annual Awards 2025",
	description: "Sun Annual Awards 2025 - Root Further",
};

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<html lang="en">
			<head>
				<link rel="icon" href="/favicon.svg" type="image/svg+xml" />
			</head>
			<body className={`${montserrat.variable} ${montserratAlternates.variable} ${digitalFont.variable} antialiased`}>
				{children}
			</body>
		</html>
	);
}
