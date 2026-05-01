import Link from "next/link";
import { TECH_STACK, METRIK_URL, GH_URL } from "@/utils/constants";

export default function Home() {
    return (
        <main className="container grow max-w-3xl flex flex-col items-center justify-center gap-8 text-center">
            <h1 className="text-40">Quote Tables Showcase</h1>
            <div>
                <p className="mb-4">Here you can find a showcase of the quote tables used in my SasS <Link href={METRIK_URL} target="_blank" rel="noopener noreferrer" className="btn btn--tertiary">Metrik<span className="sr-only">Opens in new tab</span></Link>.</p>
                <p>This is a construction quote table presentation I made to show my product, design and full-stack development skills. Feel free to try it out and visit the repo to learn more about the project.</p>
            </div>
            <div className="flex flex-wrap gap-2">
                <Link
                    href="/quote-table"
                    className="grow btn btn--gold"
                    aria-label="Go to quote table demo"
                >
                    Try it now!
                </Link>
                <Link
                    href={GH_URL}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="grow btn btn--secondary"
                >
                    View source code
                    <span className="sr-only">Opens in new tab</span>
                </Link>
            </div>
            <div>
                <p className="mb-2">This project was built with: </p>
                <ul className="mx-auto max-w-md flex flex-wrap gap-2 justify-center">
                    {TECH_STACK.map((tech) => (
                        <li key={tech} className="badge">{tech}</li>
                    ))}
                </ul>
            </div>
        </main>
    );
}
