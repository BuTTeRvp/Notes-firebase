import {
	collection,
	deleteDoc,
	doc,
	getDocs,
	updateDoc,
} from 'firebase/firestore';
import React, { useEffect, useState } from 'react';
import { db } from '../../firebase';
import { AddNote } from '../AddNote/AddNote';
import { SingleNote } from '../SingleNote/SingleNote';
import "./Note.css"

export const Notes = () => {
	const [noteList, setNoteList] = useState([]);

	useEffect(() => {
		const getNotes = async () => {
			try {
				const col = collection(db, 'todoList');
				const snapshot = await getDocs(col);
				const list = snapshot.docs.map((item) => {
					return { id: item.id, ...item.data() };
				});
				setNoteList(list);
			} catch (error) {
				setNoteList([]);
			}
		};
		getNotes();
	}, [noteList]);

	const moveItem = async (direction, currentItem) => {
		console.log(currentItem, noteList);
		try {
			let currentIndex = noteList.findIndex((i) => i.id === currentItem.id);
			let updateItem  
				if (direction === 'up'){
					updateItem = noteList.slice(0, currentIndex).reverse().filter(x => x.sticky === false)[0];
					console.log(updateItem)
					// updateItem = noteList[currentIndex - 1]
				}else{
					updateItem = noteList.slice(currentIndex + 1).filter(x => x.sticky === false)[0];
					// updateItem = noteList[currentIndex + 1];
				}
			 
				


			await updateDoc(doc(db, 'todoList', currentItem.id), {
				...currentItem,
				position: updateItem.position,
			});
			await updateDoc(doc(db, 'todoList', updateItem.id), {
				...updateItem,
				position: currentItem.position,
			});
			setNoteList((currentList) =>
				currentList.map((item) => {
					if (item.id === currentItem.id) {
						return { ...currentItem, position: updateItem.position };
					}
					if (item.id === updateItem.id) {
						return { ...updateItem, position: currentItem.position };
					}
					return item;
				})
			);
		} catch (error) {
			console.log(error);
		}
	};

	const deleteItem = async (id) => {
		try {
			await deleteDoc(doc(db, 'todoList', id));
			setNoteList((currentList) =>
				currentList.filter((item) => item.id !== id)
			);
		} catch (error) {}
	};

	const setSticky = async(note) => {
			await updateDoc(doc(db, 'todoList', note.id), {
				...note,
				sticky: true,});			
	};

	return (
		<div className='note'>
			{noteList &&
				noteList.length > 0 &&
				noteList
					.sort((a, b) => a.position - b.position)
					.map((noteItem, index) => {
						return (
							<SingleNote
								note={noteItem}
								key={noteItem?.id}
								moveItem={moveItem}
								index={index}
								max={noteList.length}
								deleteItem={deleteItem}
								setSticky={setSticky}
							/>
						);
					})}
			<AddNote
				max={noteList.length === 0 ? 1 : noteList[noteList.length - 1].position}
				setNoteList={setNoteList}
			/>
		</div>
	);
};
