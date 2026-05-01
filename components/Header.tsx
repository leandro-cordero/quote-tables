import Link from "next/link";
import { GH_URL } from "@/utils/constants";


export default function Header() {
    return (
        <header className="container w-full p-4 flex flex-row justify-between items-center flex-wrap gap-4">
            <Link href="/" aria-label="Back to home page" className="btn btn--tertiary">
                <i className="icon-angle-left text-20"></i>
                Back
            </Link>
            <div className="flex flex-row flex-nowrap items-center gap-4">
                <Link
                    href={GH_URL}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn btn--secondary btn--md"
                >
                    Source code<span className="sr-only">Opens in new tab</span>
                </Link>
            </div>
        </header>
    )
}