import Header from "@/src/components/header/Header";

export default function AuthLayout(
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