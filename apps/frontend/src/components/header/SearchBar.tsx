import {Input} from "@workspace/ui/components/input";
import {Button} from "@workspace/ui/components/button";

export default function SearchBar(
    {
        setIsSearching
    }: {
        setIsSearching: (searching: boolean) => void;
    }) {

    return (
        <div className={'flex'}>
            <Input
                type={'search'}
                className={'rounded-r-none focus-visible:ring-transparent'}
                placeholder={'Suchen..'}
            />
            <Button
                onClick={() => setIsSearching(false)}
                className={'rounded-l-none bg-accent hover:bg-accent/80 text-foreground'}
            >
                &times;
            </Button>
        </div>
    );
}