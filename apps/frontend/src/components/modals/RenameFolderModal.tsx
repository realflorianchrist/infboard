'use client';
import {Dialog, DialogContent, DialogHeader, DialogTitle} from '@workspace/ui/components/dialog';
import {Input} from '@workspace/ui/components/input';
import {Button} from '@workspace/ui/components/button';
import {useModal} from '@/src/providers/ModalProvider';
import {useEffect, useState} from 'react';

export default function RenameFolderModal() {
    const {renameFolderModal, closeRenameFolderModal} = useModal();
    const [newName, setNewName] = useState('');

    useEffect(() => {
        setNewName(renameFolderModal.folderName ?? '');
    }, [renameFolderModal.folderName]);

    const handleRename = () => {
        if (!renameFolderModal.folderId) return;

        // TODO: Call rename mutation or service function here
        console.log('Renaming folder', renameFolderModal.folderId, 'to', newName);

        closeRenameFolderModal();
    };

    return (
        <Dialog open={renameFolderModal.open} onOpenChange={closeRenameFolderModal}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Ordner umbenennen</DialogTitle>
                </DialogHeader>
                <Input
                    autoFocus
                    placeholder="Neuer Ordnername"
                    value={newName}
                    onChange={(e) => setNewName(e.target.value)}
                />
                <div className="flex justify-end gap-2 mt-4">
                    <Button variant="secondary" onClick={closeRenameFolderModal}>
                        Abbrechen
                    </Button>
                    <Button onClick={handleRename} disabled={!newName.trim()}>
                        Speichern
                    </Button>
                </div>
            </DialogContent>
        </Dialog>
    );
}
