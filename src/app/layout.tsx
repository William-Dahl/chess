import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Chessboard",
  description: "Using Pragmatic drag and drop to make a simple chessboard",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
