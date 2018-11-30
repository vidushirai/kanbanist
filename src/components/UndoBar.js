import React from 'react';

export default class UndoBar extends React.Component {
	static cancelled = false;
	
	undoCheck = () => {
		UndoBar.hideBar();
		UndoBar.cancelled = true;
	};

	static isCancelled = () => { return UndoBar.cancelled; };
	static hideBar = () => {document.getElementsByClassName("UndoBar")[0].style.display = "none"; };
	static showBar = () => {
		UndoBar.cancelled = false; 
		document.getElementsByClassName("UndoBar")[0].style.display = "block"; 
	};

	render() {
		return (
			<div className="UndoBar">
				<div className="UndoBarContainer">
					<p>1 item marked as completed</p>
					<a onClick={this.undoCheck}>Undo</a>
					<a onClick={() => document.getElementsByClassName("UndoBar")[0].style.display = "none"}>Hide</a>
				</div>
			</div>
		);
	}
}