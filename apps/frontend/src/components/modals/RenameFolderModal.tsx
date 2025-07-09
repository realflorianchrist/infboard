'use client';
import {Dialog, DialogContent, DialogHeader, DialogTitle} from '@workspace/ui/components/dialog';
import {Input} from '@workspace/ui/components/input';
import {Button} from '@workspace/ui/components/button';
import {useContextMenu} from '@/src/providers/ContextMenuProvider';
import {useEffect, useState} from 'react';
import {useUpdateFolder} from "@/src/api/hooks/folderHooks";

export default function RenameFolderModal() {
    const {renameFolderModal, closeRenameFolderModal} = useContextMenu();
    const {mutate} = useUpdateFolder();

    const [newName, setNewName] = useState('');

    useEffect(() => {
        setNewName(renameFolderModal.folderName ?? '');
    }, [renameFolderModal.folderName]);

    const handleRename = () => {
        if (!renameFolderModal.folderId || !newName) return;

        mutate({folder: {id: renameFolderModal.folderId, name: newName}}, {
            onSuccess: () => closeRenameFolderModal()
        })
    };

    return (
        <Dialog open={renameFolderModal.open} onOpenChange={closeRenameFolderModal}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Ordner umbenennen</DialogTitle>
                </DialogHeader>
                <form onSubmit={(e) => {
                    e.preventDefault();
                    handleRename();
                }}>
                    <Input
                        autoFocus
                        placeholder="Neuer Ordnername"
                        value={newName}
                        onChange={(e) => setNewName(e.target.value)}
                    />
                    <div className="flex justify-end gap-2 mt-4">
                        <Button type="button" variant="secondary" onClick={closeRenameFolderModal}>
                            Abbrechen
                        </Button>
                        <Button type="submit" disabled={!newName.trim()}>
                            Speichern
                        </Button>
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    );
}
