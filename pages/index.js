import { MongoClient } from 'mongodb';
import MeetupList from '../components/meetups/MeetupList';
import Head from 'next/head';

const HomePage = (props) => {
	return (
		<>
			<Head>
				<title>React Meetups</title>
				<meta name="description" content="This is React Meetup Description" />
			</Head>
			<MeetupList meetups={props.meetups} />
		</>
	);
};

export const getStaticProps = async () => {
	const client = await MongoClient.connect(
		`mongodb+srv://mohit:mohit@cluster0.ohtnj.mongodb.net/meetups?retryWrites=true&w=majority`
	);
	const db = client.db();
	const meetupCollection = db.collection('meetups');
	const meetups = await meetupCollection.find().toArray();
	client.close();

	return {
		props: {
			meetups: meetups.map((meetup) => ({
				title: meetup.title,
				image: meetup.image,
				address: meetup.address,
				description: meetup.description,
				id: meetup._id.toString(),
			})),
		},
		revalidate: 1,
	};
};
export default HomePage;
