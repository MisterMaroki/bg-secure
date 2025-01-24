import BgSecure from 'bg-secure';
import { useEvent } from 'expo';
import { useState } from 'react';
import { Button, SafeAreaView, ScrollView, Text, View } from 'react-native';

export default function App() {
	const [enabled, setEnabled] = useState(false);

	const handleEnable = () => {
		setEnabled(true);
		try {
			console.log('Setting background color...');
			BgSecure.setBackgroundColor('#000000');
			console.log('Enabling secure mode...');
			BgSecure.enabled(true);
		} catch (error) {
			console.error('Error:', error);
		}
	};

	const handleDisable = () => {
		setEnabled(false);
		BgSecure.enabled(false);
	};

	return (
		<SafeAreaView style={styles.container}>
			<ScrollView style={styles.container}>
				<Text style={styles.header}>Module API Example</Text>
				<Group name="Secure View">
					<Text>{enabled ? 'Enabled' : 'Disabled'}</Text>
					<Button title="Enable" onPress={handleEnable} />
					<Button title="Disable" onPress={handleDisable} />
				</Group>
				{/* <Group name="Constants">
					<Text>{BgSecure.PI}</Text>
				</Group>
				<Group name="Functions">
					<Text>{BgSecure.hello()}</Text>
				</Group>
				<Group name="Async functions">
					<Button title="Set value" onPress={async () => {}} />
				</Group> */}
			</ScrollView>
		</SafeAreaView>
	);
}

function Group(props: { name: string; children: React.ReactNode }) {
	return (
		<View style={styles.group}>
			<Text style={styles.groupHeader}>{props.name}</Text>
			{props.children}
		</View>
	);
}

const styles = {
	header: {
		fontSize: 30,
		margin: 20,
	},
	groupHeader: {
		fontSize: 20,
		marginBottom: 20,
	},
	group: {
		margin: 20,
		backgroundColor: '#fff',
		borderRadius: 10,
		padding: 20,
	},
	container: {
		flex: 1,
		backgroundColor: '#eee',
	},
	view: {
		flex: 1,
		height: 200,
	},
};
