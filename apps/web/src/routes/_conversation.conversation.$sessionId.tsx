import { env } from "@english.now/env/client";
import { useQuery } from "@tanstack/react-query";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import {
	KeyboardIcon,
	Languages,
	Lightbulb,
	Loader,
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
import {
	AlertDialog,
	AlertDialogAction,
	AlertDialogCancel,
	AlertDialogContent,
	AlertDialogDescription,
	AlertDialogFooter,
	AlertDialogHeader,
	AlertDialogTitle,
} from "@/components/ui/alert-dialog";
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
	const [hintSuggestions, setHintSuggestions] = useState<string[]>([]);
	const [isLoadingHint, setIsLoadingHint] = useState(false);
	const [popoverOpen, setPopoverOpen] = useState(false);
	const [popoverText, setPopoverText] = useState("");
	const [popoverMode, setPopoverMode] = useState<"english" | "native">(
		"english",
	);
	const [nativeTranslation, setNativeTranslation] = useState("");
	const [isTranslatingNative, setIsTranslatingNative] = useState(false);
	const [translations, setTranslations] = useState<Record<string, string>>({});
	const [translatingId, setTranslatingId] = useState<string | null>(null);
	const [showFinishDialog, setShowFinishDialog] = useState(false);
	const [isFinishing, setIsFinishing] = useState(false);
	const messagesEndRef = useRef<HTMLDivElement>(null);
	const mediaRecorderRef = useRef<MediaRecorder | null>(null);
	const audioChunksRef = useRef<Blob[]>([]);
	const streamRef = useRef<MediaStream | null>(null);
	const audioRef = useRef<HTMLAudioElement | null>(null);
	const [isPlaying, setIsPlaying] = useState<string | null>(null);
	const [generatingTTS, setGeneratingTTS] = useState<Set<string>>(new Set());
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
		setGeneratingTTS((prev) => new Set(prev).add(messageId));
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

			setMessages((prev) =>
				prev.map((m) => (m.id === messageId ? { ...m, audio } : m)),
			);

			return audio as string;
		} catch (err) {
			console.error("TTS generation error:", err);
			return null;
		} finally {
			setGeneratingTTS((prev) => {
				const next = new Set(prev);
				next.delete(messageId);
				return next;
			});
		}
	}, []);

	// Fetch AI-generated hint suggestions
	const fetchHintSuggestions = useCallback(async () => {
		if (!sessionId) return;
		setIsLoadingHint(true);
		try {
			const response = await fetch(
				`${env.VITE_SERVER_URL}/api/conversation/hint`,
				{
					method: "POST",
					headers: { "Content-Type": "application/json" },
					credentials: "include",
					body: JSON.stringify({ sessionId }),
				},
			);
			if (!response.ok) throw new Error("Failed to fetch hints");
			const { suggestions } = await response.json();
			setHintSuggestions(suggestions ?? []);
		} catch (err) {
			console.error("Hint generation error:", err);
			setHintSuggestions(["I'm not sure what to say…"]);
		} finally {
			setIsLoadingHint(false);
		}
	}, [sessionId]);

	// Translate native language text to English
	const translateNativeToEnglish = useCallback(async (text: string) => {
		if (!text.trim()) {
			setNativeTranslation("");
			return;
		}
		setIsTranslatingNative(true);
		try {
			const response = await fetch(
				`${env.VITE_SERVER_URL}/api/conversation/native-to-english`,
				{
					method: "POST",
					headers: { "Content-Type": "application/json" },
					credentials: "include",
					body: JSON.stringify({ text }),
				},
			);
			if (!response.ok) throw new Error("Translation failed");
			const { english } = await response.json();
			setNativeTranslation(english ?? "");
		} catch (err) {
			console.error("Native translation error:", err);
			setNativeTranslation("");
		} finally {
			setIsTranslatingNative(false);
		}
	}, []);

	// Translate an assistant message to user's native language
	const translateMessage = useCallback(
		async (messageId: string, text: string) => {
			// Toggle off if already translated
			if (translations[messageId]) {
				setTranslations((prev) => {
					const next = { ...prev };
					delete next[messageId];
					return next;
				});
				return;
			}

			setTranslatingId(messageId);
			try {
				const response = await fetch(
					`${env.VITE_SERVER_URL}/api/conversation/translate`,
					{
						method: "POST",
						headers: { "Content-Type": "application/json" },
						credentials: "include",
						body: JSON.stringify({ text }),
					},
				);
				if (!response.ok) throw new Error("Translation failed");
				const { translation } = await response.json();
				setTranslations((prev) => ({ ...prev, [messageId]: translation }));
			} catch (err) {
				console.error("Translation error:", err);
			} finally {
				setTranslatingId(null);
			}
		},
		[translations],
	);

	// Load messages from session data and autoplay last assistant message
	useEffect(() => {
		if (sessionData?.messages && !hasPlayedInitialAudio.current) {
			const loadedMessages = sessionData.messages.map((m) => ({
				id: m.id,
				role: m.role,
				content: m.content,
			}));
			setMessages(loadedMessages);

			const lastAiMessage = sessionData.messages
				.filter((m) => m.role === "assistant")
				.pop();

			if (lastAiMessage) {
				hasPlayedInitialAudio.current = true;
				generateTTS(lastAiMessage.content, lastAiMessage.id).then((audio) => {
					if (audio) {
						playAudio(audio, lastAiMessage.id);
					}
				});
			}
		}
	}, [sessionData, generateTTS, playAudio]);

	// Redirect to feedback if session is already completed
	useEffect(() => {
		if (sessionData?.session.status === "completed") {
			navigate({
				to: "/feedback/$sessionId",
				params: { sessionId },
				replace: true,
			});
		}
	}, [sessionData, sessionId, navigate]);

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

	// Warn before leaving mid-session
	useEffect(() => {
		const handler = (e: BeforeUnloadEvent) => {
			if (messages.filter((m) => m.role === "user").length > 0) {
				e.preventDefault();
			}
		};
		window.addEventListener("beforeunload", handler);
		return () => window.removeEventListener("beforeunload", handler);
	}, [messages]);

	const userMessageCount = messages.filter((m) => m.role === "user").length;
	const canGetFeedback = userMessageCount >= 3;

	const handleFinishSession = useCallback(async () => {
		if (!sessionId) return;
		setIsFinishing(true);
		try {
			if (canGetFeedback) {
				const response = await fetch(
					`${env.VITE_SERVER_URL}/api/conversation/finish`,
					{
						method: "POST",
						headers: { "Content-Type": "application/json" },
						credentials: "include",
						body: JSON.stringify({ sessionId }),
					},
				);
				if (!response.ok) throw new Error("Failed to finish session");
				navigate({
					to: "/feedback/$sessionId",
					params: { sessionId },
				});
			} else {
				await fetch(`${env.VITE_SERVER_URL}/api/conversation/finish`, {
					method: "POST",
					headers: { "Content-Type": "application/json" },
					credentials: "include",
					body: JSON.stringify({ sessionId }),
				});
				navigate({ to: "/practice" });
			}
		} catch (error) {
			console.error("Error finishing session:", error);
			setIsFinishing(false);
		}
	}, [sessionId, canGetFeedback, navigate]);

	// Send message and stream response
	const sendMessage = useCallback(
		async (
			content: string,
			inputType: "text" | "voice" = "text",
			audioUrl?: string,
		) => {
			if (!sessionId || !content.trim()) return;

			const userMessageId = crypto.randomUUID();
			setMessages((prev) => [
				...prev,
				{ id: userMessageId, role: "user", content },
			]);
			setInputText("");
			setIsLoading(true);
			setShowHint(false);
			setHintSuggestions([]);

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
							audioUrl,
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
		[sessionId, playAudio],
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
					body: JSON.stringify({ audio: base64, sessionId }),
				},
			);

			if (!response.ok) throw new Error("Transcription failed");

			const { transcript, audioUrl } = await response.json();

			if (transcript) {
				await sendMessage(transcript, "voice", audioUrl);
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
					<Loader className="size-7 animate-spin text-lime-600" />
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
												if (generatingTTS.has(message.id)) return;
												if (isPlaying === message.id) {
													if (audioRef.current) {
														audioRef.current.pause();
														audioRef.current = null;
													}
													setIsPlaying(null);
												} else if (message.audio) {
													playAudio(message.audio, message.id);
												} else {
													generateTTS(message.content, message.id).then(
														(audio) => {
															if (audio) {
																playAudio(audio, message.id);
															}
														},
													);
												}
											}}
											disabled={generatingTTS.has(message.id)}
											title={
												generatingTTS.has(message.id)
													? "Generating audio..."
													: isPlaying === message.id
														? "Stop"
														: "Play"
											}
										>
											{generatingTTS.has(message.id) ? (
												<Loader2 className="size-3 animate-spin" />
											) : isPlaying === message.id ? (
												<PauseIcon className="size-3" fill="currentColor" />
											) : (
												<PlayIcon className="size-3" fill="currentColor" />
											)}
										</Button>
										<Button
											variant="outline"
											size="sm"
											className={cn(
												"rounded-lg text-xs",
												translations[message.id] &&
													"border-blue-300 bg-blue-100",
											)}
											onClick={() =>
												translateMessage(message.id, message.content)
											}
											disabled={translatingId === message.id}
											title={
												translations[message.id]
													? "Hide translation"
													: "Translate to your language"
											}
										>
											{translatingId === message.id ? (
												<Loader2 className="size-3 animate-spin" />
											) : (
												<Languages className="size-3" />
											)}
										</Button>
									</div>
								)}
								{translations[message.id] && (
									<p className="mt-2 border-black/10 border-t border-dashed pt-2 text-muted-foreground text-xs italic leading-relaxed">
										{translations[message.id]}
									</p>
								)}
							</p>
						</div>
					</div>
				))}
				<div ref={messagesEndRef} />
			</div>

			{/* Hint suggestions */}
			{showHint && (
				<div className="mx-auto mb-3 max-w-xl rounded-xl border border-amber-200 border-dashed bg-amber-50 p-3 dark:bg-amber-950/30">
					<div className="mb-2 flex items-center gap-2 text-amber-900 dark:text-amber-200">
						{/* <Lightbulb className="size-4 shrink-0" /> */}
						<p className="font-medium text-xs">You could say:</p>
					</div>
					{isLoadingHint ? (
						<div className="flex items-center gap-2 py-2 text-amber-700">
							<Loader2 className="size-3.5 animate-spin" />
							<span className="text-xs">Thinking of suggestions...</span>
						</div>
					) : (
						<div className="flex flex-col gap-1.5">
							{hintSuggestions.map((suggestion) => (
								<button
									key={suggestion}
									type="button"
									className="flex items-start gap-2 rounded-lg border border-amber-100 bg-white/70 px-3 py-2 text-left text-amber-900 text-sm transition-colors hover:border-amber-200 hover:bg-white dark:bg-white/10 dark:text-amber-100 dark:hover:bg-white/20"
									onClick={() => {
										sendMessage(suggestion);
										setShowHint(false);
									}}
									disabled={isLoading}
								>
									{/* <ArrowRight className="size-3 shrink-0 text-amber-500" /> */}
									{suggestion}
								</button>
							))}
						</div>
					)}
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
										showHint && "bg-neutral-100",
									)}
									onClick={() => {
										const next = !showHint;
										setShowHint(next);
										if (next && hintSuggestions.length === 0) {
											fetchHintSuggestions();
										}
									}}
									disabled={isLoading}
									title="Get a hint"
								>
									<Lightbulb className={cn("size-5")} />
								</Button>
							</TooltipTrigger>
							<TooltipContent>Get a hint</TooltipContent>
						</Tooltip>

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

						{/* 
						<Popover
							open={popoverOpen}
							onOpenChange={(open) => {
								setPopoverOpen(open);
								if (!open) {
									setPopoverText("");
									setNativeTranslation("");
									setPopoverMode("english");
								}
							}}
						>
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
								
									<div className="flex rounded-lg bg-neutral-100 p-0.5">
										<button
											type="button"
											className={cn(
												"flex-1 rounded-md px-3 py-1.5 font-medium text-xs transition-colors",
												popoverMode === "english"
													? "bg-white shadow-sm"
													: "text-muted-foreground hover:text-foreground",
											)}
											onClick={() => {
												setPopoverMode("english");
												setPopoverText("");
												setNativeTranslation("");
											}}
										>
											English
										</button>
										<button
											type="button"
											className={cn(
												"flex flex-1 items-center justify-center gap-1.5 rounded-md px-3 py-1.5 font-medium text-xs transition-colors",
												popoverMode === "native"
													? "bg-white shadow-sm"
													: "text-muted-foreground hover:text-foreground",
											)}
											onClick={() => {
												setPopoverMode("native");
												setPopoverText("");
												setNativeTranslation("");
											}}
										>
											<Languages className="size-3" />
											My language
										</button>
									</div>
									<div className="relative">
										<Textarea
											value={popoverText}
											onChange={(e) => {
												setPopoverText(e.target.value);
												if (popoverMode === "native") {
													setNativeTranslation("");
												}
											}}
											placeholder={
												popoverMode === "english"
													? "Type your message in English..."
													: "Type in your native language..."
											}
											className="min-h-24 resize-none rounded-lg"
											disabled={isLoading}
										/>
										<Button
											type="button"
											size="icon"
											className="absolute right-2 bottom-2 flex size-8 shrink-0 cursor-pointer items-center justify-center gap-1.5 self-end overflow-hidden whitespace-nowrap rounded-lg bg-linear-to-t from-[#202020] to-[#2F2F2F] font-base text-white shadow-[inset_0_1px_4px_0_rgba(255,255,255,0.4)] outline-none backdrop-blur transition-all hover:opacity-90 focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50 disabled:pointer-events-none disabled:opacity-40 aria-invalid:border-destructive aria-invalid:ring-destructive/20 dark:from-[rgb(192,192,192)] dark:to-[rgb(255,255,255)] dark:shadow-[inset_0_1px_4px_0_rgba(128,128,128,0.2)] dark:aria-invalid:ring-destructive/40 [&_svg]:pointer-events-none"
											disabled={
												popoverMode === "english"
													? !popoverText.trim() || isLoading
													: !nativeTranslation || isLoading
											}
											onClick={() => {
												const textToSend =
													popoverMode === "english"
														? popoverText.trim()
														: nativeTranslation;
												if (textToSend) {
													sendMessage(textToSend);
													setPopoverText("");
													setNativeTranslation("");
													setPopoverOpen(false);
												}
											}}
										>
											{isLoading ? (
												<Loader2 className="size-4 animate-spin" />
											) : (
												<Send className="size-4" />
											)}
										</Button>
									</div>
							
									{popoverMode === "native" && (
										<>
											<Button
												type="button"
												variant="outline"
												size="sm"
												className="self-start rounded-lg text-xs"
												disabled={
													!popoverText.trim() ||
													isTranslatingNative ||
													isLoading
												}
												onClick={() =>
													translateNativeToEnglish(popoverText.trim())
												}
											>
												{isTranslatingNative ? (
													<Loader2 className="size-3 animate-spin" />
												) : (
													<Languages className="size-3" />
												)}
												Translate to English
											</Button>
											{nativeTranslation && (
												<div className="rounded-lg border border-lime-200 bg-lime-50 p-3">
													<p className="mb-1 font-medium text-[10px] text-lime-700 uppercase tracking-wider">
														In English:
													</p>
													<p className="text-sm leading-relaxed">
														{nativeTranslation}
													</p>
												</div>
											)}
										</>
									)}
								</div>
							</PopoverContent>
						</Popover> */}
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
								onClick={() => {
									setShowFinishDialog(true);
								}}
								className="shrink-0 cursor-pointer rounded-xl text-red-600 hover:bg-red-50 hover:text-red-700"
								disabled={isLoading || isFinishing}
							>
								<X className="size-5" />
							</Button>
						</TooltipTrigger>
						<TooltipContent>Finish session</TooltipContent>
					</Tooltip>
				</form>
			</div>
			<AlertDialog open={showFinishDialog} onOpenChange={setShowFinishDialog}>
				<AlertDialogContent className="w-sm">
					<AlertDialogHeader>
						<AlertDialogTitle>Finish conversation</AlertDialogTitle>
						<AlertDialogDescription>
							{canGetFeedback
								? "Your session will be analyzed for pronunciation, grammar, vocabulary, and fluency. You'll receive detailed feedback."
								: `You need at least 3 responses to receive feedback (you have ${userMessageCount}). Are you sure you want to leave?`}
						</AlertDialogDescription>
					</AlertDialogHeader>
					<AlertDialogFooter>
						<AlertDialogCancel
							className="rounded-xl bg-neutral-100 text-neutral-900 hover:bg-neutral-200"
							disabled={isFinishing}
						>
							Cancel
						</AlertDialogCancel>
						<AlertDialogAction
							className={cn(
								"rounded-xl text-white",
								canGetFeedback
									? "bg-lime-600 hover:bg-lime-700"
									: "bg-red-600 hover:bg-red-700",
							)}
							onClick={handleFinishSession}
							disabled={isFinishing}
						>
							{isFinishing ? (
								<Loader2 className="size-4 animate-spin" />
							) : canGetFeedback ? (
								"Finish & Get Feedback"
							) : (
								"Leave without feedback"
							)}
						</AlertDialogAction>
					</AlertDialogFooter>
				</AlertDialogContent>
			</AlertDialog>
		</div>
	);
}
