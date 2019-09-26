import React from 'react';
import { format } from 'date-fns';
import DatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";
import "./MeetingList.scss";


const RenderMeetingList = ({
	meetings,
	activeMeetingId,
	filter,
	toggleMeeting,
	editMeeting,
	prepereRemoveMeeting
}) => {
	meetings.sort((a, b) => {
		return new Date(a.date.from) - new Date(b.date.from);
	});

	if(filter.isFiltered) {
		meetings = meetings.filter((meeting) => {
			return (new Date(meeting.date.from) >= new Date(filter.dateFrom) && new Date(filter.dateTo) <= new Date(meeting.date.to));
		});
	}

	if (meetings.length !== 0) {
		return (
			<div className="meeting-list">
				<div className="meeting-list__header">
					<div className="meeting-list__column meeting-list__column--id">
						<b>ID</b>
					</div>
					<div className="meeting-list__column meeting-list__column--title">
						Title
					</div>
					<div className="meeting-list__column meeting-list__column--date-from">
						Date from
					</div>
					<div className="meeting-list__column meeting-list__column--hour-from">
						Hour from
					</div>
					<div className="meeting-list__column meeting-list__column--hour-to">
						Hour to
					</div>
					<div className="meeting-list__column meeting-list__column--date-to">
						Date to
					</div>
					<div className="meeting-list__column meeting-list__column--action">
						Action
					</div>
				</div>
				<div className="meeting-list__body">
					{meetings.map((meeting, index) => {
						let dateFrom = meeting.date.from;
						let dateTo = meeting.date.to;

						return (
							<div
								className="meeting-list__row"
								key={index}
								onClick={toggleMeeting}
							>
								<div className="meeting-list__column meeting-list__column--id">
									#{meeting.ID}
								</div>
								<div className="meeting-list__column meeting-list__column--title">
									{(meeting.title.length > 32) ? `${meeting.title.substr(0, 32)}...` : meeting.title}
								</div>
								<div className="meeting-list__column meeting-list__column--date-from">
									{format(new Date(dateFrom), 'dd.MM.yyyy')}
								</div>
								<div className="meeting-list__column meeting-list__column--hour-from">
									{format(new Date(dateFrom), 'HH:mm')}
								</div>
								<div className="meeting-list__column meeting-list__column--hour-to">
									{format(new Date(dateTo), 'HH:mm')}
								</div>
								<div className="meeting-list__column meeting-list__column--date-to">
									{format(new Date(dateTo), 'dd.MM.yyyy')}
								</div>
								<div className="meeting-list__column meeting-list__column--action">
									<div className="btn-wrap">
										<div
											className="btn btn--orange btn--icon-left btn--edit btn--only-icon"
											onClick={(e) => editMeeting(meeting, e)}
										>
										</div>
										<div
											className="btn btn--red btn--icon-left btn--delete btn--only-icon"
											onClick={(e) => prepereRemoveMeeting(meeting.ID, e)}
										>
										</div>
									</div>
								</div>

								<div
									className={`meeting-list__more-info ${(activeMeetingId === meeting.ID) ? 'is-active' : ''}`}
									onClick={(e) => {e.stopPropagation()}}
								>
									<div className="more-info__wrappper">
										{meeting.description}
									</div>
								</div>
							</div>
						);
					})}
				</div>
			</div>
		);
	}

	return `There are no meetings on the list`;
}

const MeetingList = (props) => {
	return (
		<section className="section section--meeting-list">
			<div className="section__header flex-justify-beetwen">
				<h2 className="section__title">
					Your list of meetings:
				</h2>
				<div className="filter">
					<div
						className={`btn btn--gray-dark btn--icon-left btn--filter btn--only-icon ${props.filter.isFiltered ? 'is-filtered' : ''}`}
						onClick={props.toggleFilter}
					>
					</div>
				</div>
			</div>
			<div className="filter-options">
				<div className="filter-list">
					<div className="filter-list__item">
						<div className="form__group">
							<div className="label">
								<div className="name">
									Filter by date range:
								</div>
								<div className="datepicker-range">
									<DatePicker
										selected={props.filter.dateFrom}
										onChange={props.changeDateFilter('dateFrom')}
										minDate={new Date()}
										dateFormat="dd.MM.YYYY HH:mm"
										showTimeSelect
									/>
									<DatePicker
										selected={props.filter.dateTo}
										onChange={props.changeDateFilter('dateTo')}
										minDate={new Date()}
										dateFormat="dd.MM.YYYY HH:mm"
										showTimeSelect
									/>
								</div>
							</div>
						</div>
					</div>
				</div>
				<div className="filter-search btn-wrap">
					<div 
						className="btn btn--green-light"
						onClick={props.filterMeetings}
					>
						Filter
					</div>
					<div 
						className="btn btn--gray-dark"
						onClick={props.clearFilterMeetings}
					>
						Clear filter
					</div>
				</div>
			</div>

			<div className="section__content">
				<RenderMeetingList {...props} />
			</div>
		</section>
	);
}

export default MeetingList;