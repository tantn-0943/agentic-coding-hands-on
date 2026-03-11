import type { Metadata } from "next";
import { Montserrat, Montserrat_Alternates } from "next/font/google";
import "./globals.css";

const montserrat = Montserrat({
	variable: "--font-montserrat",
	subsets: ["latin", "vietnamese"],
	weight: ["700"],
});

const montserratAlternates = Montserrat_Alternates({
	variable: "--font-montserrat-alt",
	subsets: ["latin", "vietnamese"],
	weight: ["700"],
});

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
			<body className={`${montserrat.variable} ${montserratAlternates.variable} antialiased`}>
				{children}
			</body>
		</html>
	);
}
