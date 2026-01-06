import { Languages } from "lucide-react";
import * as React from "react";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const languages = [
  { value: "en", label: "English" },
  { value: "es", label: "Spanish" },
  { value: "fr", label: "French" },
  { value: "de", label: "German" },
  { value: "it", label: "Italian" },
  // { value: "pt", label: "Portuguese" },
  // { value: "ru", label: "Russian" },
  { value: "uk", label: "Ukrainian" },
  { value: "pl", label: "Polish" },
  // { value: "zh", label: "Chinese" },
  // { value: "ja", label: "Japanese" },
];

export function LanguageSwitcher() {
  const [interfaceLang, setInterfaceLang] = React.useState("en");
  const [nativeLang, setNativeLang] = React.useState("uk");
  const [tempInterfaceLang, setTempInterfaceLang] =
    React.useState(interfaceLang);
  const [tempNativeLang, setTempNativeLang] = React.useState(nativeLang);
  const [open, setOpen] = React.useState(false);

  const interfaceLabel = languages.find(
    (l) => l.value === interfaceLang
  )?.label;

  const handleOpenChange = (isOpen: boolean) => {
    if (isOpen) {
      setTempInterfaceLang(interfaceLang);
      setTempNativeLang(nativeLang);
    }
    setOpen(isOpen);
  };

  const handleSave = () => {
    setInterfaceLang(tempInterfaceLang);
    setNativeLang(tempNativeLang);
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        <Button
          variant="ghost"
          className="flex items-center gap-2 rounded-xl border border-gray-200 px-2 text-sm"
        >
          <Languages className="size-4" />
          <span>{interfaceLabel}</span>
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Change language</DialogTitle>
          <DialogDescription hidden={true}>
            Choose your preferred languages for the interface and translations.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Interface Language */}
          <div className="space-y-2">
            <Label htmlFor="interface-lang" className="font-medium text-sm">
              Display Language
            </Label>
            <Select
              value={tempInterfaceLang}
              onValueChange={setTempInterfaceLang}
            >
              <SelectTrigger id="interface-lang">
                <SelectValue placeholder="Select language" />
              </SelectTrigger>
              <SelectContent>
                {languages.map((lang) => (
                  <SelectItem
                    key={`interface-${lang.value}`}
                    value={lang.value}
                  >
                    {lang.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Native Language */}
          <div className="space-y-2">
            <Label htmlFor="native-lang" className="font-medium text-sm">
              Native Language
            </Label>
            <Select value={tempNativeLang} onValueChange={setTempNativeLang}>
              <SelectTrigger id="native-lang">
                <SelectValue placeholder="Select language" />
              </SelectTrigger>
              <SelectContent>
                {languages.map((lang) => (
                  <SelectItem key={`native-${lang.value}`} value={lang.value}>
                    {lang.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        <DialogFooter className="gap-2 sm:gap-0">
          <DialogClose asChild>
            <Button variant="outline">Close</Button>
          </DialogClose>
          <Button onClick={handleSave}>Save</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
