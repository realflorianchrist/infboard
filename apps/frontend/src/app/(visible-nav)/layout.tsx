import Header from "@/src/components/header/Header";

export default function VisibleNavigationLayout(
    {
        children,
    }: Readonly<{
        children: React.ReactNode;
    }>) {

    return (
        <>
            <Header/>
            <main>
                {children}
            </main>
        </>
    );
}