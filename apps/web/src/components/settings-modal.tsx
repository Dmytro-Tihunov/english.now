"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";

interface Settings {
  nativeLanguage: string;
  proficiencyLevel: string;
  dailyGoal: number;
  soundEffects: boolean;
  pronunciationFeedback: boolean;
  autoPlayAudio: boolean;
  showTranslations: boolean;
  darkMode: boolean;
}

const STORAGE_KEY = "english-now-settings";

const DEFAULT_SETTINGS: Settings = {
  nativeLanguage: "es",
  proficiencyLevel: "intermediate",
  dailyGoal: 15,
  soundEffects: true,
  pronunciationFeedback: true,
  autoPlayAudio: true,
  showTranslations: true,
  darkMode: false,
};

const LANGUAGES = [
  { code: "es", name: "Spanish" },
  { code: "pt", name: "Portuguese" },
  { code: "fr", name: "French" },
  { code: "de", name: "German" },
  { code: "it", name: "Italian" },
  { code: "zh", name: "Chinese" },
  { code: "ja", name: "Japanese" },
  { code: "ko", name: "Korean" },
  { code: "ru", name: "Russian" },
  { code: "ar", name: "Arabic" },
  { code: "hi", name: "Hindi" },
  { code: "uk", name: "Ukrainian" },
];

const PROFICIENCY_LEVELS = [
  { value: "beginner", label: "Beginner", description: "Just starting out" },
  { value: "elementary", label: "Elementary", description: "Basic phrases" },
  {
    value: "intermediate",
    label: "Intermediate",
    description: "Everyday conversations",
  },
  {
    value: "upper-intermediate",
    label: "Upper Intermediate",
    description: "Complex topics",
  },
  { value: "advanced", label: "Advanced", description: "Near fluent" },
];

const DAILY_GOALS = [
  { minutes: 5, label: "Casual", description: "5 min/day" },
  { minutes: 15, label: "Regular", description: "15 min/day" },
  { minutes: 30, label: "Serious", description: "30 min/day" },
  { minutes: 60, label: "Intense", description: "60 min/day" },
];

interface SettingsModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function SettingsModal({
  open,
  onOpenChange,
}: SettingsModalProps) {
  const [settings, setSettings] = useState<Settings>(DEFAULT_SETTINGS);
  const [hasChanges, setHasChanges] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      try {
        setSettings(JSON.parse(stored));
      } catch {
        setSettings(DEFAULT_SETTINGS);
      }
    }
  }, []);

  const updateSetting = <K extends keyof Settings>(
    key: K,
    value: Settings[K]
  ) => {
    setSettings((prev) => ({ ...prev, [key]: value }));
    setHasChanges(true);
  };

  const saveSettings = () => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(settings));
    setHasChanges(false);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[85vh] overflow-y-auto sm:max-w-[520px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 font-display text-xl">
            <svg
              className="size-5"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M12 15a3 3 0 100-6 3 3 0 000 6z"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 010 2.83 2 2 0 01-2.83 0l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-2 2 2 2 0 01-2-2v-.09A1.65 1.65 0 009 19.4a1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 01-2.83 0 2 2 0 010-2.83l.06-.06a1.65 1.65 0 00.33-1.82 1.65 1.65 0 00-1.51-1H3a2 2 0 01-2-2 2 2 0 012-2h.09A1.65 1.65 0 004.6 9a1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 010-2.83 2 2 0 012.83 0l.06.06a1.65 1.65 0 001.82.33H9a1.65 1.65 0 001-1.51V3a2 2 0 012-2 2 2 0 012 2v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 012.83 0 2 2 0 010 2.83l-.06.06a1.65 1.65 0 00-.33 1.82V9a1.65 1.65 0 001.51 1H21a2 2 0 012 2 2 2 0 01-2 2h-.09a1.65 1.65 0 00-1.51 1z"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            Settings
          </DialogTitle>
          <DialogDescription>
            Customize your learning experience
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Native Language */}
          <div className="space-y-3">
            <Label className="font-medium text-sm">Native Language</Label>
            <p className="text-muted-foreground text-xs">
              We'll use this for translations and explanations
            </p>
            <div className="grid grid-cols-3 gap-2">
              {LANGUAGES.map((lang) => (
                <button
                  key={lang.code}
                  type="button"
                  onClick={() => updateSetting("nativeLanguage", lang.code)}
                  className={`rounded-lg border px-3 py-2 text-sm transition-all ${
                    settings.nativeLanguage === lang.code
                      ? "border-[#C6F64D] bg-[#C6F64D]/10 text-[#190A26]"
                      : "border-gray-200 hover:border-gray-300 hover:bg-gray-50"
                  }`}
                >
                  {lang.name}
                </button>
              ))}
            </div>
          </div>

          {/* Proficiency Level */}
          <div className="space-y-3">
            <Label className="font-medium text-sm">English Level</Label>
            <p className="text-muted-foreground text-xs">
              This helps us personalize your content difficulty
            </p>
            <div className="space-y-2">
              {PROFICIENCY_LEVELS.map((level) => (
                <button
                  key={level.value}
                  type="button"
                  onClick={() => updateSetting("proficiencyLevel", level.value)}
                  className={`flex w-full items-center justify-between rounded-lg border px-4 py-3 text-left transition-all ${
                    settings.proficiencyLevel === level.value
                      ? "border-[#C6F64D] bg-[#C6F64D]/10"
                      : "border-gray-200 hover:border-gray-300 hover:bg-gray-50"
                  }`}
                >
                  <div>
                    <div className="font-medium text-sm">{level.label}</div>
                    <div className="text-muted-foreground text-xs">
                      {level.description}
                    </div>
                  </div>
                  {settings.proficiencyLevel === level.value && (
                    <svg
                      className="size-5 text-[#8BC34A]"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* Daily Goal */}
          <div className="space-y-3">
            <Label className="font-medium text-sm">Daily Learning Goal</Label>
            <p className="text-muted-foreground text-xs">
              Set a realistic goal to build consistency
            </p>
            <div className="grid grid-cols-4 gap-2">
              {DAILY_GOALS.map((goal) => (
                <button
                  key={goal.minutes}
                  type="button"
                  onClick={() => updateSetting("dailyGoal", goal.minutes)}
                  className={`flex flex-col items-center rounded-lg border px-3 py-3 transition-all ${
                    settings.dailyGoal === goal.minutes
                      ? "border-[#C6F64D] bg-[#C6F64D]/10"
                      : "border-gray-200 hover:border-gray-300 hover:bg-gray-50"
                  }`}
                >
                  <span className="font-semibold text-lg">{goal.minutes}</span>
                  <span className="text-muted-foreground text-xs">min</span>
                  <span className="mt-1 text-xs">{goal.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Learning Preferences */}
          <div className="space-y-4">
            <Label className="font-medium text-sm">Learning Preferences</Label>

            <div className="space-y-4 rounded-lg border border-gray-200 p-4">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label
                    htmlFor="sound-effects"
                    className="font-normal text-sm"
                  >
                    Sound Effects
                  </Label>
                  <p className="text-muted-foreground text-xs">
                    Play sounds for correct/incorrect answers
                  </p>
                </div>
                <Switch
                  id="sound-effects"
                  checked={settings.soundEffects}
                  onCheckedChange={(checked) =>
                    updateSetting("soundEffects", checked)
                  }
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label
                    htmlFor="pronunciation"
                    className="font-normal text-sm"
                  >
                    Pronunciation Feedback
                  </Label>
                  <p className="text-muted-foreground text-xs">
                    Get feedback on your speaking exercises
                  </p>
                </div>
                <Switch
                  id="pronunciation"
                  checked={settings.pronunciationFeedback}
                  onCheckedChange={(checked) =>
                    updateSetting("pronunciationFeedback", checked)
                  }
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="auto-play" className="font-normal text-sm">
                    Auto-play Audio
                  </Label>
                  <p className="text-muted-foreground text-xs">
                    Automatically play word pronunciations
                  </p>
                </div>
                <Switch
                  id="auto-play"
                  checked={settings.autoPlayAudio}
                  onCheckedChange={(checked) =>
                    updateSetting("autoPlayAudio", checked)
                  }
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="translations" className="font-normal text-sm">
                    Show Translations
                  </Label>
                  <p className="text-muted-foreground text-xs">
                    Display translations in your native language
                  </p>
                </div>
                <Switch
                  id="translations"
                  checked={settings.showTranslations}
                  onCheckedChange={(checked) =>
                    updateSetting("showTranslations", checked)
                  }
                />
              </div>
            </div>
          </div>

          {/* Appearance */}
          <div className="space-y-3">
            <Label className="font-medium text-sm">Appearance</Label>
            <div className="rounded-lg border border-gray-200 p-4">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="dark-mode" className="font-normal text-sm">
                    Dark Mode
                  </Label>
                  <p className="text-muted-foreground text-xs">
                    Switch to dark theme for night studying
                  </p>
                </div>
                <Switch
                  id="dark-mode"
                  checked={settings.darkMode}
                  onCheckedChange={(checked) =>
                    updateSetting("darkMode", checked)
                  }
                />
              </div>
            </div>
          </div>
        </div>

        <div className="flex justify-end gap-3 border-t pt-4">
          <Button variant="ghost" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button
            onClick={saveSettings}
            className="bg-[radial-gradient(100%_100%_at_50%_0%,_#EFFF9B_0%,_#D8FF76_60%,_#C6F64D_100%)] text-slate-900 hover:brightness-95"
          >
            {hasChanges ? "Save Changes" : "Done"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
