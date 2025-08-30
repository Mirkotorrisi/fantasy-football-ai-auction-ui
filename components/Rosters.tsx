import { Rosters } from "@/types";
import { RefreshCw } from "lucide-react";
import TeamCard from "./TeamCard";

type Props = {
  isLoading: boolean;
  rosters?: Rosters;
};

const rostersGridClasses = {
  6: "lg:grid-cols-6",
  8: "lg:grid-cols-8",
  10: "lg:grid-cols-10",
  12: "lg:grid-cols-12",
};

type RostersLength = 6 | 8 | 10 | 12;

const RostersComponent = ({ isLoading, rosters }: Props) => {
  if (isLoading)
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="h-64 bg-muted animate-pulse rounded-lg" />
        ))}
      </div>
    );

  const rostersGridClass =
    rostersGridClasses[rosters?.teams.length as RostersLength] ?? "";

  if (!!rosters?.teams?.length)
    return (
      <div className={`grid grid-cols-1 md:grid-cols-2 ${rostersGridClass}`}>
        {rosters?.teams?.map((teamRoster) => (
          <TeamCard
            key={teamRoster.id}
            roster={teamRoster}
            initialBudget={rosters?.initialBudget}
          />
        ))}
      </div>
    );
  return (
    <div className="text-center py-12 text-muted-foreground">
      <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
        <RefreshCw className="w-8 h-8" />
      </div>
      <p className="text-lg font-medium mb-2">No team data available</p>
      <p className="text-sm">Click refresh to load team rosters</p>
    </div>
  );
};

export default RostersComponent;
