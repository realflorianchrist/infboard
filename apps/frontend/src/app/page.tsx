import Grid from "../components/Grid";
import Treeview from "@/src/components/treeview/Treeview";

export default function Home() {
    return (
        <main className={'flex'}>
            <Treeview/>
            <div className={'w-full'}>
                <Grid/>
            </div>
        </main>
    );
}
