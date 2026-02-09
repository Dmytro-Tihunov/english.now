import { env } from "@english.now/env/client";
import { useQuery } from "@tanstack/react-query";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import {
	KeyboardIcon,
	Languages,
	Lightbulb,
	Loader2,
	Mic,
	MicOff,
	PauseIcon,
	PlayIcon,
	Send,
	Settings,
	X,
} from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import {
	Popover,
	PopoverContent,
	PopoverTrigger,
} from "@/components/ui/popover";
import { Textarea } from "@/components/ui/textarea";
import {
	Tooltip,
	TooltipContent,
	TooltipTrigger,
} from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/_conversation/conversation/$sessionId")({
	component: ConversationPage,
});

type Message = {
	id: string;
	role: "user" | "assistant";
	content: string;
	isStreaming?: boolean;
	audio?: string; // base64 encoded audio
};

type RecordingState = "idle" | "recording" | "transcribing";

type SessionData = {
	session: {
		id: string;
		userId: string;
		scenario: string;
		level: string;
		context: {
			systemPrompt: string;
			scenarioDescription: string;
			goals: string[];
		};
		status: string;
		createdAt: string;
		updatedAt: string;
	};
	messages: Array<{
		id: string;
		sessionId: string;
		role: "user" | "assistant";
		content: string;
		metadata?: Record<string, unknown>;
		corrections?: unknown;
		createdAt: string;
	}>;
};

function ConversationPage() {
	const { sessionId } = Route.useParams();
	const navigate = useNavigate();
	const [messages, setMessages] = useState<Message[]>([]);
	const [inputText, setInputText] = useState("");
	const [recordingState, setRecordingState] = useState<RecordingState>("idle");
	const [isLoading, setIsLoading] = useState(false);
	const [showHint, setShowHint] = useState(false);
	const [hint, setHint] = useState<string>("");
	const [popoverOpen, setPopoverOpen] = useState(false);
	const [popoverText, setPopoverText] = useState("");

	const messagesEndRef = useRef<HTMLDivElement>(null);
	const mediaRecorderRef = useRef<MediaRecorder | null>(null);
	const audioChunksRef = useRef<Blob[]>([]);
	const streamRef = useRef<MediaStream | null>(null);
	const audioRef = useRef<HTMLAudioElement | null>(null);
	const [isPlaying, setIsPlaying] = useState<string | null>(null);
	const hasPlayedInitialAudio = useRef(false);

	// Fetch existing session data
	const {
		data: sessionData,
		isLoading: isLoadingSession,
		error: sessionError,
	} = useQuery({
		queryKey: ["conversation", sessionId],
		queryFn: async (): Promise<SessionData> => {
			const response = await fetch(
				`${env.VITE_SERVER_URL}/api/conversation/session/${sessionId}`,
				{
					credentials: "include",
				},
			);
			if (!response.ok) {
				if (response.status === 404) {
					throw new Error("Session not found");
				}
				throw new Error("Failed to load conversation");
			}
			return response.json();
		},
		retry: false,
	});

	// Play audio from base64
	const playAudio = useCallback((audioBase64: string, messageId?: string) => {
		if (audioRef.current) {
			audioRef.current.pause();
			audioRef.current = null;
		}

		try {
			const audio = new Audio(`data:audio/mp3;base64,${audioBase64}`);
			audioRef.current = audio;

			if (messageId) {
				setIsPlaying(messageId);
			}

			audio.onended = () => {
				setIsPlaying(null);
				audioRef.current = null;
			};

			audio.onerror = () => {
				console.error("Audio playback error");
				setIsPlaying(null);
				audioRef.current = null;
			};

			audio.play().catch((err) => {
				console.error("Failed to play audio:", err);
				setIsPlaying(null);
			});
		} catch (err) {
			console.error("Error creating audio:", err);
		}
	}, []);

	// Generate TTS audio for a message
	const generateTTS = useCallback(async (text: string, messageId: string) => {
		try {
			const response = await fetch(
				`${env.VITE_SERVER_URL}/api/conversation/speak`,
				{
					method: "POST",
					headers: { "Content-Type": "application/json" },
					credentials: "include",
					body: JSON.stringify({ text }),
				},
			);
			if (!response.ok) return null;
			const { audio } = await response.json();

			// Update message with audio
			setMessages((prev) =>
				prev.map((m) => (m.id === messageId ? { ...m, audio } : m)),
			);

			return audio as string;
		} catch (err) {
			console.error("TTS generation error:", err);
			return null;
		}
	}, []);

	// Generate hint based on AI's last message
	const generateHint = useCallback((_lastAiMessage: string) => {
		const hints = [
			"Try responding with 'Yes, I...' or 'No, I don't...'",
			"You could ask a question like 'What do you recommend?'",
			"Share something about yourself: 'I like...' or 'I work as...'",
			"Ask for clarification: 'Could you repeat that?' or 'What does ... mean?'",
			"Express your opinion: 'I think that...' or 'In my opinion...'",
		];
		setHint(hints[Math.floor(Math.random() * hints.length)] || hints[0]);
	}, []);

	// Load messages from session data and autoplay last assistant message
	useEffect(() => {
		if (sessionData?.messages && !hasPlayedInitialAudio.current) {
			const loadedMessages = sessionData.messages.map((m) => ({
				id: m.id,
				role: m.role,
				content: m.content,
			}));
			setMessages(loadedMessages);

			// Generate hint for the last AI message
			const lastAiMessage = sessionData.messages
				.filter((m) => m.role === "assistant")
				.pop();

			if (lastAiMessage) {
				generateHint(lastAiMessage.content);

				// Generate and autoplay TTS for the last assistant message
				hasPlayedInitialAudio.current = true;
				generateTTS(lastAiMessage.content, lastAiMessage.id).then((audio) => {
					if (audio) {
						playAudio(audio, lastAiMessage.id);
					}
				});
			}
		}
	}, [sessionData, generateTTS, playAudio, generateHint]);

	// Redirect to practice if session not found
	useEffect(() => {
		if (sessionError) {
			navigate({ to: "/practice" });
		}
	}, [sessionError, navigate]);

	// Scroll to bottom when messages change
	useEffect(() => {
		messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
	}, [messages]);

	// Cleanup media stream and audio on unmount
	useEffect(() => {
		return () => {
			if (streamRef.current) {
				for (const track of streamRef.current.getTracks()) {
					track.stop();
				}
			}
			if (audioRef.current) {
				audioRef.current.pause();
				audioRef.current = null;
			}
		};
	}, []);

	// Send message and stream response
	const sendMessage = useCallback(
		async (content: string, inputType: "text" | "voice" = "text") => {
			if (!sessionId || !content.trim()) return;

			const userMessageId = crypto.randomUUID();
			setMessages((prev) => [
				...prev,
				{ id: userMessageId, role: "user", content },
			]);
			setInputText("");
			setIsLoading(true);
			setShowHint(false);

			const aiMessageId = crypto.randomUUID();
			setMessages((prev) => [
				...prev,
				{ id: aiMessageId, role: "assistant", content: "", isStreaming: true },
			]);

			try {
				const response = await fetch(
					`${env.VITE_SERVER_URL}/api/conversation/send`,
					{
						method: "POST",
						headers: {
							"Content-Type": "application/json",
						},
						credentials: "include",
						body: JSON.stringify({
							sessionId,
							content,
							inputType,
						}),
					},
				);

				if (!response.ok) throw new Error("Failed to send message");

				const reader = response.body?.getReader();
				const decoder = new TextDecoder();
				let fullContent = "";

				if (reader) {
					while (true) {
						const { done, value } = await reader.read();
						if (done) break;

						const chunk = decoder.decode(value);
						fullContent += chunk;

						const displayContent = fullContent.split("\n__TTS_AUDIO__")[0];

						setMessages((prev) =>
							prev.map((msg) =>
								msg.id === aiMessageId
									? { ...msg, content: displayContent }
									: msg,
							),
						);
					}
				}

				const TTS_MARKER = "\n__TTS_AUDIO__";
				let textContent = fullContent;
				let audioBase64: string | undefined;

				if (fullContent.includes(TTS_MARKER)) {
					const [text, audio] = fullContent.split(TTS_MARKER);
					textContent = text;
					audioBase64 = audio;
				}

				setMessages((prev) =>
					prev.map((msg) =>
						msg.id === aiMessageId
							? {
									...msg,
									content: textContent,
									isStreaming: false,
									audio: audioBase64,
								}
							: msg,
					),
				);

				generateHint(textContent);

				if (audioBase64) {
					playAudio(audioBase64, aiMessageId);
				}
			} catch (error) {
				console.error("Error sending message:", error);
				setMessages((prev) =>
					prev.map((msg) =>
						msg.id === aiMessageId
							? {
									...msg,
									content: "Sorry, I couldn't respond. Please try again.",
									isStreaming: false,
								}
							: msg,
					),
				);
			} finally {
				setIsLoading(false);
			}
		},
		[sessionId, generateHint, playAudio],
	);

	// Start recording
	const startRecording = async () => {
		try {
			const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
			streamRef.current = stream;

			const mediaRecorder = new MediaRecorder(stream, {
				mimeType: "audio/webm;codecs=opus",
			});
			mediaRecorderRef.current = mediaRecorder;
			audioChunksRef.current = [];

			mediaRecorder.ondataavailable = (event) => {
				if (event.data.size > 0) {
					audioChunksRef.current.push(event.data);
				}
			};

			mediaRecorder.onstop = async () => {
				const blob = new Blob(audioChunksRef.current, { type: "audio/webm" });

				if (streamRef.current) {
					for (const track of streamRef.current.getTracks()) {
						track.stop();
					}
					streamRef.current = null;
				}

				setRecordingState("transcribing");
				await transcribeAndSend(blob);
			};

			mediaRecorder.start();
			setRecordingState("recording");
		} catch (err) {
			console.error("Error accessing microphone:", err);
			alert("Failed to access microphone. Please check your permissions.");
		}
	};

	// Stop recording
	const stopRecording = () => {
		if (mediaRecorderRef.current && recordingState === "recording") {
			mediaRecorderRef.current.stop();
		}
	};

	// Transcribe audio and send as message
	const transcribeAndSend = async (blob: Blob) => {
		try {
			const arrayBuffer = await blob.arrayBuffer();
			const base64 = btoa(String.fromCharCode(...new Uint8Array(arrayBuffer)));

			const response = await fetch(
				`${env.VITE_SERVER_URL}/api/conversation/transcribe`,
				{
					method: "POST",
					headers: { "Content-Type": "application/json" },
					credentials: "include",
					body: JSON.stringify({ audio: base64 }),
				},
			);

			if (!response.ok) throw new Error("Transcription failed");

			const { transcript } = await response.json();

			if (transcript) {
				await sendMessage(transcript, "voice");
			} else {
				alert("Couldn't understand the audio. Please try again.");
			}
		} catch (error) {
			console.error("Transcription error:", error);
			alert("Failed to transcribe audio. Please try again.");
		} finally {
			setRecordingState("idle");
		}
	};

	// Handle form submit
	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault();
		if (inputText.trim() && !isLoading) {
			sendMessage(inputText.trim());
		}
	};

	// Loading screen while fetching session
	if (isLoadingSession) {
		return (
			<div className="container mx-auto flex min-h-dvh max-w-3xl flex-col items-center justify-center px-4 py-8">
				<div className="flex flex-col items-center gap-4">
					<Loader2 className="size-8 animate-spin text-lime-600" />
					<p className="font-medium text-foreground-muted">
						Loading conversation...
					</p>
				</div>
			</div>
		);
	}

	// Conversation screen
	return (
		<div className="container relative mx-auto flex h-full max-w-3xl flex-col px-4 pt-8">
			{/* Messages */}
			<div className="flex-1 space-y-4 overflow-y-auto px-1 py-4">
				{messages.map((message) => (
					<div
						key={message.id}
						className={cn(
							"flex",
							message.role === "user" ? "justify-end" : "justify-start",
						)}
					>
						<div
							className={cn(
								"max-w-[85%] rounded-2xl px-4 py-4",
								message.role === "user"
									? "rounded-tr-md bg-radial from-[#EFFF9B] to-[#D8FF76]"
									: "rounded-tl-md border-black/5 bg-white",
							)}
							style={{
								boxShadow:
									"0 0 0 1px #0000000f,0 1px 1px #00000010,inset 0 1px #fff,inset 0 -1px 1px #fff3,inset 0 1px 4px 1px #fff3,inset 0 -2px 1px 1px #0000000f,inset 0 20px 20px #00000002",
							}}
						>
							<p className="whitespace-pre-wrap text-sm leading-relaxed">
								{message.content}
								{message.isStreaming && (
									<div className="flex gap-1 py-1">
										<span className="size-1.5 animate-bounce rounded-full bg-current opacity-60" />
										<span
											className="size-1.5 animate-bounce rounded-full bg-current opacity-60"
											style={{ animationDelay: "0.1s" }}
										/>
										<span
											className="size-1.5 animate-bounce rounded-full bg-current opacity-60"
											style={{ animationDelay: "0.2s" }}
										/>
									</div>
									// <span className="ml-1 inline-block size-2 animate-pulse rounded-full bg-current" />
								)}
								{message.role === "assistant" && !message.isStreaming && (
									<div className="mt-2 flex items-center gap-1.5">
										<Button
											variant="outline"
											size="sm"
											className={cn(
												"rounded-lg text-xs",
												isPlaying === message.id &&
													"border-lime-300 bg-lime-100",
											)}
											onClick={() => {
												if (isPlaying === message.id) {
													if (audioRef.current) {
														audioRef.current.pause();
														audioRef.current = null;
													}
													setIsPlaying(null);
												} else if (message.audio) {
													playAudio(message.audio, message.id);
												}
											}}
											disabled={!message.audio}
											title={
												message.audio
													? isPlaying === message.id
														? "Stop"
														: "Play"
													: "No audio available"
											}
										>
											{isPlaying === message.id ? (
												<PauseIcon className="size-3" fill="currentColor" />
											) : (
												<PlayIcon className="size-3" fill="currentColor" />
											)}
										</Button>
										<Button
											variant="outline"
											size="sm"
											className="rounded-lg text-xs"
										>
											<Languages className="size-3" />
										</Button>
									</div>
								)}
							</p>
						</div>
					</div>
				))}
				<div ref={messagesEndRef} />
			</div>

			{/* Hint */}
			{showHint && hint && (
				<div className="mb-3 flex cursor-pointer items-start gap-2 rounded-xl bg-amber-50 p-3 text-amber-900 dark:bg-amber-950/30 dark:text-amber-200">
					<Lightbulb className="mt-0.5 size-4 shrink-0" />
					<p className="text-sm">{hint}</p>
				</div>
			)}

			{/* Input area */}
			<div
				className="sticky inset-x-0 bottom-0 mx-auto flex justify-center overflow-hidden rounded-t-3xl border bg-white p-3 transition-all duration-75 ease-in dark:from-surface dark:to-transparent"
				style={{
					boxShadow:
						"rgba(162, 166, 171, 0.2) 0px 0px 0px 0px inset, rgba(162, 166, 171, 0.2) 0px 0px 8px 2px inset",
				}}
			>
				<form onSubmit={handleSubmit} className="flex gap-2">
					{/* Voice record button */}
					<Tooltip>
						<TooltipTrigger asChild>
							<Button
								type="button"
								size="lg"
								variant={
									recordingState === "recording" ? "destructive" : "outline"
								}
								className={cn(
									"flex shrink-0 cursor-pointer items-center justify-center rounded-xl border border-[#C6F64D] bg-radial from-[#EFFF9B] to-[#D8FF76]",
									recordingState === "recording" &&
										"animate-pulse border-[#FFBABA] bg-radial from-[#FFE4E4] to-[#FFBABA]",
								)}
								onClick={
									recordingState === "recording"
										? stopRecording
										: startRecording
								}
								disabled={isLoading || recordingState === "transcribing"}
							>
								{recordingState === "transcribing" ? (
									<Loader2 className="size-5 animate-spin" />
								) : recordingState === "recording" ? (
									<MicOff className="size-5" />
								) : (
									<Mic className="size-5" />
								)}
							</Button>
						</TooltipTrigger>
						<TooltipContent>
							{recordingState === "recording"
								? "Stop recording"
								: "Record voice"}
						</TooltipContent>
					</Tooltip>

					<div className="flex">
						{/* Hint button */}
						<Tooltip>
							<TooltipTrigger asChild>
								<Button
									type="button"
									variant="ghost"
									size="lg"
									className={cn(
										"shrink-0 rounded-xl",
										showHint && "text-amber-500",
									)}
									onClick={() => setShowHint(!showHint)}
									title="Get a hint"
								>
									<Lightbulb
										className={cn("size-5", showHint && "text-amber-500")}
									/>
								</Button>
							</TooltipTrigger>
							<TooltipContent>Get a hint</TooltipContent>
						</Tooltip>

						<Popover open={popoverOpen} onOpenChange={setPopoverOpen}>
							<PopoverTrigger asChild>
								<Button
									type="button"
									variant="ghost"
									size="lg"
									className={cn(
										"shrink-0 cursor-pointer rounded-xl",
										popoverOpen && "bg-neutral-100",
									)}
								>
									<KeyboardIcon className="size-5" />
								</Button>
							</PopoverTrigger>
							<PopoverContent
								side="top"
								align="center"
								sideOffset={28}
								className="w-80 rounded-xl p-3 shadow-none"
							>
								<div className="flex flex-col gap-3">
									<Textarea
										value={popoverText}
										onChange={(e) => setPopoverText(e.target.value)}
										placeholder="Type your message..."
										className="min-h-24 resize-none rounded-lg"
										disabled={isLoading}
									/>
									<Button
										type="button"
										className="self-end rounded-lg"
										disabled={!popoverText.trim() || isLoading}
										onClick={() => {
											if (popoverText.trim()) {
												sendMessage(popoverText.trim());
												setPopoverText("");
												setPopoverOpen(false);
											}
										}}
									>
										{isLoading ? (
											<Loader2 className="size-4 animate-spin" />
										) : (
											<Send className="size-4" />
										)}
										Send
									</Button>
								</div>
							</PopoverContent>
						</Popover>

						<Button
							type="button"
							variant="ghost"
							className="rounded-xl"
							size="lg"
						>
							<Settings className="size-5" />
						</Button>
					</div>
					<Tooltip>
						<TooltipTrigger asChild>
							<Button
								type="button"
								variant="ghost"
								size="lg"
								className="flex shrink-0 cursor-pointer items-center justify-center rounded-xl border border-red-600 bg-radial from-[#e28b8b] to-[#EF4444] text-red-800 hover:text-red-700/80"
							>
								<X className="size-5" />
							</Button>
						</TooltipTrigger>
						<TooltipContent>Finish</TooltipContent>
					</Tooltip>
				</form>
			</div>
		</div>
	);
}
