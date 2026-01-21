import { useMutation } from "@tanstack/react-query";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import {
	KeyboardIcon,
	Languages,
	Lightbulb,
	Loader2,
	Mic,
	MicOff,
	PlayIcon,
	Send,
} from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import {
	Popover,
	PopoverContent,
	PopoverTrigger,
} from "@/components/ui/popover";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import { useTRPCClient } from "@/utils/trpc";

type ConversationSearch = {
	scenario?: string;
	level?: string;
	autostart?: boolean;
};

export const Route = createFileRoute("/_conversation/conversation")({
	component: ConversationPage,
	validateSearch: (search: Record<string, unknown>): ConversationSearch => {
		return {
			scenario: search.scenario as string | undefined,
			level: search.level as string | undefined,
			autostart: search.autostart === true || search.autostart === "true",
		};
	},
});

type Message = {
	id: string;
	role: "user" | "assistant";
	content: string;
	isStreaming?: boolean;
};

type RecordingState = "idle" | "recording" | "transcribing";

function ConversationPage() {
	const { scenario, level, autostart } = Route.useSearch();
	const navigate = useNavigate();
	const [sessionId, setSessionId] = useState<string | null>(null);
	const [messages, setMessages] = useState<Message[]>([]);
	const [inputText, setInputText] = useState("");
	const [recordingState, setRecordingState] = useState<RecordingState>("idle");
	const [isLoading, setIsLoading] = useState(false);
	const [showHint, setShowHint] = useState(false);
	const [hint, setHint] = useState<string>("");
	const [popoverOpen, setPopoverOpen] = useState(false);
	const [popoverText, setPopoverText] = useState("");
	const [hasAutostarted, setHasAutostarted] = useState(false);

	const messagesEndRef = useRef<HTMLDivElement>(null);
	const mediaRecorderRef = useRef<MediaRecorder | null>(null);
	const audioChunksRef = useRef<Blob[]>([]);
	const streamRef = useRef<MediaStream | null>(null);

	const trpcClient = useTRPCClient();

	// Redirect to practice page if no valid params (conversation must be started from dialog)
	useEffect(() => {
		if (!autostart || !scenario || !level) {
			navigate({ to: "/practice" });
		}
	}, [autostart, scenario, level, navigate]);

	// Scroll to bottom when messages change
	useEffect(() => {
		messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
	}, []);

	// Auto-start conversation when params are provided
	useEffect(() => {
		if (autostart && scenario && level && !hasAutostarted && !sessionId) {
			setHasAutostarted(true);
			startConversation.mutate({
				scenario,
				level,
			});
		}
	}, [autostart, scenario, level, hasAutostarted, sessionId]);

	// Cleanup media stream on unmount
	useEffect(() => {
		return () => {
			if (streamRef.current) {
				for (const track of streamRef.current.getTracks()) {
					track.stop();
				}
			}
		};
	}, []);

	// Start conversation mutation
	const startConversation = useMutation({
		mutationFn: async (input: { scenario: string; level: string }) => {
			return await trpcClient.conversation.start.mutate({
				scenario: input.scenario as
					| "job-interview"
					| "restaurant-order"
					| "travel-directions"
					| "small-talk"
					| "doctor-visit"
					| "shopping",
				level: input.level as "beginner" | "intermediate" | "advanced",
			});
		},
		onSuccess: (data) => {
			setSessionId(data.sessionId);
			setMessages([
				{
					id: data.initialMessage.id,
					role: "assistant",
					content: data.initialMessage.content,
				},
			]);
			generateHint(data.initialMessage.content);
		},
	});

	// Generate hint based on AI's last message
	const generateHint = useCallback((_lastAiMessage: string) => {
		// Simple hints based on common responses
		const hints = [
			"Try responding with 'Yes, I...' or 'No, I don't...'",
			"You could ask a question like 'What do you recommend?'",
			"Share something about yourself: 'I like...' or 'I work as...'",
			"Ask for clarification: 'Could you repeat that?' or 'What does ... mean?'",
			"Express your opinion: 'I think that...' or 'In my opinion...'",
		];
		setHint(hints[Math.floor(Math.random() * hints.length)] || hints[0]);
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
					`${import.meta.env.VITE_SERVER_URL}/api/conversation/send`,
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

						setMessages((prev) =>
							prev.map((msg) =>
								msg.id === aiMessageId ? { ...msg, content: fullContent } : msg,
							),
						);
					}
				}

				setMessages((prev) =>
					prev.map((msg) =>
						msg.id === aiMessageId ? { ...msg, isStreaming: false } : msg,
					),
				);

				generateHint(fullContent);
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
		[sessionId, generateHint],
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
				`${import.meta.env.VITE_SERVER_URL}/api/conversation/transcribe`,
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

	// Loading screen while starting conversation
	if (!sessionId) {
		return (
			<div className="container mx-auto flex min-h-dvh max-w-3xl flex-col items-center justify-center px-4 py-8">
				<div className="flex flex-col items-center gap-4">
					<Loader2 className="size-10 animate-spin text-lime-600" />
					<p className="font-medium text-lg">Starting conversation...</p>
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
									<span className="ml-1 inline-block size-2 animate-pulse rounded-full bg-current" />
								)}
								{message.role === "assistant" && (
									<div className="mt-2 flex items-center gap-1.5">
										<Button
											variant="outline"
											size="sm"
											className="rounded-lg text-xs"
										>
											<PlayIcon className="size-3" fill="currentColor" />
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
				className="sticky inset-x-0 bottom-0 mx-auto flex justify-center overflow-hidden rounded-t-3xl border bg-white p-2.5 transition-all duration-75 ease-in hover:scale-105 dark:from-surface dark:to-transparent"
				style={{
					boxShadow:
						"rgba(162, 166, 171, 0.2) 0px 0px 0px 0px inset, rgba(162, 166, 171, 0.2) 0px 0px 8px 2px inset",
				}}
			>
				<form
					onSubmit={handleSubmit}
					className="flex items-end gap-2 rounded-xl bg-white p-2.5"
					style={{
						boxShadow:
							"0 0 0 1px rgba(0,0,0,.05),0 10px 10px -5px rgba(0,0,0,.04),0 20px 25px -5px rgba(0,0,0,.04),0 20px 32px -12px rgba(0,0,0,.04)",
					}}
				>
					{/* Hint button */}
					<Button
						type="button"
						variant="ghost"
						size="lg"
						className="shrink-0 rounded-xl"
						onClick={() => setShowHint(!showHint)}
						title="Get a hint"
					>
						<Lightbulb className={cn("size-5", showHint && "text-amber-500")} />
					</Button>

					{/* Text input */}
					{/* <div className="relative flex-1">
						<Input
							ref={inputRef}
							value={inputText}
							onChange={(e) => setInputText(e.target.value)}
							placeholder="Type your message..."
							disabled={isLoading || recordingState !== "idle"}
							className="pr-12"
						/>
					</div> */}

					{/* Voice record button */}
					<Button
						type="button"
						size="lg"
						variant={recordingState === "recording" ? "destructive" : "outline"}
						className={cn(
							"flex shrink-0 cursor-pointer items-center justify-center rounded-xl border border-[#C6F64D] bg-radial from-[#EFFF9B] to-[#D8FF76]",
							recordingState === "recording" &&
								"animate-pulse border-[#FFBABA] bg-radial from-[#FFE4E4] to-[#FFBABA]",
						)}
						onClick={
							recordingState === "recording" ? stopRecording : startRecording
						}
						disabled={isLoading || recordingState === "transcribing"}
						title={
							recordingState === "recording" ? "Stop recording" : "Record voice"
						}
					>
						{recordingState === "transcribing" ? (
							<Loader2 className="size-6 animate-spin" />
						) : recordingState === "recording" ? (
							<MicOff className="size-6" />
						) : (
							<Mic className="size-6" />
						)}
					</Button>

					{/* Send button */}
					{/* <Button
						type="submit"
						size="icon"
						className="shrink-0"
						disabled={!inputText.trim() || isLoading}
					>
						{isLoading ? (
							<Loader2 className="size-5 animate-spin" />
						) : (
							<Send className="size-5" />
						)}
					</Button> */}

					<Popover open={popoverOpen} onOpenChange={setPopoverOpen}>
						<PopoverTrigger asChild>
							<Button
								type="button"
								variant="ghost"
								size="lg"
								className="shrink-0 cursor-pointer rounded-xl"
							>
								<KeyboardIcon className="size-5" />
							</Button>
						</PopoverTrigger>
						<PopoverContent
							side="top"
							align="center"
							sideOffset={22}
							className="w-80 rounded-xl p-3"
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
				</form>

				{/* Recording indicator */}
				{/* {recordingState === "recording" && (
					<p className="mt-2 animate-pulse text-center text-muted-foreground text-sm">
						🎙️ Recording... Click the mic button to stop
					</p>
				)}
				{recordingState === "transcribing" && (
					<p className="mt-2 text-center text-muted-foreground text-sm">
						Processing your voice...
					</p>
				)} */}
			</div>
		</div>
	);
}
