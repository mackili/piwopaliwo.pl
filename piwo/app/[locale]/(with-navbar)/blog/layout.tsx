export default async function Layout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <main className="pt-24 sm:pt-42 px-5 sm:px-10 pb-10 min-h-screen">
            {children}
        </main>
    );
}
