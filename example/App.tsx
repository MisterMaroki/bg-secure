import { Button, SafeAreaView, ScrollView, Text, View } from 'react-native';
import { useEffect } from 'react';
import {
	enableAppSwitcherProtectionAsync,
	enableSecureViewAsync,
	PrivacyOverlayCleanup,
} from '../src';

export default function App() {
	useEffect(() => {
		enableAppSwitcherProtectionAsync();
	}, []);

	useEffect(() => {
		enableSecureViewAsync();
	}, []);
	return (
		<PrivacyOverlayCleanup>
			<SafeAreaView style={styles.container}>
				<ScrollView style={styles.container}>
					<Text style={styles.header}>Module API Example</Text>

					<Group name="Async functions">
						<Button title="Set value" onPress={async () => {}} />
					</Group>
				</ScrollView>
			</SafeAreaView>
		</PrivacyOverlayCleanup>
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
