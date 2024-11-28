import Link from "next/link";

export default function Header() {
    return (
        <header className="bg-neutral-900 text-white p-4">
            <div className="max-w-4xl mx-auto">
                <h1 className="text-2xl font-bold">
                    <Link href="/">Northwind Database</Link>
                </h1>
            </div>
        </header>
    );
}
