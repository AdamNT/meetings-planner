import React from 'react';

import DatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";
import "./NewMeeting.scss";


const NewMeeting = ({
	title,
	description,
	date,
	formActionName,

	saveMeeting,
	handleChange,
	changeDate
}) => (
	<form
		className="new-meeting" 
		onSubmit={saveMeeting}
	>
		<div className="form__group">
			<label className="label label--left">
				<div className="name">
					Title:
				</div>
				<input
					className="input"
					type="text"
					name="title"
					value={title}
					onChange={handleChange}
				/>
			</label>
		</div>
		<div className="form__group">
			<label className="label label--left">
				<div className="name">
					Description:
				</div>
				<textarea
					className="textarea"
					name="description"
					value={description}
					onChange={handleChange}
				/>
			</label>
		</div>
		<div className="form__group">
			<div className="label label--left">
				<div className="name">
					Date:
				</div>
				<div className="datepicker-range">
					<DatePicker
						selected={date.from}
						onChange={changeDate('from')}
						minDate={new Date()}
						dateFormat="dd.MM.YYYY HH:mm"
						showTimeSelect
					/>
					<DatePicker
						selected={date.to}
						onChange={changeDate('to')}
						minDate={new Date()}
						dateFormat="dd.MM.YYYY HH:mm"
						showTimeSelect
					/>
				</div>
			</div>
		</div>

		<div className="btn-wrap">
			<input 
				className="btn btn--green-light full-width"
				type="submit"
				value={formActionName}
			/>
		</div>
	</form>
);

export default NewMeeting;