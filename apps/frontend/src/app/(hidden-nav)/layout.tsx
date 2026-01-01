import Header from "@/src/components/header/Header";

export default function AuthLayout(
    {
        children,
    }: Readonly<{
        children: React.ReactNode;
    }>) {

    return (
        <>
            <Header hideNavigation={true}/>
            <main>
                {children}
            </main>
        </>
    );
}