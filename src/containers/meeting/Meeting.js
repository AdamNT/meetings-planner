import React, { Component, Fragment } from 'react';

import { 
	Modal,
	MeetingList,
	NewMeeting
} from "../../components";
import "./Meeting.scss";

if( localStorage.getItem('meetingId') === null ) {
	localStorage.setItem('meetingId', 1);	
}

const defaultFormState = {
	ID: 0,
	title: '',
	description: '',
	date: {
		from: new Date(),
		to: new Date(),
	},
	actionType: 'new',
	formActionName: 'Save the meeting'
}

class Meeting extends Component {
	constructor(props) {
		super(props);

		this.state = {
			...defaultFormState,
			filter: {
				dateFrom: new Date(),
				dateTo: new Date(),
				isFiltered: false,
			},
			meetings: [],
			meetingIdDelete: 0,

			modalDelete: {
				title: 'Delete meeting',
				isOpen: false,
			},
			modalMeeting: {
				title: 'New meeting',
				isOpen: false,
			}
		}
	}

	async componentDidMount() {
		this.loadMeetings();
	}

	loadMeetings = async () => {
		const meetings = JSON.parse(localStorage.getItem('meetings'));

		if (meetings) {
			await this.setState((prevState) => ({
				...prevState,
				meetings
			}));
		}
	}

	changeDate = (state) => (date) => {
		this.setState(prevState => ({
			...prevState,
			date: {
				...prevState.date,
				[state]: date
			}
		}));
	};

	changeDateFilter = (state) => (date) => {
		this.setState(prevState => ({
			...prevState,
			filter: {
				...prevState.filter,
				[state]: date
			}
		}));
	};

	handleChange = async (e) => {
		const {
			target: {
				name,
				value
			}
		} = e;

		await this.setState((prevState) => ({
			...prevState,
			[name]: value
		}));
	}

	saveMeeting = async (e) => {
		e.preventDefault();
		const { ID, title, description, date, meetings, actionType } = this.state;

		if(actionType === 'new') {
			let meetingId = localStorage.getItem('meetingId');

			const meeting = {
				ID: Number(meetingId),
				title: title,
				description: description,
				date: {
					from: date.from,
					to: date.to
				}
			}

			await this.setState((prevState) => ({
				...prevState,
				title: '',
				description: '',
				date: {
					from: new Date(),
					to: new Date()
				},
				meetings: [...prevState.meetings, meeting]
			}));

			localStorage.setItem('meetingId', Number(meetingId) + 1);
		} else {
			meetings.map((meeting) => {
				if(meeting.ID === ID) {
					meeting.title = title;
					meeting.description = description;
					meeting.date.from = date.from;
					meeting.date.to = date.to;
				};

				return null;
			});
		}

		localStorage.setItem('meetings', JSON.stringify(this.state.meetings));     
		this.toggleModalShow('modalMeeting');
	}

	addMeeting = async () => {
		await this.setState((prevState) => ({
			...prevState,
			...defaultFormState,
			modalMeeting: {
				...prevState.modalMeeting,
				title: 'New meeting'
			}
		}));

		this.toggleModalShow('modalMeeting');
	}

	editMeeting = async (meeting, e) => {
		e.stopPropagation();

		await this.setState((prevState) => ({
			...prevState,
			ID: meeting.ID,
			title: meeting.title,
			description: meeting.description,
			date: {
				...prevState.date,
				from: new Date(meeting.date.from),
				to: new Date(meeting.date.to)
			},
			actionType: 'edit',
			formActionName: 'Save changes',
			modalMeeting: {
				...prevState.modalMeeting,
				title: 'Edit meeting'
			}
		}));

		this.toggleModalShow('modalMeeting');
	}

	prepereRemoveMeeting = async (meetingId, e) => {
		e.stopPropagation();
		this.toggleModalShow('modalDelete');

		await this.setState((prevState) => ({
			...prevState,
			meetingIdDelete: meetingId
		}))
	}

	removeMeeting = async () => {
		const meetings = JSON.parse(localStorage.getItem('meetings'));
		const { meetingIdDelete } = this.state;

		let filteredMeetings = meetings.filter((meeting) => {
			return meeting.ID !== meetingIdDelete;
		});

		await this.setState((prevState) => ({
			...prevState,
			meetings: filteredMeetings
		}));

		this.toggleModalShow('modalDelete');

		localStorage.setItem('meetings', JSON.stringify(filteredMeetings));
	}

	toggleMeeting = async (event) => {
		let parent = event.target.parentNode;
		let moreInfo = parent.querySelector('.meeting-list__more-info');
		let moreInfoScrollHeight = moreInfo.scrollHeight;

		if(moreInfo.classList.contains('is-active')) {
			moreInfo.style.maxHeight = `0px`;
		} else {
			moreInfo.style.maxHeight = `${moreInfoScrollHeight}px`;
		}

		moreInfo.classList.toggle('is-active');
	}

	toggleFilter = async (event) => {
		let filterOptions = document.querySelector('.filter-options');
		let filterOptionsScrollHeight = filterOptions.scrollHeight;
		
		event.target.classList.toggle('is-active');

		if(filterOptions.classList.contains('is-active')) {
			filterOptions.style.maxHeight = `0px`;
		} else {
			filterOptions.style.maxHeight = `${filterOptionsScrollHeight}px`;
		}

		filterOptions.classList.toggle('is-active');
	}

	filterMeetings = async () => {
		await this.setState((prevState) => ({
			...prevState,
			filter: {
				...prevState.filter,
				isFiltered: true
			}
		}));
	}

	clearFilterMeetings = async () => {
		await this.setState((prevState) => ({
			...prevState,
			filter: {
				...prevState.filter,
				isFiltered: false
			}
		}));
	}

	toggleModalShow = async (type) => {
		await this.setState((prevState) => ({
			...prevState,
			[type]: {
				...prevState[type],
				isOpen: !this.state[type].isOpen
			}
		}));
	};

	render() {
		const {
			title,
			description,
			date,
			formActionName,
			meetings,
			filter,
			activeMeetingId,
			modalMeeting,
			modalDelete
		} = this.state;

		return (
			<Fragment>
				<div className="container">
					<button
						className="btn btn--green-light"
						onClick={this.addMeeting}
					>
						Add meeting
					</button>

					<MeetingList
						meetings={meetings}
						activeMeetingId={activeMeetingId}
						filter={filter}
						toggleFilter={this.toggleFilter}
						toggleMeeting={this.toggleMeeting}
						editMeeting={this.editMeeting}
						prepereRemoveMeeting={this.prepereRemoveMeeting}
						changeDateFilter={this.changeDateFilter}
						filterMeetings={this.filterMeetings}
						clearFilterMeetings={this.clearFilterMeetings}
					/>			
				</div>
				
				<Modal
					show={modalMeeting.isOpen}
					onClose={() => this.toggleModalShow('modalMeeting')}
					title={modalMeeting.title}
				>
					<NewMeeting 
						title={title}
						description={description}
						date={date}
						formActionName={formActionName}

						saveMeeting={this.saveMeeting}
						handleChange={this.handleChange}
						changeDate={this.changeDate}
					/>
				</Modal>

				<Modal
					show={modalDelete.isOpen}
					onClose={() => this.toggleModalShow('modalDelete')}
					title={modalDelete.title}
				>
					<p>
						Are you sure you want to delete this meeting?<br/>
						Changes are not reversible.
					</p>

					<div className="btn-wrap">
						<button
							className="btn btn--gray btn--small"
							onClick={() => this.toggleModalShow('modalDelete')}
						>
							No
						</button>
						<button
							className="btn btn--red btn--small"
							onClick={this.removeMeeting}
						>
							Yes
						</button>
					</div>
				</Modal>
			</Fragment>
		);
	}
}

export default Meeting;