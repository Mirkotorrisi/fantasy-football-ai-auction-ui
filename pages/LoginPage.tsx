"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useSession } from "@/context/SessionContext";
import { useToast } from "@/hooks/use-toast";
import {
  MAX_TEAMS_LENGTH,
  MIN_TEAMS_LENGTH,
  VALID_TEAMS_LENGTH,
} from "@/lib/consts";
import { createSession } from "@/services/api";
import { LogIn, Plus } from "lucide-react";
import { useCallback, useEffect, useState } from "react";

export default function LoginPage() {
  const [resumeSessionId, setResumeSessionId] = useState("");

  const [teamNames, setTeamNames] = useState<string[]>([
    "",
    "",
    "",
    "",
    "",
    "",
  ]);
  const [budget, setBudget] = useState(500);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const { setSessionId, setIsLoading } = useSession();
  const { toast } = useToast();

  const handleResumeSession = useCallback(() => {
    if (!resumeSessionId.trim()) {
      toast({
        title: "Error",
        description: "Please enter a valid session ID",
        variant: "destructive",
      });
      return;
    }
    const trimmedId = resumeSessionId.trim();
    setSessionId(trimmedId);
    localStorage.setItem("sessionId", trimmedId);
  }, [resumeSessionId, setSessionId, toast]);

  // Load session ID from localStorage on mount
  useEffect(() => {
    const latestSessionId = localStorage.getItem("sessionId") || "";
    if (latestSessionId) {
      setResumeSessionId(latestSessionId);
      handleResumeSession();
    }
  }, [setResumeSessionId, handleResumeSession]);

  const handleTeamNameChange = (index: number, value: string) => {
    const newTeamNames = [...teamNames];
    newTeamNames[index] = value;
    setTeamNames(newTeamNames);
  };

  const addTeamSlot = () => {
    if (teamNames.length < MAX_TEAMS_LENGTH) {
      setTeamNames([...teamNames, ""]);
    }
  };

  const removeTeamSlot = () => {
    if (teamNames.length > MIN_TEAMS_LENGTH) {
      setTeamNames(teamNames.slice(0, -1));
    }
  };

  const handleCreateSession = async () => {
    const validTeamNames = teamNames.filter((name) => name.trim() !== "");

    if (!VALID_TEAMS_LENGTH.includes(validTeamNames.length)) {
      toast({
        title: "Error",
        description: "You must have exactly 6, 8, 10, or 12 team names",
        variant: "destructive",
      });
      return;
    }

    if (budget <= 0) {
      toast({
        title: "Error",
        description: "Budget must be greater than 0",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    try {
      const response = await createSession({
        team_names: validTeamNames,
        budget,
      });
      setSessionId(response.sessionId);
      localStorage.setItem("sessionId", response.sessionId);
      setIsDialogOpen(false);
      toast({
        title: "Success",
        description: "New session created successfully!",
      });
    } catch (error) {
      toast({
        title: "Error",
        description:
          error instanceof Error ? error.message : "Failed to create session",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-bold text-green-700">
            Fantasy Football Auction
          </CardTitle>
          <CardDescription>
            Manage your fantasy football auction with AI assistance
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="sessionId">Resume Existing Session</Label>
            <Input
              id="sessionId"
              placeholder="Enter session ID"
              value={resumeSessionId}
              onChange={(e) => setResumeSessionId(e.target.value)}
            />
            <Button
              onClick={handleResumeSession}
              className="w-full bg-transparent"
              variant="outline"
            >
              <LogIn className="w-4 h-4 mr-2" />
              Enter Session
            </Button>
          </div>

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-background px-2 text-muted-foreground">
                Or
              </span>
            </div>
          </div>

          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button className="w-full bg-green-600 hover:bg-green-700">
                <Plus className="w-4 h-4 mr-2" />
                New Session
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-md max-h-[80vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>Create New Session</DialogTitle>
                <DialogDescription>
                  Configure your fantasy football auction settings
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label>
                    Team Names ({teamNames.filter((name) => name.trim()).length}
                    /12)
                  </Label>
                  {teamNames.map((name, index) => (
                    <Input
                      key={index}
                      placeholder={`Team ${index + 1}`}
                      value={name}
                      onChange={(e) =>
                        handleTeamNameChange(index, e.target.value)
                      }
                    />
                  ))}
                  <div className="flex gap-2">
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={addTeamSlot}
                      disabled={teamNames.length >= 12}
                    >
                      Add Team
                    </Button>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={removeTeamSlot}
                      disabled={teamNames.length <= 6}
                    >
                      Remove Team
                    </Button>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="budget">Budget per Team</Label>
                  <Input
                    id="budget"
                    type="number"
                    value={budget}
                    onChange={(e) => setBudget(Number(e.target.value))}
                    min="1"
                  />
                </div>
                <Button onClick={handleCreateSession} className="w-full">
                  Create Session
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </CardContent>
      </Card>
    </div>
  );
}
