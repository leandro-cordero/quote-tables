import Link from "next/link";


export default function NotFound() {
    return (
        <main className="grow container flex items-center justify-center flex-col">
            <h1 className='text-40 text-center'>Not found</h1>
            <p className='text-14 text-center'>The page you are looking for does not exist.</p>
            <div className='mt-4'>
                <Link href="/" className='btn btn--primary'>
                    Return to home
                </Link>
            </div>
        </main>
    );
}