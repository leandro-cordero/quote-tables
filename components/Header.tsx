export default function Header() {
    return (
        <header className="w-full p-4 flex flex-row justify-between items-center flex-wrap gap-4">
            <h1 className="text-32">Quote Tables showcase</h1>
            <div className="flex flex-row flex-nowrap items-center gap-4">
                <a
                    href="//github.com/Leandro-dev-04"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn btn--tertiary btn--md btn--light"
                >
                    Repository
                </a>
                <a
                    href="//leandro-cordero.vercel.app"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn btn--tertiary btn--md btn--light"
                >
                    Portfolio
                </a>
            </div>
            <a
                href="//www.linkedin.com/in/leandro-cordero"
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn--secondary btn--md"
            >
                Leandro Cordero
            </a>
        </header>
    )
}