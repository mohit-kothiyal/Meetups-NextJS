import { MongoClient, ObjectId } from 'mongodb';
import Head from 'next/head';
import MeetupDetail from '../components/meetups/MeetupDetail';

const MeetupDetails = (props) => {
	return (
		<>
			<Head>
				<title>{props.meetupData.title}</title>
				<meta name="description" content={props.meetupData.description} />
			</Head>
			<MeetupDetail
				image={props.meetupData.image}
				title={props.meetupData.title}
				address={props.meetupData.address}
				description={props.meetupData.description}
			/>
		</>
	);
};
export const getStaticPaths = async () => {
	const client = await MongoClient.connect(
		`mongodb+srv://mohit:mohit@cluster0.ohtnj.mongodb.net/meetups?retryWrites=true&w=majority`
	);
	const db = client.db();
	const meetupCollection = db.collection('meetups');

	const meetups = await meetupCollection.find({}, { _id: 1 }).toArray(); //first arg defines that no filter is added second argument defines which fields should be extracted
	client.close();
	return {
		fallback: 'blocking',
		paths: meetups.map((meetup) => ({
			params: { meetupId: meetup._id.toString() }, //dynamically generating arraay of paths
		})),
	};
};
export const getStaticProps = async (context) => {
	const meetupId = context.params.meetupId;
	const client = await MongoClient.connect(
		`mongodb+srv://mohit:mohit@cluster0.ohtnj.mongodb.net/meetups?retryWrites=true&w=majority`
	);
	const db = client.db();
	const meetupCollection = db.collection('meetups');
	const selectedMeetup = await meetupCollection.findOne({
		_id: ObjectId(meetupId),
	});

	client.close();
	return {
		props: {
			meetupData: {
				id: selectedMeetup._id.toString(),
				title: selectedMeetup.title,
				image: selectedMeetup.image,
				address: selectedMeetup.address,
				description: selectedMeetup.description,
			},
		},
	};
};
export default MeetupDetails;
