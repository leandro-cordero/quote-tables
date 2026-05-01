import Link from "next/link";
import { LINKEDIN_URL, PORTFOLIO_URL } from "@/utils/constants";


export default function Footer() {
    return (
        <footer className="p-4 text-center">
            <p>
                <small>
                    Made with ❤️ by <Link href={LINKEDIN_URL} target="_blank" rel="noopener noreferrer" className="btn btn--tertiary btn--light">Leandro Cordero<span className="sr-only">Opens LinkedIn profile in new tab</span></Link>
                </small><br />
                <small>Visit my <Link href={PORTFOLIO_URL} target="_blank" rel="noopener noreferrer" className="btn btn--tertiary btn--light">Portfolio<span className="sr-only">Opens in new tab</span></Link> for more of my work.</small>
            </p>
        </footer>
    );
}