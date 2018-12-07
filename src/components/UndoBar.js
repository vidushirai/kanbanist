import React from 'react';
import { types, actions } from '../redux/modules/lists';

export default class UndoBar extends React.Component {
	static cancelled = false;
	
	//Function called when the undo button is pressed 
	undoCheck = () => {
		UndoBar.hideBar();
		UndoBar.cancelled = true;   
	};

	//Function to convert action type that was just performed into a user-friendly string
	static convertString = (string) => {
		switch(string){
			case types.MOVE_TO_LIST:
				return "List item moved";
			case types.COMPLETE_LIST_ITEM:
				return "1 item marked as completed";
			case types.ADD_LIST_ITEM:
				return "1 item added";
			case types.DELETE_LIST:
				return "List deleted";
			case types.UPDATE_LIST_ITEM:
				return "1 item updated";
			case types.COMPLETE_LIST:
				return "Entire list marked as completed";
			case types.ADD_NEW_LIST:
				return "New list created";
			case types.RENAME_LIST:
				return "List renamed";
			case types.REORDER_LIST:
				return "List reordered";
			default:
				//Nothing
		}
	};

	//Function that returns the status of cancelled 
	static isCancelled = () => { 
		return UndoBar.cancelled; 
	};

	//Function that hides the undo bar 
	static hideBar = () => {document.getElementsByClassName("UndoBar")[0].style.display = "none"; };
	
	//Function that displays the undo bar
	static showBar = (string) => {
		UndoBar.cancelled = false; 
		document.getElementById("undoString").innerText = UndoBar.convertString(string);
		document.getElementsByClassName("UndoBar")[0].style.display = "block"; 
	};

	render() {
		return (
			<div className="UndoBar">
				<div className="UndoBarContainer">
					<p id="undoString"></p>
					<a onClick={this.undoCheck}>Undo</a>
					<a onClick={() => document.getElementsByClassName("UndoBar")[0].style.display = "none"}>Hide</a>
				</div>
			</div>
		);
	}
}