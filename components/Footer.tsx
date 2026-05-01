import Link from "next/link";


export default function Footer() {
    return (
        <footer className="p-4 text-center">
            <p>
                <small>
                    Made with ❤️ by <Link href="https://www.linkedin.com/in/leandrocordero/" target="_blank" rel="noopener noreferrer" className="btn btn--tertiary btn--light">Leandro Cordero<span className="sr-only">Opens LinkedIn profile in new tab</span></Link>
                </small>
            </p>
        </footer>
    );
}