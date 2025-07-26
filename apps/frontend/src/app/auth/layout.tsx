export default function AuthLayout(
    {
        children,
    }: Readonly<{
        children: React.ReactNode;
    }>) {

    return (
        <div className={'flex flex-col items-center mt-20'}>
            <div className={'w-3/4 md:w-2/5 lg:w-1/4 xl:w-1/5 2xl:w-1/7'}>
                {children}
            </div>
        </div>
    )
}