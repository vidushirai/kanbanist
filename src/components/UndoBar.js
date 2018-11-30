import React from 'react';

export default class UndoBar extends React.Component {
	static cancelled = false;
	
	undoCheck = () => {
		UndoBar.hideBar();
		UndoBar.cancelled = true;
	};

	static isCancelled = () => { return UndoBar.cancelled; };
	static hideBar = () => {document.getElementsByClassName("UndoBar")[0].style.display = "none"; };
	static showBar = (string) => {
		UndoBar.cancelled = false; 
		document.getElementById("undoString").innerText = string;
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