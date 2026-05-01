import type { Metadata } from "next";
import { Work_Sans, Rajdhani } from "next/font/google"
import "@/styles/styles.scss";
import Footer from "@/components/Footer";


const worksans = Work_Sans({
    subsets: ["latin"],
    weight: ["400", "500", "600"],
    display: "swap",
})
const rajdhani = Rajdhani({
    subsets: ["latin"],
    weight: ["600", "700"],
    display: "swap",
})


export const metadata: Metadata = {
    title: "Quote Tables",
    description: "This is a construction quote table presentation from Metrik by Leandro Cordero. I made this to show my product and full-stack development skills.",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode; }>) {
    return (
        <html lang="en">
            <body className="min-h-full flex flex-col">
                {children}
                <Footer />
            </body>
        </html>
    );
}
