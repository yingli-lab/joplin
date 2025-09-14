import { CommandRuntime, CommandDeclaration, CommandContext } from '@joplin/lib/services/CommandService';
import { _ } from '@joplin/lib/locale';
import { NoteEntity } from '@joplin/lib/services/database/types';

export const declaration: CommandDeclaration = {
	name: 'scrollToSelectedNote',
	label: () => _('Scroll to selected note'),
};

type MakeVisibleFn = (index: number)=> void;

export const runtime = (
	makeItemIndexVisible: MakeVisibleFn,
	getNotes: ()=> Pick<NoteEntity, 'id'>[],
): CommandRuntime => {
	return {
		async execute(_context: CommandContext, noteId?: string) {
			if (!noteId) return;
			const notes = getNotes();
			const idx = notes.findIndex(n => n.id === noteId);
			if (idx >= 0) {
				makeItemIndexVisible(idx);
				// Electron/Chromium sometimes needs a second tick:
				requestAnimationFrame(() => makeItemIndexVisible(idx));
			}
		},
	};
};
