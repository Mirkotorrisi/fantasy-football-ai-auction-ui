import { Button } from "@/components/ui/button";
import { useSession } from "@/context/SessionContext";
import { Download, LogOut, RefreshCw } from "lucide-react";

const Header = () => {
  const { sessionId, isLoading, loadData, handleLogout, downloadLink } =
    useSession();
  return (
    <header className="bg-white border-b shadow-sm">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <h1 className="text-2xl font-bold text-green-700">
              Fantasy Football Auction
            </h1>
            <span className="text-sm text-muted-foreground bg-muted px-2 py-1 rounded">
              Session: {sessionId}
            </span>
          </div>
          <div className="flex items-center gap-4">
            <a href={downloadLink} download target="_blank">
              <Button size="sm" disabled={isLoading}>
                <Download
                  className={`w-4 h-4 mr-2 ${isLoading ? "animate-spin" : ""}`}
                />
                Download Rosters
              </Button>
            </a>
            <Button
              variant="outline"
              size="sm"
              onClick={loadData}
              disabled={isLoading}
            >
              <RefreshCw
                className={`w-4 h-4 mr-2 ${isLoading ? "animate-spin" : ""}`}
              />
              Refresh
            </Button>
            <Button variant="outline" size="sm" onClick={handleLogout}>
              <LogOut className="w-4 h-4 mr-2" />
              Logout
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
