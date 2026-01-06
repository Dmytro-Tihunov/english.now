import { useMutation, useQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import { Loader2, Mic, MicOff, Play, RotateCcw } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { useTRPC, useTRPCClient } from "@/utils/trpc";

export const Route = createFileRoute("/learn/conversation")({
	component: RouteComponent,
});

type RecordingState = "idle" | "recording" | "processing" | "completed";

function RouteComponent() {
	const [currentText, setCurrentText] = useState<string>("");
	const [recordingState, setRecordingState] = useState<RecordingState>("idle");
	const [audioUrl, setAudioUrl] = useState<string | null>(null);
	const [feedback, setFeedback] = useState<string | null>(null);
	const [error, setError] = useState<string | null>(null);

	const mediaRecorderRef = useRef<MediaRecorder | null>(null);
	const audioChunksRef = useRef<Blob[]>([]);
	const streamRef = useRef<MediaStream | null>(null);

	const trpc = useTRPC();
	const trpcClient = useTRPCClient();

	// Get a new text suggestion
	const { data: suggestedText, refetch: refetchText } = useQuery(
		trpc.pronunciation.getText.queryOptions(),
	);

	// Mutation for analyzing pronunciation
	const analyzeMutation = useMutation({
		mutationFn: async (input: { audio: string; text: string }) => {
			return await trpcClient.pronunciation.analyze.mutate(input);
		},
	});

	// Set initial text when suggested text is loaded
	useEffect(() => {
		if (suggestedText && !currentText) {
			setCurrentText(suggestedText);
		}
	}, [suggestedText, currentText]);

	// Cleanup audio URL
	useEffect(() => {
		return () => {
			if (audioUrl) {
				URL.revokeObjectURL(audioUrl);
			}
		};
	}, [audioUrl]);

	// Cleanup media stream
	useEffect(() => {
		return () => {
			if (streamRef.current) {
				streamRef.current.getTracks().forEach((track) => {
					track.stop();
				});
			}
		};
	}, []);

	const startRecording = async () => {
		try {
			setError(null);
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
				const url = URL.createObjectURL(blob);
				setAudioUrl(url);

				// Stop all tracks
				if (streamRef.current) {
					streamRef.current.getTracks().forEach((track) => {
						track.stop();
					});
					streamRef.current = null;
				}

				// Analyze the recording
				setRecordingState("processing");
				await analyzeRecording(blob);
			};

			mediaRecorder.start();
			setRecordingState("recording");
		} catch (err) {
			setError("Failed to access microphone. Please check your permissions.");
			console.error("Error accessing microphone:", err);
		}
	};

	const stopRecording = () => {
		if (mediaRecorderRef.current && recordingState === "recording") {
			mediaRecorderRef.current.stop();
		}
	};

	const analyzeRecording = async (blob: Blob) => {
		try {
			// Convert blob to base64
			const arrayBuffer = await blob.arrayBuffer();
			const base64 = btoa(String.fromCharCode(...new Uint8Array(arrayBuffer)));

			const result = await analyzeMutation.mutateAsync({
				audio: base64,
				text: currentText,
			});

			setFeedback(result.feedback);
			setRecordingState("completed");
		} catch (err) {
			setError("Failed to analyze pronunciation. Please try again.");
			console.error("Error analyzing pronunciation:", err);
			setRecordingState("idle");
		}
	};

	const handleNewText = () => {
		setCurrentText("");
		setAudioUrl(null);
		setFeedback(null);
		setError(null);
		setRecordingState("idle");
		refetchText();
	};

	const playRecording = () => {
		if (audioUrl) {
			const audio = new Audio(audioUrl);
			audio.play();
		}
	};

	return (
		<div className="container mx-auto max-w-4xl px-4 py-8">
			<div className="mb-8">
				<h1 className="mb-2 font-bold text-3xl">Pronunciation Trainer</h1>
				<p className="text-muted-foreground">
					Practice your pronunciation with AI-powered feedback
				</p>
			</div>

			<div className="space-y-6">
				{/* Text to pronounce */}
				<Card>
					<CardHeader>
						<CardTitle>Text to Pronounce</CardTitle>
						<CardDescription>
							Read this text aloud and record your pronunciation
						</CardDescription>
					</CardHeader>
					<CardContent>
						<div className="space-y-4">
							<div className="rounded-lg border-2 border-dashed bg-muted p-6">
								<p className="text-center text-lg leading-relaxed">
									{currentText || "Loading text..."}
								</p>
							</div>
							<Button
								variant="outline"
								onClick={handleNewText}
								disabled={
									recordingState === "recording" ||
									recordingState === "processing"
								}
								className="w-full"
							>
								<RotateCcw className="size-4" />
								Get New Text
							</Button>
						</div>
					</CardContent>
				</Card>

				{/* Recording controls */}
				<Card>
					<CardHeader>
						<CardTitle>Record Your Pronunciation</CardTitle>
						<CardDescription>
							Click the microphone button to start recording
						</CardDescription>
					</CardHeader>
					<CardContent>
						<div className="flex flex-col items-center gap-4">
							<div className="flex gap-4">
								{recordingState === "idle" && (
									<Button
										size="lg"
										onClick={startRecording}
										disabled={!currentText}
										className="size-20 rounded-full"
									>
										<Mic className="size-8" />
									</Button>
								)}

								{recordingState === "recording" && (
									<Button
										size="lg"
										onClick={stopRecording}
										variant="destructive"
										className="size-20 animate-pulse rounded-full"
									>
										<MicOff className="size-8" />
									</Button>
								)}

								{recordingState === "processing" && (
									<Button size="lg" disabled className="size-20 rounded-full">
										<Loader2 className="size-8 animate-spin" />
									</Button>
								)}

								{recordingState === "completed" && audioUrl && (
									<>
										<Button
											size="lg"
											onClick={playRecording}
											variant="outline"
											className="size-20 rounded-full"
										>
											<Play className="size-8" />
										</Button>
										<Button
											size="lg"
											onClick={startRecording}
											className="size-20 rounded-full"
										>
											<Mic className="size-8" />
										</Button>
									</>
								)}
							</div>

							{recordingState === "recording" && (
								<p className="animate-pulse text-muted-foreground text-sm">
									Recording... Click the microphone again to stop
								</p>
							)}

							{recordingState === "processing" && (
								<p className="text-muted-foreground text-sm">
									Analyzing your pronunciation...
								</p>
							)}
						</div>
					</CardContent>
				</Card>

				{/* Error display */}
				{error && (
					<Card className="border-destructive">
						<CardContent className="pt-6">
							<p className="text-destructive">{error}</p>
						</CardContent>
					</Card>
				)}

				{/* AI Feedback */}
				{feedback && recordingState === "completed" && (
					<Card>
						<CardHeader>
							<CardTitle>AI Feedback</CardTitle>
							<CardDescription>
								Here's what the AI noticed about your pronunciation
							</CardDescription>
						</CardHeader>
						<CardContent>
							<div className="rounded-lg bg-muted p-4">
								<p className="whitespace-pre-wrap">{feedback}</p>
							</div>
						</CardContent>
					</Card>
				)}
			</div>
		</div>
	);
}
