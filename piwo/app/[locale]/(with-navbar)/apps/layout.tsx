export default async function Layout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return <main className="pt-24 sm:pt-42 min-h-screen">{children}</main>;
}
