import React from 'react';

export default class UndoBar extends React.Component {

	undoCheck = () => {
		document.getElementsByClassName("UndoBar")[0].style.display = "none";
		this.props.onUndo();
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