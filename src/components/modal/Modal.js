import React from 'react';
import "./Modal.scss";

class Modal extends React.Component {
	render() {
		const props = this.props;

		if (!props.show) {
			document.body.style.overflowY = 'unset';
			document.body.classList.remove('no-scroll');

			//return null;
		}

		document.body.style.overflowY = 'hidden';
		document.body.classList.add('no-scroll');

		return (
			<div className={`modal${props.show ? ' is-active' : ''}`}>
				<div className="modal__overlay" onClick={props.onClose}/>
				<div className="modal__wrap">
					<div className="modal__header">
						<div className="modal__title">{props.title}</div>
						<div className="modal__close" onClick={props.onClose}>
							<span/>
							<span/>
						</div>
					</div>
					<div className="modal__data">
						{props.children}
					</div>
				</div>
			</div>
		);
	}
}

export default Modal;