import { addDoc, collection } from 'firebase/firestore';
import React, { useState } from 'react';
import { db } from '../../firebase';
import './AddNote.css';

export const AddNote = ({ max, setNoteList }) => {
	const [noteDesc, setNoteDesc] = useState('');
	const [loading, setLoading] = useState(false);

	const onAddNote = async () => {
		try {
			if (!noteDesc) {
				return;
			}
			setLoading(true);

			let newNote = {
				description: noteDesc,
				position: max + 1,
				sticky: false
			};

			const res = await addDoc(collection(db, 'todoList'), newNote);

			setNoteList((currentList) => [
				...currentList,
				{ id: res.id, ...newNote },
			]);

			setNoteDesc('');
			setLoading(false);
		} catch (error) {
			console.log(error);
			return setLoading(false);
		}
	};

	return (
		<div className={`note-container`}>
			<textarea
				placeholder='Write description to add a new note'
				value={noteDesc}
				onChange={(e) => setNoteDesc(e.target.value)}
				className='note-input'
				rows={2}
			/>
			<button
				className='note-button'
				onClick={onAddNote}
				disabled={noteDesc ? false : true}
			>
				{loading ? (
					'loading...'
				) : (
					<span>
						Add
						<svg
							xmlns='http://www.w3.org/2000/svg'
							fill='none'
							viewBox='0 0 24 24'
							strokeWidth={1.5}
							stroke='currentColor'
							height={16}
							width={16}
						>
							<path
								strokeLinecap='round'
								strokeLinejoin='round'
								d='M12 4.5v15m7.5-7.5h-15'
							/>
						</svg>
					</span>
				)}
			</button>
		</div>
	);
};
