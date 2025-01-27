// import BgSecure from 'bg-secure';
import BgSecure, { SecureOverlay } from 'bg-secure';
import { useEvent } from 'expo';
import { LinearGradient } from 'expo-linear-gradient';
import { useEffect, useState } from 'react';
import {
	Button,
	SafeAreaView,
	ScrollView,
	Text,
	TextInput,
	View,
	Image,
	Platform,
} from 'react-native';

// @ts-ignore
import image from './assets/secure_screen.png';

export default function App() {
	const [enabled, setEnabled] = useState(false);
	const [inputText, setInputText] = useState('');

	// /** example using the listener */
	// useEffect(() => {
	// 	const subscription = BgSecure.addListener('userDidTakeScreenshot');

	// 	return () => {
	// 		subscription.remove();
	// 	};
	// }, []);
	console.log('🚀 ~ App ~ inputText:', inputText);

	const handleEnable = () => {
		setEnabled(true);
		try {
			console.log('Enabling secure mode...');
			if (Platform.OS === 'ios') {
				const resolvedImage = Image.resolveAssetSource(image);
				console.log('Image source:', resolvedImage);
				// Pass the local file path
				BgSecure.enableSecureView(
					resolvedImage.uri.replace('file://', '')
				);
			} else {
				BgSecure.enableSecureView();
			}
		} catch (error) {
			console.error('Error in handleEnable:', error);
		}
	};

	const handleDisable = () => {
		setEnabled(false);
		try {
		} catch (error) {
			console.error('Error in handleDisable:', error);
		}
	};

	return (
		<SafeAreaView style={styles.container}>
			<ScrollView style={styles.container}>
				<Text style={styles.header}>Module API Example</Text>
				<Group name="Text Input">
					<TextInput
						style={styles.input}
						value={inputText}
						onChangeText={setInputText}
						placeholder="Enter text here"
					/>
					<Text>You entered: {inputText}</Text>
				</Group>
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
			<SecureOverlay image={image} backgroundColor="#000">
				<LinearGradient
					colors={['#003D65', '#007FAD']}
					style={{
						flex: 1,
						justifyContent: 'center',
						alignItems: 'center',
					}}
					start={{ x: 0, y: 0 }}
					end={{ x: 0, y: 1 }}
				>
					{image ? (
						<Image
							source={image}
							style={{ flex: 1, width: '80%' }}
							resizeMode="contain"
						/>
					) : null}
				</LinearGradient>
			</SecureOverlay>
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
	input: {
		height: 40,
		borderColor: 'gray',
		borderWidth: 1,
		borderRadius: 5,
		padding: 10,
		marginBottom: 10,
	},
};
