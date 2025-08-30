import MicButton from "@/components/MicButton";
import RoleSelector from "@/components/RoleSelector";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { useSession } from "@/context/SessionContext";
import { Send } from "lucide-react";
import { useState } from "react";

type Props = {
  setIsPlayersModalOpen: (open: boolean) => void;
};

const ControlPanel = ({ setIsPlayersModalOpen }: Props) => {
  const [textInput, setTextInput] = useState("");
  const [isTextInputFocused, setIsTextInputFocused] = useState(false);

  const {
    sessionId,
    currentRole,
    setCurrentRole,
    isLoading,
    loadData,
    isSubmitting,
    submitQuery,
  } = useSession();
  const handleTextSubmit = async () => {
    if (!textInput.trim() || !sessionId) return;
    await submitQuery(textInput);
    setTextInput("");
  };

  if (!sessionId) return null;

  return (
    <div className="bg-white border-b">
      <div className="container mx-auto px-4 py-6">
        <div className="flex flex-col lg:flex-row items-center gap-4">
          {/* Role Selector */}
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium text-muted-foreground">
              Current Role:
            </span>
            <RoleSelector
              value={currentRole}
              onValueChange={setCurrentRole}
              disabled={isLoading || isSubmitting}
            />
            {/* Button to open Players Table modal */}
            <Button
              variant="outline"
              onClick={() => setIsPlayersModalOpen(true)}
            >
              Show Available Players
            </Button>
          </div>

          <Separator orientation="vertical" className="hidden lg:block h-8" />

          {/* Voice Input */}
          <div className="flex items-center gap-4">
            <MicButton
              sessionId={sessionId}
              current={currentRole}
              disabled={isLoading || isSubmitting}
              onSuccess={() => loadData(sessionId)}
              isTextInputFocused={isTextInputFocused}
            />
            <span className="text-sm text-muted-foreground">
              Click to record voice command or push the{" "}
              <kbd className="bg-muted px-1 rounded">Space</kbd> key
            </span>
          </div>

          <Separator orientation="vertical" className="hidden lg:block h-8" />

          {/* Text Input */}
          <div className="flex items-center gap-2 flex-1 max-w-md">
            <Input
              placeholder="Or type your command here..."
              value={textInput}
              onFocus={() => setIsTextInputFocused(true)} // Needed to prevent keyboard shortcuts
              onBlur={() => setIsTextInputFocused(false)} // Needed to prevent keyboard shortcuts
              onChange={(e) => setTextInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Space") e.stopPropagation();
                if (e.key === "Enter") handleTextSubmit();
              }}
              disabled={isLoading || isSubmitting}
            />
            <Button
              onClick={handleTextSubmit}
              disabled={!textInput.trim() || isLoading || isSubmitting}
              size="sm"
            >
              <Send className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ControlPanel;
