import React, { useState, useRef } from "react"
import {
	View,
	StyleSheet,
	Dimensions,
	Text,
	TouchableOpacity,
	TextInput,
	Keyboard,
	TouchableWithoutFeedback,
} from "react-native"
import Svg, {
	G,
	Path,
	Defs,
	LinearGradient as SvgLinearGradient,
	Stop,
	ClipPath,
	Rect,
	RadialGradient,
	Circle,
} from "react-native-svg"

const { width } = Dimensions.get("window")

const isValidEmail = (email: string): boolean => {
	const emailPattern =
		/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
	return emailPattern.test(email.toLowerCase())
}

// pass code
type InputProps = {
	length?: number
	onComplete: (pin: string) => void
}

const OTPInput = ({ length = 6, onComplete }: InputProps) => {
	const inputRef = useRef<Array<TextInput | null>>(Array(length).fill(null))
	const [OTP, setOTP] = useState<Array<string>>(Array(length).fill(""))
	const [currentInput, setCurrentInput] = useState(-1)

	const handleTextChange = (input: string, index: number) => {
		const newPin = [...OTP]
		newPin[index] = input.replace(/[^0-9]/g, "")
		setOTP(newPin)

		if (input) {
			if (index < length - 1) {
				inputRef.current[index + 1]?.focus()
			}
		} else {
			if (index > 0 && newPin.slice(0, index).some((digit) => digit !== "")) {
				inputRef.current[index - 1]?.focus()
			}
		}
		if (newPin.every((digit) => digit !== "")) {
			onComplete(newPin.join(""))
		}
	}

	const handleKeyPress = ({
		nativeEvent: { key },
		index,
	}: {
		nativeEvent: { key: string }
		index: number
	}) => {
		if (key === "Backspace" && index > 0 && OTP[index] === "") {
			const newOTP = [...OTP]
			newOTP[index - 1] = ""
			setOTP(newOTP)
			inputRef.current[index - 1]?.focus()
		}
	}

	return (
		<TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
			<View style={styles.numberBoxContainer}>
				{Array.from({ length }, (_, index) => (
					<TextInput
						key={index}
						keyboardType="numeric"
						maxLength={1}
						onChangeText={(text) => handleTextChange(text, index)}
						onKeyPress={(e) =>
							handleKeyPress({ nativeEvent: e.nativeEvent, index })
						}
						onFocus={() => setCurrentInput(index)}
						style={[
							styles.numberBox,
							index !== length - 1 ? { marginRight: 10 } : {},
							currentInput === index ? styles.currentInputColor : {},
						]}
						ref={(el) => (inputRef.current[index] = el)}
					/>
				))}
			</View>
		</TouchableWithoutFeedback>
	)
}

export default function TabTwoScreen() {
	const [email, setEmail] = useState("")
	const [isSubmitted, setIsSubmitted] = useState(false)

	return (
		<View style={styles.container}>
			<Svg
				height="25%"
				width="100%"
				style={styles.svgBackground}
				viewBox="0 0 100 25"
			>
				<Defs>
					<RadialGradient
						id="grad"
						cx="50"
						cy="0"
						rx="190"
						ry="90"
						gradientUnits="userSpaceOnUse"
					>
						<Stop offset="0" stopColor="rgb(25, 53, 92)" stopOpacity="0.5" />
						<Stop
							offset="0.32"
							stopColor="rgba(15, 15, 15, 0.5)"
							stopOpacity="0.3"
						/>
					</RadialGradient>
				</Defs>
				<Circle cx="50" cy="0" r="90" fill="url(#grad)" />
			</Svg>

			<TouchableOpacity style={{ marginTop: 28 }}>
				<Svg width="30" height="30" viewBox="0 0 30 30" fill="none">
					<Defs>
						<ClipPath id="clip0">
							<Rect width="30" height="30" fill="white" />
						</ClipPath>
						<SvgLinearGradient
							id="paint0_linear"
							x1="23.9069"
							y1="2.74376"
							x2="5.97898"
							y2="27.3127"
							gradientUnits="userSpaceOnUse"
						>
							<Stop stopColor="#fff" stopOpacity="0" />
							<Stop offset="1" stopColor="#87CEEB" />
						</SvgLinearGradient>
					</Defs>
					<G clip-path="url(#clip0_6171_11647)">
						<G opacity="0.4">
							<Path
								fill-rule="evenodd"
								clip-rule="evenodd"
								d="M21.0774 28.966C22.2814 28.4786 23.3992 27.8248 24.4013 27.0309C23.3256 27.824 22.8348 28.1863 21.4662 28.855C21.1727 28.9845 20.7824 29.1589 20.4853 29.2776C20.7365 29.1817 20.9374 29.0775 21.0774 28.966ZM21.0774 28.966C21.9864 28.2464 20.0192 27.5006 16.6817 27.3016C13.3448 27.1024 9.9018 27.5248 8.99205 28.2455C8.53701 28.6055 8.80306 28.9727 9.60037 29.2735C8.6536 28.8758 8.53233 28.8244 7.84622 28.4597C6.75598 27.8168 6.58864 27.7185 5.73829 27.0742L4.92895 26.3942C4.52711 26.0366 4.52629 25.6534 5.00409 25.274C6.51342 24.0787 12.2281 23.3778 17.7669 23.708C23.2105 24.0331 26.4585 25.2334 25.1367 26.4094L24.4013 27.0309C23.3992 27.8248 22.2814 28.4786 21.0774 28.966ZM28.3502 22.3353C29.1145 20.9354 25.0443 19.584 18.5572 19.1967C11.4131 18.7709 4.04392 19.6752 2.0973 21.2168C1.63071 21.5863 1.51768 21.9584 1.71368 22.3174L1.2464 21.3808C0.660479 19.9547 0.637022 19.8993 0.410036 19.0759C0.289952 18.5604 0.131846 17.8708 0.042702 17.3489C-0.0062043 17.0334 0.160604 16.7104 0.565483 16.3893C2.74288 14.6655 10.9833 13.6538 18.9712 14.1302C25.8055 14.5389 30.2406 15.9033 30.0172 17.3685C29.922 17.8609 29.798 18.5172 29.6766 19.0027C29.2101 20.51 29.2008 20.5387 28.8557 21.3131L28.3502 22.3353ZM29.8822 11.9702C29.6048 10.6126 25.3285 9.38692 18.9362 9.00544C11.0154 8.53218 2.84341 9.53532 0.685198 11.2447C0.387371 11.4802 0.219644 11.7166 0.172551 11.951C0.309024 11.3893 0.501779 10.6417 0.674586 10.0903C1.23582 8.62642 1.24656 8.59884 1.64104 7.8504L2.07346 7.08959C2.1496 6.96518 2.26624 6.83897 2.424 6.71374C4.3208 5.21178 11.4998 4.33054 18.4589 4.74618C23.6905 5.05808 27.3088 6.0137 27.9769 7.10736L28.4103 7.86864C29.075 9.24824 29.1011 9.30198 29.3787 10.1094C29.5426 10.6635 29.7529 11.4062 29.8822 11.9702ZM24.5614 3.1821C23.6802 2.47343 21.1307 1.88047 17.6189 1.66987C12.3587 1.35668 6.93178 2.02235 5.4981 3.15763C5.49112 3.16281 5.48584 3.16755 5.47943 3.17257L5.65635 3.03037C6.60025 2.33439 7.22287 1.87498 8.59112 1.20633C9.52296 0.795491 9.62008 0.752916 10.3398 0.509223C11.6389 0.0845342 14.0977 -0.130655 16.4966 0.0123293C17.8065 0.0906479 18.8805 0.262207 19.6052 0.485844C20.3836 0.756101 20.568 0.819981 21.3393 1.16385C22.379 1.68628 22.5954 1.79488 23.5706 2.43791C23.8691 2.65971 24.2726 2.94884 24.5614 3.1821Z"
								fill="white"
								fill-opacity="0.5"
							/>
							<Path
								fill-rule="evenodd"
								clip-rule="evenodd"
								d="M21.0774 28.966C22.2814 28.4786 23.3992 27.8248 24.4013 27.0309C23.3256 27.824 22.8348 28.1863 21.4662 28.855C21.1727 28.9845 20.7824 29.1589 20.4853 29.2776C20.7365 29.1817 20.9374 29.0775 21.0774 28.966ZM21.0774 28.966C21.9864 28.2464 20.0192 27.5006 16.6817 27.3016C13.3448 27.1024 9.9018 27.5248 8.99205 28.2455C8.53701 28.6055 8.80306 28.9727 9.60037 29.2735C8.6536 28.8758 8.53233 28.8244 7.84622 28.4597C6.75598 27.8168 6.58864 27.7185 5.73829 27.0742L4.92895 26.3942C4.52711 26.0366 4.52629 25.6534 5.00409 25.274C6.51342 24.0787 12.2281 23.3778 17.7669 23.708C23.2105 24.0331 26.4585 25.2334 25.1367 26.4094L24.4013 27.0309C23.3992 27.8248 22.2814 28.4786 21.0774 28.966ZM28.3502 22.3353C29.1145 20.9354 25.0443 19.584 18.5572 19.1967C11.4131 18.7709 4.04392 19.6752 2.0973 21.2168C1.63071 21.5863 1.51768 21.9584 1.71368 22.3174L1.2464 21.3808C0.660479 19.9547 0.637022 19.8993 0.410036 19.0759C0.289952 18.5604 0.131846 17.8708 0.042702 17.3489C-0.0062043 17.0334 0.160604 16.7104 0.565483 16.3893C2.74288 14.6655 10.9833 13.6538 18.9712 14.1302C25.8055 14.5389 30.2406 15.9033 30.0172 17.3685C29.922 17.8609 29.798 18.5172 29.6766 19.0027C29.2101 20.51 29.2008 20.5387 28.8557 21.3131L28.3502 22.3353ZM29.8822 11.9702C29.6048 10.6126 25.3285 9.38692 18.9362 9.00544C11.0154 8.53218 2.84341 9.53532 0.685198 11.2447C0.387371 11.4802 0.219644 11.7166 0.172551 11.951C0.309024 11.3893 0.501779 10.6417 0.674586 10.0903C1.23582 8.62642 1.24656 8.59884 1.64104 7.8504L2.07346 7.08959C2.1496 6.96518 2.26624 6.83897 2.424 6.71374C4.3208 5.21178 11.4998 4.33054 18.4589 4.74618C23.6905 5.05808 27.3088 6.0137 27.9769 7.10736L28.4103 7.86864C29.075 9.24824 29.1011 9.30198 29.3787 10.1094C29.5426 10.6635 29.7529 11.4062 29.8822 11.9702ZM24.5614 3.1821C23.6802 2.47343 21.1307 1.88047 17.6189 1.66987C12.3587 1.35668 6.93178 2.02235 5.4981 3.15763C5.49112 3.16281 5.48584 3.16755 5.47943 3.17257L5.65635 3.03037C6.60025 2.33439 7.22287 1.87498 8.59112 1.20633C9.52296 0.795491 9.62008 0.752916 10.3398 0.509223C11.6389 0.0845342 14.0977 -0.130655 16.4966 0.0123293C17.8065 0.0906479 18.8805 0.262207 19.6052 0.485844C20.3836 0.756101 20.568 0.819981 21.3393 1.16385C22.379 1.68628 22.5954 1.79488 23.5706 2.43791C23.8691 2.65971 24.2726 2.94884 24.5614 3.1821Z"
								fill="#2358E0"
								fill-opacity="0.1"
							/>
						</G>
						<Path
							fill-rule="evenodd"
							clip-rule="evenodd"
							d="M27.9987 7.21638L27.9694 7.16485C27.9799 7.18199 27.9897 7.19915 27.9987 7.21638ZM2.03707 7.19796C1.32209 8.55782 5.28261 9.86753 11.5833 10.243C18.5427 10.6589 25.7223 9.7775 27.6181 8.27546C28.0664 7.91991 28.1802 7.56156 27.9987 7.21638L28.4028 7.92612C28.7627 8.58433 28.844 8.79507 29.3713 10.1669C29.5443 10.7186 29.737 11.4658 29.8748 12.0277C29.9414 12.3524 29.779 12.6843 29.3622 13.0144C27.2039 14.7239 19.032 15.7269 11.1114 15.254C4.27975 14.8461 -0.133951 13.4745 0.165092 12.0085C0.292434 11.4448 0.502892 10.7026 0.667127 10.1478C0.942429 9.34203 0.955541 9.31502 1.63358 7.90789L2.03707 7.19796ZM2.03707 7.19796C2.04614 7.18077 2.0557 7.16395 2.066 7.14708L2.03707 7.19796ZM0.045561 17.4609C0.361533 18.8224 4.66336 20.0491 11.0801 20.4323C19.0685 20.9088 27.3093 19.8977 29.4861 18.1735C29.7914 17.932 29.9613 17.6896 30.0058 17.4492C29.9224 17.9404 29.7763 18.5793 29.6692 19.0601C29.495 19.766 29.3836 20.0424 28.8482 21.3706L28.3427 22.3928C28.2652 22.5344 28.1382 22.6762 27.9592 22.8181C26.0121 24.3604 18.6437 25.2641 11.4993 24.8381C6.06715 24.5138 2.32874 23.5136 1.70622 22.3749L1.23894 21.4383C0.887668 20.6653 0.878487 20.6365 0.402577 19.1333C0.276244 18.6383 0.144853 17.9746 0.045561 17.4609ZM0.045561 17.4609C0.0414181 17.4428 0.0379656 17.4246 0.0352439 17.4064C0.0385814 17.4245 0.0422712 17.4423 0.045561 17.4609ZM30.0058 17.4492C30.0071 17.4415 30.0084 17.4337 30.0097 17.426C30.0085 17.4337 30.0072 17.4415 30.0058 17.4492ZM4.99103 26.51C4.96674 26.4905 4.94348 26.4712 4.92149 26.4517L4.99103 26.51ZM4.99103 26.51C5.925 27.2536 8.60587 27.8751 12.2925 28.0956C17.8319 28.4256 23.5463 27.7251 25.0556 26.5286C25.0583 26.5265 25.061 26.5244 25.0636 26.5223L24.3938 27.0884C23.2187 28.0069 22.4421 28.4062 21.4587 28.9124C21.1678 29.0473 20.7729 29.2108 20.4778 29.3351C19.1007 29.8594 16.2024 30.1364 13.3806 29.9677C11.7136 29.8677 10.3882 29.632 9.59291 29.331C8.87794 29.0455 8.79946 29.0057 7.83876 28.5171C6.91988 27.9982 6.7843 27.8992 5.73083 27.1317L4.99103 26.51ZM25.0636 26.5223L25.1293 26.4669C25.109 26.4851 25.0867 26.5043 25.0636 26.5223ZM24.5539 3.23958C24.9932 3.59312 25.018 3.97504 24.5411 4.35241C23.1081 5.48738 17.6806 6.15388 12.4195 5.83999C7.18209 5.5271 4.08325 4.3611 5.47197 3.23005L5.64889 3.08786C6.87177 2.14553 7.51627 1.81302 8.58366 1.26382C9.22483 0.968483 9.40031 0.900301 10.1065 0.647417C9.89518 0.730196 9.72456 0.819108 9.605 0.915035C8.79062 1.55997 10.5522 2.22662 13.54 2.40516C16.5276 2.58319 19.6101 2.20556 20.4252 1.56034C20.8352 1.23533 20.589 0.904881 19.8634 0.633557C20.4348 0.830615 20.6321 0.916665 21.3318 1.22133C22.2102 1.62645 22.7484 1.97233 23.5631 2.49539C23.8679 2.70793 24.2581 3.01474 24.5539 3.23958Z"
							fill="white"
							fill-opacity="0.5"
						/>
						<Path
							fill-rule="evenodd"
							clip-rule="evenodd"
							d="M27.9987 7.21638L27.9694 7.16485C27.9799 7.18199 27.9897 7.19915 27.9987 7.21638ZM2.03707 7.19796C1.32209 8.55782 5.28261 9.86753 11.5833 10.243C18.5427 10.6589 25.7223 9.7775 27.6181 8.27546C28.0664 7.91991 28.1802 7.56156 27.9987 7.21638L28.4028 7.92612C28.7627 8.58433 28.844 8.79507 29.3713 10.1669C29.5443 10.7186 29.737 11.4658 29.8748 12.0277C29.9414 12.3524 29.779 12.6843 29.3622 13.0144C27.2039 14.7239 19.032 15.7269 11.1114 15.254C4.27975 14.8461 -0.133951 13.4745 0.165092 12.0085C0.292434 11.4448 0.502892 10.7026 0.667127 10.1478C0.942429 9.34203 0.955541 9.31502 1.63358 7.90789L2.03707 7.19796ZM2.03707 7.19796C2.04614 7.18077 2.0557 7.16395 2.066 7.14708L2.03707 7.19796ZM0.045561 17.4609C0.361533 18.8224 4.66336 20.0491 11.0801 20.4323C19.0685 20.9088 27.3093 19.8977 29.4861 18.1735C29.7914 17.932 29.9613 17.6896 30.0058 17.4492C29.9224 17.9404 29.7763 18.5793 29.6692 19.0601C29.495 19.766 29.3836 20.0424 28.8482 21.3706L28.3427 22.3928C28.2652 22.5344 28.1382 22.6762 27.9592 22.8181C26.0121 24.3604 18.6437 25.2641 11.4993 24.8381C6.06715 24.5138 2.32874 23.5136 1.70622 22.3749L1.23894 21.4383C0.887668 20.6653 0.878487 20.6365 0.402577 19.1333C0.276244 18.6383 0.144853 17.9746 0.045561 17.4609ZM0.045561 17.4609C0.0414181 17.4428 0.0379656 17.4246 0.0352439 17.4064C0.0385814 17.4245 0.0422712 17.4423 0.045561 17.4609ZM30.0058 17.4492C30.0071 17.4415 30.0084 17.4337 30.0097 17.426C30.0085 17.4337 30.0072 17.4415 30.0058 17.4492ZM4.99103 26.51C4.96674 26.4905 4.94348 26.4712 4.92149 26.4517L4.99103 26.51ZM4.99103 26.51C5.925 27.2536 8.60587 27.8751 12.2925 28.0956C17.8319 28.4256 23.5463 27.7251 25.0556 26.5286C25.0583 26.5265 25.061 26.5244 25.0636 26.5223L24.3938 27.0884C23.2187 28.0069 22.4421 28.4062 21.4587 28.9124C21.1678 29.0473 20.7729 29.2108 20.4778 29.3351C19.1007 29.8594 16.2024 30.1364 13.3806 29.9677C11.7136 29.8677 10.3882 29.632 9.59291 29.331C8.87794 29.0455 8.79946 29.0057 7.83876 28.5171C6.91988 27.9982 6.7843 27.8992 5.73083 27.1317L4.99103 26.51ZM25.0636 26.5223L25.1293 26.4669C25.109 26.4851 25.0867 26.5043 25.0636 26.5223ZM24.5539 3.23958C24.9932 3.59312 25.018 3.97504 24.5411 4.35241C23.1081 5.48738 17.6806 6.15388 12.4195 5.83999C7.18209 5.5271 4.08325 4.3611 5.47197 3.23005L5.64889 3.08786C6.87177 2.14553 7.51627 1.81302 8.58366 1.26382C9.22483 0.968483 9.40031 0.900301 10.1065 0.647417C9.89518 0.730196 9.72456 0.819108 9.605 0.915035C8.79062 1.55997 10.5522 2.22662 13.54 2.40516C16.5276 2.58319 19.6101 2.20556 20.4252 1.56034C20.8352 1.23533 20.589 0.904881 19.8634 0.633557C20.4348 0.830615 20.6321 0.916665 21.3318 1.22133C22.2102 1.62645 22.7484 1.97233 23.5631 2.49539C23.8679 2.70793 24.2581 3.01474 24.5539 3.23958Z"
							fill="url(#paint0_linear_6171_11647)"
							fill-opacity="0.32"
						/>
					</G>
				</Svg>
			</TouchableOpacity>
			<View style={styles.authContainer}>
				<View style={styles.titleContainer}>
					<TouchableOpacity
						style={{ marginTop: 30, marginBottom: 15, width: 20, height: 25 }}
					>
						<Svg height="25" width="20" viewBox="0 0 20 25" fill="none">
							<Defs>
								<SvgLinearGradient
									id="paint0_linear_6171_11633"
									x1="10"
									y1="0"
									x2="10"
									y2="25"
									gradientUnits="userSpaceOnUse"
								>
									<Stop stopColor="white" />
									<Stop
										offset="1"
										stopColor="rgb(183 204 249)"
										stopOpacity={0.01}
									/>
								</SvgLinearGradient>
							</Defs>
							<Path
								fillRule="evenodd"
								clipRule="evenodd"
								d="M7.5 16.875C7.5 15.4943 8.61929 14.375 10 14.375C11.3807 14.375 12.5 15.4943 12.5 16.875C12.5 17.8004 11.9973 18.6083 11.25 19.0405V20.0012C11.25 20.6909 10.6952 21.25 10 21.25C9.30964 21.25 8.75 20.6958 8.75 20.0012V19.0405C8.00275 18.6083 7.5 17.8004 7.5 16.875ZM2.5 7.5002C2.5 3.35772 5.85734 0 10 0C14.1414 0 17.5 3.35972 17.5 7.50032V10.625C18.881 10.6264 20 11.7419 20 13.1289V22.4961C20 23.879 18.8819 25 17.4973 25H2.50266C1.12048 25 0 23.884 0 22.4961V13.1289C0 11.7469 1.11671 10.6264 2.5 10.625V7.5002ZM5 10.625H15V7.50032C15 4.74025 12.7605 2.5 10 2.5C7.23811 2.5 5 4.73837 5 7.5002V10.625ZM2.5 13.125V22.5H17.5V13.125H2.5Z"
								fill="url(#paint0_linear_6171_11633)"
							/>
						</Svg>
					</TouchableOpacity>
					<Text style={styles.welcomeTitle}>Welcome</Text>
				</View>

				{/* number box */}

				{isSubmitted ? (
					<>
						<OTPInput
							length={6}
							onComplete={(pin) => {
								console.log("Entered PIN:", pin)
							}}
						/>
						<Text style={styles.textWarning}>
							Enter the code that was sent to user.Email
						</Text>
						<TouchableOpacity style={styles.resendCodeButton}>
							<Text style={styles.resendCodeText}>Resend code</Text>
						</TouchableOpacity>
						<TouchableOpacity
							onPress={() => {
								setIsSubmitted(false)
								setEmail("")
							}}
						>
							<Text style={styles.backText}>Back</Text>
						</TouchableOpacity>
					</>
				) : (
					<>
						<View style={styles.inputContainer}>
							<View
								style={{
									flexDirection: "row",
									alignItems: "center",
									justifyContent: "center",
									height: 50,
									marginTop: 30,
									width: "95%",
								}}
							>
								<TextInput
									style={[
										styles.input,
										email.trim() !== "" ? styles.inputActive : {},
										isValidEmail(email) ? styles.inputValid : {},
									]}
									placeholder="Enter email"
									textAlign="center"
									placeholderTextColor="rgba(255, 255, 255, 0.2)"
									autoCapitalize="none"
									onChangeText={(text) => setEmail(text.toLowerCase())}
								/>
								{isValidEmail(email) && (
									<TouchableOpacity
										style={styles.continueButton}
										onPress={() => setIsSubmitted(true)}
									>
										<Text style={styles.continueText}>Continue</Text>
									</TouchableOpacity>
								)}
							</View>

							<Text
								style={{
									color: "rgba(255, 255, 255, 0.3)",
									marginVertical: 15,
								}}
							>
								or
							</Text>
							<TouchableOpacity style={styles.passkeyButton}>
								<Text style={styles.passkeyText}>Sign in with a passkey</Text>
							</TouchableOpacity>
						</View>
						<Text style={styles.textWarning}>
							By clicking on either button, you agree to the{" "}
							<Text
								style={{
									textDecorationLine: "underline",
									textDecorationStyle: "solid",
									paddingBottom: 2, // wtf doesnt work
									borderBottomWidth: 1,
									lineHeight: 24,
								}}
							>
								Terms of Service
							</Text>
						</Text>
					</>
				)}
			</View>
			<View style={styles.linkContainer}>
				<Text style={{ color: "white", opacity: 0.3 }}>Learn Anything</Text>
				<View style={styles.socialIcons}>
					<Svg width="80" height="16" viewBox="0 0 80 16" fill="none">
						<G opacity="0.3">
							<Path
								d="M71.7852 0.5C67.6439 0.5 64.2852 3.94302 64.2852 8.1896C64.2852 11.5871 66.4339 14.4694 69.4146 15.4864C69.7889 15.5575 69.9102 15.3191 69.9102 15.1167V13.6851C67.8239 14.1503 67.3896 12.7777 67.3896 12.7777C67.0483 11.8889 66.5564 11.6525 66.5564 11.6525C65.8758 11.1751 66.6083 11.1853 66.6083 11.1853C67.3614 11.2392 67.7577 11.978 67.7577 11.978C68.4264 13.1532 69.5121 12.8136 69.9402 12.6169C70.0071 12.1203 70.2015 11.7806 70.4165 11.589C68.7508 11.3936 66.9996 10.7342 66.9996 7.78846C66.9996 6.94837 67.2927 6.26272 67.7721 5.72444C67.6946 5.53028 67.4377 4.74786 67.8452 3.68926C67.8452 3.68926 68.4752 3.48292 69.9083 4.47745C70.5065 4.30699 71.1477 4.22177 71.7852 4.21856C72.4227 4.22177 73.0646 4.30699 73.664 4.47745C75.0959 3.48292 75.7246 3.68926 75.7246 3.68926C76.1327 4.74851 75.8759 5.53092 75.7984 5.72444C76.2796 6.26272 76.5703 6.94901 76.5703 7.78846C76.5703 10.7419 74.8159 11.3923 73.1459 11.5826C73.4146 11.821 73.6602 12.2888 73.6602 13.0065V15.1167C73.6602 15.3211 73.7802 15.5614 74.1609 15.4858C77.139 14.4675 79.2853 11.5858 79.2853 8.1896C79.2853 3.94302 75.9271 0.5 71.7852 0.5Z"
								fill="white"
							/>
							<Path
								d="M46.3262 1.74337C45.0759 1.15778 43.7564 0.740209 42.4008 0.501119C42.3885 0.498661 42.3757 0.500275 42.3642 0.505728C42.3528 0.511181 42.3434 0.520191 42.3374 0.531458C42.1686 0.838945 41.9806 1.23991 41.8488 1.55642C40.3875 1.32993 38.901 1.32993 37.4397 1.55642C37.293 1.20572 37.1275 0.863544 36.9439 0.531458C36.9376 0.520443 36.9281 0.511647 36.9168 0.50623C36.9054 0.500814 36.8928 0.499032 36.8804 0.501119C35.5247 0.739713 34.2052 1.1573 32.9551 1.74337C32.9445 1.7479 32.9355 1.75562 32.9293 1.76551C30.4287 5.57753 29.7432 9.29525 30.0799 12.9662C30.0808 12.9754 30.0834 12.9842 30.0877 12.9922C30.092 13.0003 30.0978 13.0073 30.1048 13.013C31.5606 14.1135 33.189 14.9537 34.9205 15.4975C34.9328 15.5011 34.9457 15.5008 34.9578 15.4967C34.9699 15.4926 34.9804 15.4849 34.988 15.4745C35.3603 14.9583 35.6898 14.4114 35.9732 13.8395C35.9772 13.8317 35.9794 13.8231 35.9799 13.8143C35.9804 13.8055 35.979 13.7967 35.9759 13.7885C35.9728 13.7803 35.968 13.7728 35.9618 13.7666C35.9557 13.7605 35.9483 13.7557 35.9403 13.7526C35.4207 13.5497 34.9177 13.3051 34.436 13.0212C34.4272 13.016 34.4197 13.0086 34.4144 12.9998C34.409 12.9909 34.4059 12.9808 34.4052 12.9705C34.4046 12.9601 34.4065 12.9497 34.4107 12.9402C34.415 12.9308 34.4215 12.9225 34.4296 12.9162C34.531 12.8388 34.6307 12.759 34.7285 12.6768C34.7371 12.6697 34.7474 12.6652 34.7583 12.6637C34.7692 12.6623 34.7803 12.664 34.7904 12.6686C37.9467 14.1388 41.3634 14.1388 44.4828 12.6686C44.493 12.6638 44.5043 12.662 44.5153 12.6635C44.5264 12.6649 44.5369 12.6696 44.5455 12.6768C44.6419 12.7572 44.7432 12.8391 44.8452 12.9162C44.8533 12.9224 44.8597 12.9305 44.864 12.9398C44.8683 12.9491 44.8702 12.9593 44.8698 12.9696C44.8693 12.9798 44.8664 12.9898 44.8613 12.9987C44.8561 13.0075 44.849 13.015 44.8404 13.0204C44.3598 13.307 43.8563 13.5517 43.3354 13.7518C43.3273 13.7549 43.3199 13.7598 43.3137 13.7661C43.3076 13.7723 43.3028 13.7799 43.2997 13.7881C43.2966 13.7964 43.2952 13.8053 43.2957 13.8141C43.2962 13.823 43.2985 13.8316 43.3024 13.8395C43.5917 14.4118 43.9228 14.9563 44.2868 15.4737C44.2943 15.4842 44.3048 15.4921 44.3169 15.4962C44.329 15.5004 44.3421 15.5005 44.3543 15.4967C46.0887 14.9545 47.7198 14.1143 49.1772 13.0122C49.1843 13.007 49.1903 13.0004 49.1947 12.9928C49.1991 12.9852 49.2019 12.9767 49.2029 12.9679C49.6047 8.72292 48.5295 5.03553 46.3511 1.76715C46.346 1.75612 46.3372 1.7482 46.3262 1.74337ZM36.4449 10.7302C35.4943 10.7302 34.7116 9.84053 34.7116 8.7467C34.7116 7.65368 35.4798 6.7632 36.4449 6.7632C37.4172 6.7632 38.1934 7.66188 38.1782 8.74752C38.1782 9.84053 37.41 10.7302 36.4449 10.7302ZM42.8532 10.7302C41.9026 10.7302 41.12 9.84053 41.12 8.7467C41.12 7.65368 41.8874 6.7632 42.8532 6.7632C43.8255 6.7632 44.6018 7.66188 44.5865 8.74752C44.5865 9.84053 43.8263 10.7302 42.8532 10.7302Z"
								fill="white"
							/>
							<Path
								d="M15.0001 15.5L9.13413 6.75773L9.14413 6.76591L14.4332 0.5H12.6657L8.35711 5.6L4.93556 0.5H0.300136L5.77661 8.66205L5.77594 8.66136L0 15.5H1.76747L6.55763 9.82591L10.3647 15.5H15.0001ZM4.23525 1.86364L12.4656 14.1364H11.065L2.82794 1.86364H4.23525Z"
								fill="white"
							/>
						</G>
					</Svg>
				</View>
			</View>
		</View>
	)
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		alignItems: "center",
		width,
		backgroundColor: "#0F0F0F",
		position: "relative",
	},
	svgBackground: {
		position: "absolute",
		top: 0,
		left: 0,
	},
	authContainer: {
		flexDirection: `column`,
		alignItems: `center`,
		marginHorizontal: "auto",
		width: "95%",
		backgroundColor: "#0F0F0F",
		borderRadius: 7,
		borderWidth: 1,
		borderColor: "#191919",
		height: "53%",
		marginTop: 35,
	},
	titleContainer: {
		display: `flex`,
		flexDirection: `column`,
		alignItems: `center`,
		width,
	},
	welcomeTitle: {
		fontSize: 20,
		fontWeight: "800",
		color: "#fff",
	},
	inputContainer: {
		display: `flex`,
		flexDirection: `column`,
		alignItems: `center`,
		marginBottom: 30,
	},
	input: {
		width: 340,
		fontSize: 16,
		backgroundColor: "#191919",
		padding: 13,
		borderRadius: 7,
		borderWidth: 1,
		borderColor: "rgba(255, 255, 255, 0.10)",
		color: "white",
		fontWeight: "500",
		height: 50,
	},
	inputActive: {
		backgroundColor: "#111318",
	},
	inputValid: {
		width: 220,
		marginRight: 10,
	},
	passkeyButton: {
		width: 340,
		padding: 11,
		borderWidth: 1,
		backgroundColor: "#232323",
		borderRadius: 7,
		shadowColor: "#000",
		shadowOffset: { width: 0, height: 1 },
		shadowOpacity: 0.55,
		shadowRadius: 1,
	},
	passkeyText: {
		color: "rgba(255, 255, 255, 1)",
		opacity: 0.7,
		fontSize: 16,
		fontWeight: "500",
		textAlign: "center",
	},
	textWarning: {
		fontSize: 14,
		color: "white",
		opacity: 0.3,
		width: 260,
		textAlign: "center",
		marginBottom: 30,
		lineHeight: 22,
	},
	linkContainer: {
		flexDirection: "column",
		position: "absolute",
		bottom: 40,
		width: "100%",
		alignItems: "center",
	},
	socialIcons: {
		flexDirection: "row",
		justifyContent: "center",
		marginTop: 15,
	},
	continueButton: {
		borderColor: "rgba(255, 255, 255, 0.10)",
		display: "flex",
		flexDirection: "row",
		alignItems: "center",
		justifyContent: "center",
		paddingHorizontal: 11,
		backgroundColor: "#232323",
		borderRadius: 7,
		shadowColor: "#000",
		shadowOffset: { width: 0, height: 1 },
		shadowOpacity: 0.55,
		shadowRadius: 1,
		padding: 11,
		height: 50,
		width: 110,
	},
	continueText: {
		color: "rgba(255, 255, 255, 1)",
		opacity: 0.7,
		fontSize: 16,
		fontWeight: "500",
		textAlign: "center",
	},
	numberBoxContainer: {
		marginTop: 30,
		marginBottom: 14,
		flexDirection: "row",
		flexWrap: "wrap",
		justifyContent: "space-between",
	},
	numberBox: {
		width: 48,
		height: 45,
		borderRadius: 7,
		borderColor: "rgba(255, 255, 255, 0.03)",
		borderWidth: 1,
		backgroundColor: "rgb(32 32 32)",
		color: "white",
		fontSize: 16,
		fontWeight: "500",
		textAlign: "center",
	},
	currentInputColor: {
		backgroundColor: "#181a1f",
	},
	resendCodeButton: {
		width: "35%",
		padding: 8,
		borderWidth: 1,
		backgroundColor: "#232323",
		borderRadius: 7,
		shadowColor: "#000",
		shadowOffset: { width: 0, height: 1 },
		shadowOpacity: 0.55,
		shadowRadius: 1,
	},
	resendCodeText: {
		color: "rgba(255, 255, 255, 1)",
		opacity: 0.7,
		fontSize: 16,
		fontWeight: "500",
		textAlign: "center",
	},
	backText: {
		fontSize: 16,
		fontWeight: "500",
		textAlign: "center",
		color: "white",
		opacity: 0.5,
		marginTop: 17,
	},
})
