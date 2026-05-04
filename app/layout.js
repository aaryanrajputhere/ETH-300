import "./globals.css";

export const metadata = {
  title: "ETH-300 Investment",
  description: "Track our Ethereum investment progress",
  icons: {
    icon: "/imgs/300.png",
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=0" />
      </head>
      <body>{children}</body>
    </html>
  );
}
