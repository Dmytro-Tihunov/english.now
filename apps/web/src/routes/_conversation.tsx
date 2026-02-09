import {
	createFileRoute,
	Link,
	Outlet,
	redirect,
} from "@tanstack/react-router";
import { Check, Loader2, SettingsIcon, X } from "lucide-react";
import { useEffect, useState } from "react";
import Logo from "@/components/logo";
import { Button } from "@/components/ui/button";
import {
	Popover,
	PopoverContent,
	PopoverTrigger,
} from "@/components/ui/popover";
import { Switch } from "@/components/ui/switch";
import { getUser } from "@/functions/get-user";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/_conversation")({
	beforeLoad: async () => {
		const session = await getUser();
		if (!session) {
			throw redirect({
				to: "/login",
			});
		}
		return { session };
	},
	component: ConversationLayout,
	pendingComponent: ConversationPending,
});

function ConversationPending() {
	return (
		<div className="flex h-dvh w-full items-center justify-center">
			<Loader2 className="size-8 animate-spin text-muted-foreground" />
		</div>
	);
}

function ConversationLayout() {
	const [audioDevices, setAudioDevices] = useState<MediaDeviceInfo[]>([]);
	const [selectedDevice, setSelectedDevice] = useState<string>("");

	const [monitorAudio, setMonitorAudio] = useState(false);
	const [settingsOpen, setSettingsOpen] = useState(false);

	// Get available audio input devices
	useEffect(() => {
		const getDevices = async () => {
			try {
				// Request permission first to get device labels
				await navigator.mediaDevices.getUserMedia({ audio: true });
				const devices = await navigator.mediaDevices.enumerateDevices();
				const audioInputs = devices.filter(
					(device) => device.kind === "audioinput",
				);
				setAudioDevices(audioInputs);
				if (audioInputs.length > 0 && !selectedDevice) {
					setSelectedDevice(audioInputs[0].deviceId);
				}
			} catch (err) {
				console.error("Error getting audio devices:", err);
			}
		};

		if (settingsOpen) {
			getDevices();
		}
	}, [settingsOpen, selectedDevice]);

	return (
		<div className="flex h-dvh w-full bg-neutral-50 dark:bg-neutral-900">
			<main className="relative flex h-full w-full flex-1 flex-col overflow-auto">
				<div className="sticky border-black/5 border-b dark:bg-neutral-900">
					<div className="container relative z-10 mx-auto max-w-3xl px-4">
						<nav className="flex grid-cols-2 items-center justify-between py-5 md:grid-cols-5">
							<div className="items-center gap-2 md:flex">
								<Logo />

								{/* <div className="flex flex-col">
									<div className="font-medium text-sm">Practice Session</div>
									<div className="text-lime-700 text-xs">Conversation</div>
								</div> */}
							</div>
							<div className="flex items-center gap-2 divide-x divide-gray-200">
								<Popover open={settingsOpen} onOpenChange={setSettingsOpen}>
									<PopoverTrigger asChild>
										<Button
											variant="outline"
											size="icon"
											className="size-10 rounded-xl"
										>
											<SettingsIcon className="size-4" />
										</Button>
									</PopoverTrigger>
									<PopoverContent
										side="bottom"
										align="end"
										sideOffset={8}
										className="w-64 rounded-xl p-4"
									>
										<div className="flex flex-col gap-5">
											{/* Device Selection */}
											<div className="flex flex-col gap-3">
												<p className="text-muted-foreground text-sm">
													Select input device
												</p>
												<div className="flex flex-col gap-1">
													{audioDevices.map((device) => (
														<button
															key={device.deviceId}
															type="button"
															onClick={() => setSelectedDevice(device.deviceId)}
															className={cn(
																"flex items-center justify-between rounded-lg px-3 py-2.5 text-left text-sm transition-colors hover:bg-muted",
																selectedDevice === device.deviceId &&
																	"bg-muted",
															)}
														>
															<span className="font-medium">
																{device.label ||
																	`Microphone ${audioDevices.indexOf(device) + 1}`}
															</span>
															{selectedDevice === device.deviceId && (
																<Check className="size-4 text-primary" />
															)}
														</button>
													))}
													{audioDevices.length === 0 && (
														<p className="px-3 py-2 text-muted-foreground text-sm">
															No audio devices found
														</p>
													)}
												</div>
											</div>

											{/* Input Gain */}
											{/* <div className="flex flex-col gap-3">
												<p className="text-muted-foreground text-sm">
													Input gain
												</p>
												<div className="flex items-center gap-3">
													<input
														type="range"
														min="-20"
														max="20"
														value={inputGain}
														onChange={(e) =>
															setInputGain(Number(e.target.value))
														}
														className="h-2 flex-1 cursor-pointer appearance-none rounded-full bg-muted [&::-webkit-slider-thumb]:size-4 [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:border-2 [&::-webkit-slider-thumb]:border-background [&::-webkit-slider-thumb]:bg-foreground [&::-webkit-slider-thumb]:shadow-sm"
													/>
													<div className="flex h-9 w-14 items-center justify-center rounded-lg border bg-muted/50 font-medium text-sm">
														{inputGain}DB
													</div>
												</div>
											</div> */}

											{/* Monitor Audio */}
											<div className="flex items-center justify-between">
												<p className="text-muted-foreground text-sm">
													Monitor input audio
												</p>
												<Switch
													checked={monitorAudio}
													onCheckedChange={setMonitorAudio}
												/>
											</div>
										</div>
									</PopoverContent>
								</Popover>
							</div>
						</nav>
					</div>
				</div>
				<Outlet />
			</main>
		</div>
	);
}
