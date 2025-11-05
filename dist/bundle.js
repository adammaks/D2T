(() => {
  const { useState, createElement, FC } = window.React;
  const { createRoot } = window.ReactDOM;

  // From types.ts
  const MatchStatus = {
    UPCOMING: 'UPCOMING',
    LIVE: 'LIVE',
    FINISHED: 'FINISHED',
  };

  // From data/mockData.ts
  const TEAMS = [
    { id: 't1', name: 'Team Liquid', logoUrl: 'https://api.dicebear.com/8.x/bottts/svg?seed=liquid' },
    { id: 't2', name: 'Gaimin Gladiators', logoUrl: 'https://api.dicebear.com/8.x/bottts/svg?seed=gaimin' },
    { id: 't3', name: 'Tundra Esports', logoUrl: 'https://api.dicebear.com/8.x/bottts/svg?seed=tundra' },
    { id: 't4', name: 'OG', logoUrl: 'https://api.dicebear.com/8.x/bottts/svg?seed=og' },
    { id: 't5', name: 'Team Spirit', logoUrl: 'https://api.dicebear.com/8.x/bottts/svg?seed=spirit' },
    { id: 't6', name: 'BetBoom Team', logoUrl: 'https://api.dicebear.com/8.x/bottts/svg?seed=betboom' },
    { id: 't7', name: 'Falcons', logoUrl: 'https://api.dicebear.com/8.x/bottts/svg?seed=falcons' },
    { id: 't8', name: 'Xtreme Gaming', logoUrl: 'https://api.dicebear.com/8.x/bottts/svg?seed=xtreme' },
  ];
  const MATCHES = [
    { id: 'm1', teamA: TEAMS[0], teamB: TEAMS[1], scoreA: 0, scoreB: 0, status: MatchStatus.LIVE, time: 'Live Now' },
    { id: 'm2', teamA: TEAMS[2], teamB: TEAMS[3], scoreA: 0, scoreB: 0, status: MatchStatus.UPCOMING, time: '16:00 UTC' },
  ];
  const MATCH_HISTORY = [
    { id: 'm3', teamA: TEAMS[4], teamB: TEAMS[5], scoreA: 2, scoreB: 1, status: MatchStatus.FINISHED, time: 'Finished' },
    { id: 'm4', teamA: TEAMS[6], teamB: TEAMS[7], scoreA: 0, scoreB: 2, status: MatchStatus.FINISHED, time: 'Finished' },
    { id: 'm5', teamA: TEAMS[0], teamB: TEAMS[3], scoreA: 1, scoreB: 2, status: MatchStatus.FINISHED, time: 'Finished' },
  ];
  const STANDINGS = [
    { team: TEAMS[4], wins: 1, losses: 0 }, { team: TEAMS[7], wins: 1, losses: 0 }, { team: TEAMS[3], wins: 1, losses: 1 },
    { team: TEAMS[0], wins: 0, losses: 1 }, { team: TEAMS[5], wins: 0, losses: 1 }, { team: TEAMS[6], wins: 0, losses: 1 },
    { team: TEAMS[1], wins: 0, losses: 0 }, { team: TEAMS[2], wins: 0, losses: 0 },
  ].sort((a, b) => b.wins - a.wins || a.losses - b.losses);
  const initialTournamentData = {
    name: 'adam_maks-tournament', dates: 'October 26 - November 03, 2024', teams: TEAMS, matches: MATCHES, standings: STANDINGS, matchHistory: MATCH_HISTORY,
  };

  // From components/Header.tsx
  const Header = ({ isAdminMode, setIsAdminMode }) => {
    return createElement("header", { className: "bg-gray-800 shadow-lg" },
      createElement("div", { className: "container mx-auto px-4 py-4 flex justify-between items-center" },
        createElement("h1", { className: "text-2xl font-bold text-yellow-400" }, "adam_maks-tournament"),
        createElement("div", { className: "flex items-center space-x-3" },
          createElement("span", { className: "text-gray-400 text-sm font-medium" }, "Admin Mode"),
          createElement("label", { htmlFor: "admin-toggle", className: "relative inline-flex items-center cursor-pointer" },
            createElement("input", { type: "checkbox", id: "admin-toggle", className: "sr-only peer", checked: isAdminMode, onChange: () => setIsAdminMode(!isAdminMode) }),
            createElement("div", { className: "w-11 h-6 bg-gray-600 rounded-full peer peer-focus:ring-2 peer-focus:ring-yellow-500 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-yellow-500" })
          )
        )
      )
    );
  };

  // From components/TeamCard.tsx
  const TeamCard = ({ team }) => {
    return createElement("div", { className: "bg-gray-800 p-4 rounded-lg flex flex-col items-center justify-center gap-3 transition-transform transform hover:-translate-y-1 hover:shadow-lg hover:shadow-yellow-400/10" },
      createElement("img", { src: team.logoUrl, alt: `${team.name} logo`, className: "w-20 h-20 rounded-full bg-white p-2" }),
      createElement("h3", { className: "text-md font-semibold text-center text-gray-200" }, team.name)
    );
  };

  // From components/StandingsTable.tsx
  const StandingsTable = ({ standings, isAdminMode, setTournament }) => {
    const handleStandingChange = (teamId, field, value) => {
      if (!setTournament || isNaN(value)) return;
      setTournament(prev => ({
        ...prev,
        standings: prev.standings.map(s => s.team.id === teamId ? { ...s, [field]: Math.max(0, value) } : s)
          .sort((a, b) => b.wins - a.wins || a.losses - b.losses)
      }));
    };
    return createElement("div", { className: "overflow-x-auto bg-gray-800 rounded-lg shadow-md" },
      createElement("table", { className: "min-w-full" },
        createElement("thead", { className: "bg-gray-700/50" },
          createElement("tr", null,
            createElement("th", { scope: "col", className: "px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider" }, "Rank"),
            createElement("th", { scope: "col", className: "px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider" }, "Team"),
            createElement("th", { scope: "col", className: "px-6 py-3 text-center text-xs font-medium text-gray-300 uppercase tracking-wider" }, "Wins"),
            createElement("th", { scope: "col", className: "px-6 py-3 text-center text-xs font-medium text-gray-300 uppercase tracking-wider" }, "Losses")
          )
        ),
        createElement("tbody", { className: "divide-y divide-gray-700" },
          standings.map((standing, index) => createElement("tr", { key: standing.team.id, className: "hover:bg-gray-700/40 transition-colors" },
            createElement("td", { className: "px-6 py-4 whitespace-nowrap text-sm font-medium text-white" }, index + 1),
            createElement("td", { className: "px-6 py-4 whitespace-nowrap" },
              createElement("div", { className: "flex items-center" },
                createElement("div", { className: "flex-shrink-0 h-10 w-10" },
                  createElement("img", { className: "h-10 w-10 rounded-full bg-white p-1", src: standing.team.logoUrl, alt: standing.team.name })
                ),
                createElement("div", { className: "ml-4" },
                  createElement("div", { className: "text-sm font-medium text-white" }, standing.team.name)
                )
              )
            ),
            createElement("td", { className: "px-6 py-4 whitespace-nowrap text-center text-sm text-green-400 font-bold" },
              isAdminMode ? createElement("input", { type: "number", value: standing.wins, onChange: (e) => handleStandingChange(standing.team.id, 'wins', parseInt(e.target.value, 10)), className: "w-16 bg-gray-900 text-center py-1 rounded", "aria-label": `${standing.team.name} wins` }) : standing.wins
            ),
            createElement("td", { className: "px-6 py-4 whitespace-nowrap text-center text-sm text-red-400 font-bold" },
              isAdminMode ? createElement("input", { type: "number", value: standing.losses, onChange: (e) => handleStandingChange(standing.team.id, 'losses', parseInt(e.target.value, 10)), className: "w-16 bg-gray-900 text-center py-1 rounded", "aria-label": `${standing.team.name} losses` }) : standing.losses
            )
          ))
        )
      )
    );
  };
  
  // From components/MatchCard.tsx
  const recalculateStandings = (teams, finishedMatches) => {
    const standingsMap = new Map();
    teams.forEach(t => standingsMap.set(t.id, { wins: 0, losses: 0 }));
    finishedMatches.forEach(match => {
        if (match.status !== MatchStatus.FINISHED) return;
        const teamAStats = standingsMap.get(match.teamA.id);
        const teamBStats = standingsMap.get(match.teamB.id);
        if (match.scoreA > match.scoreB) { teamAStats.wins++; teamBStats.losses++; }
        else if (match.scoreB > match.scoreA) { teamBStats.wins++; teamAStats.losses++; }
    });
    return teams.map(team => ({
        team, wins: standingsMap.get(team.id).wins, losses: standingsMap.get(team.id).losses,
    })).sort((a, b) => b.wins - a.wins || a.losses - b.losses);
  };
  const TeamDisplay = ({ team, score, isWinner, reverse = false }) => (
    createElement("div", { className: `flex items-center gap-4 ${reverse ? 'flex-row-reverse' : ''}` },
      createElement("span", { className: `text-2xl font-bold ${isWinner ? 'text-white' : 'text-gray-400'}` }, score),
      createElement("div", { className: `flex items-center gap-3 ${reverse ? 'flex-row-reverse text-right' : 'text-left'}` },
        createElement("img", { src: team.logoUrl, alt: team.name, className: "w-12 h-12 rounded-full bg-gray-700 p-1 object-contain" }),
        createElement("span", { className: `text-lg font-semibold ${isWinner ? 'text-white' : 'text-gray-400'}` }, team.name)
      )
    )
  );
  const EditableTeamDisplay = ({ team, score, isWinner, onScoreChange, reverse = false }) => (
    createElement("div", { className: `flex items-center gap-4 ${reverse ? 'flex-row-reverse' : ''}` },
        createElement("input", { type: "number", value: score, onChange: (e) => onScoreChange(Math.max(0, parseInt(e.target.value, 10))), className: "w-16 bg-gray-900 text-center py-1 rounded text-2xl font-bold", "aria-label": `${team.name} score` }),
        createElement("div", { className: `flex items-center gap-3 ${reverse ? 'flex-row-reverse text-right' : 'text-left'}` },
            createElement("img", { src: team.logoUrl, alt: team.name, className: "w-12 h-12 rounded-full bg-gray-700 p-1 object-contain" }),
            createElement("span", { className: `text-lg font-semibold ${isWinner ? 'text-white' : 'text-gray-400'}` }, team.name)
        )
    )
  );
  const MatchCard = ({ match, isAdminMode, setTournament, isHistory = false }) => {
    const isFinished = match.status === MatchStatus.FINISHED;
    const teamAWins = isFinished && match.scoreA > match.scoreB;
    const teamBWins = isFinished && match.scoreB > match.scoreA;
    const handleMatchChange = (field, value) => {
        if (!setTournament) return;
        setTournament(prev => {
            const oldMatch = (isHistory ? prev.matchHistory : prev.matches).find(m => m.id === match.id);
            if (!oldMatch) return prev;
            const updatedMatch = { ...oldMatch, [field]: value };
            let newMatches = [...prev.matches];
            let newHistory = [...prev.matchHistory];
            const statusChanged = field === 'status';
            const movedToHistory = statusChanged && value === MatchStatus.FINISHED && !isHistory;
            const movedFromHistory = statusChanged && value !== MatchStatus.FINISHED && isHistory;
            if (movedToHistory) {
                newMatches = newMatches.filter(m => m.id !== match.id);
                newHistory = [...newHistory, updatedMatch];
            } else if (movedFromHistory) {
                newHistory = newHistory.filter(m => m.id !== match.id);
                newMatches = [...newMatches, updatedMatch];
            } else if (isHistory) {
                newHistory = newHistory.map(m => m.id === match.id ? updatedMatch : m);
            } else {
                newMatches = newMatches.map(m => m.id === match.id ? updatedMatch : m);
            }
            const newStandings = recalculateStandings(prev.teams, newHistory);
            return { ...prev, matches: newMatches, matchHistory: newHistory, standings: newStandings };
        });
    };
    if (isAdminMode) {
        return createElement("div", { className: "bg-gray-800 rounded-lg p-4 flex items-center justify-between shadow-md ring-2 ring-yellow-500/50" },
            createElement(EditableTeamDisplay, { team: match.teamA, score: match.scoreA, isWinner: teamAWins, onScoreChange: (score) => handleMatchChange('scoreA', score) }),
            createElement("div", { className: "text-center" },
                createElement("select", { value: match.status, onChange: e => handleMatchChange('status', e.target.value), className: "w-full bg-gray-900 border-gray-600 rounded-md py-1 px-2 focus:outline-none focus:ring-yellow-500 focus:border-yellow-500" },
                    Object.values(MatchStatus).map(status => createElement("option", { key: status, value: status }, status))
                )
            ),
            createElement(EditableTeamDisplay, { team: match.teamB, score: match.scoreB, isWinner: teamBWins, onScoreChange: (score) => handleMatchChange('scoreB', score), reverse: true })
        );
    }
    return createElement("div", { className: "bg-gray-800 rounded-lg p-4 flex items-center justify-between shadow-md hover:bg-gray-700/50 transition-colors duration-200" },
      createElement(TeamDisplay, { team: match.teamA, score: match.scoreA, isWinner: teamAWins }),
      createElement("div", { className: "text-center" },
        match.status === MatchStatus.LIVE && createElement("div", { className: "flex items-center gap-2 text-red-500 font-bold animate-pulse" },
          createElement("span", { className: "relative flex h-3 w-3" },
            createElement("span", { className: "animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75" }),
            createElement("span", { className: "relative inline-flex rounded-full h-3 w-3 bg-red-500" })
          ), "LIVE"),
        match.status === MatchStatus.UPCOMING && createElement("div", { className: "text-yellow-400 font-bold" }, match.time),
        match.status === MatchStatus.FINISHED && createElement("div", { className: "text-gray-400 font-semibold" }, "Finished")
      ),
      createElement(TeamDisplay, { team: match.teamB, score: match.scoreB, isWinner: teamBWins, reverse: true })
    );
  };

  // From components/TournamentView.tsx
  const TournamentView = ({ tournament, isAdminMode, setTournament }) => {
    const [activeTab, setActiveTab] = useState('matches');
    const TabButton = ({ tabName, label }) => createElement("button", { onClick: () => setActiveTab(tabName), className: `${activeTab === tabName ? 'border-yellow-400 text-yellow-400' : 'border-transparent text-gray-400 hover:text-gray-200 hover:border-gray-500'} whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm transition-colors focus:outline-none`, "aria-current": activeTab === tabName ? 'page' : undefined }, label);
    const renderContent = () => {
        switch (activeTab) {
            case 'matches': return createElement("div", { className: "space-y-4" }, tournament.matches.length > 0 ? tournament.matches.map(match => createElement(MatchCard, { key: match.id, match, isAdminMode, setTournament })) : createElement("p", { className: "text-gray-400" }, "No upcoming matches scheduled."));
            case 'standings': return createElement(StandingsTable, { standings: tournament.standings, isAdminMode, setTournament });
            case 'teams': return createElement("div", { className: "grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-4" }, tournament.teams.map(team => createElement(TeamCard, { key: team.id, team })));
            case 'history': return createElement("div", { className: "space-y-4" }, tournament.matchHistory.map(match => createElement(MatchCard, { key: match.id, match, isAdminMode, setTournament, isHistory: true })));
            default: return null;
        }
    };
    return createElement("div", { className: "space-y-8" },
        createElement("section", { className: "relative bg-cover bg-center bg-no-repeat h-64 md:h-80 rounded-xl overflow-hidden shadow-2xl", style: { backgroundImage: "url('https://images.unsplash.com/photo-1542751371-6593585538e3?q=80&w=2070&auto=format&fit=crop')" }, "aria-labelledby": "tournament-name" },
            createElement("div", { className: "absolute inset-0 bg-black/60" }),
            createElement("div", { className: "relative z-10 flex flex-col items-center justify-center h-full text-center text-white p-4" },
                createElement("h1", { id: "tournament-name", className: "text-4xl md:text-6xl font-extrabold tracking-tight text-yellow-300 drop-shadow-lg" }, tournament.name),
                createElement("p", { className: "mt-2 text-lg md:text-xl font-semibold text-gray-200" }, tournament.dates)
            )
        ),
        createElement("div", null,
            createElement("div", { className: "border-b border-gray-700" },
                createElement("nav", { className: "-mb-px flex space-x-8", "aria-label": "Tabs" },
                    createElement(TabButton, { tabName: "matches", label: "Matches" }),
                    createElement(TabButton, { tabName: "standings", label: "Standings" }),
                    createElement(TabButton, { tabName: "teams", label: "Teams" }),
                    createElement(TabButton, { tabName: "history", label: "Match History" })
                )
            )
        ),
        createElement("section", null, renderContent())
    );
  };
  
  // From components/AdminView.tsx
  const AdminView = ({ tournament, setTournament }) => {
    const [newMatchState, setNewMatchState] = useState({ teamAId: '', teamBId: '', time: '' });
    const handleTournamentDetailsChange = e => setTournament(prev => ({ ...prev, [e.target.name]: e.target.value }));
    const handleMatchChange = (matchId, field, value) => setTournament(prev => ({ ...prev, matches: prev.matches.map(m => m.id === matchId ? { ...m, [field]: value } : m) }));
    const handleStandingChange = (teamId, field, value) => setTournament(prev => ({ ...prev, standings: prev.standings.map(s => s.team.id === teamId ? { ...s, [field]: Math.max(0, value) } : s) }));
    const handleAddTeam = e => {
        e.preventDefault();
        const teamName = e.currentTarget.elements.teamName.value.trim();
        if (teamName && !tournament.teams.some(t => t.name.toLowerCase() === teamName.toLowerCase())) {
            const newTeam = { id: `t${Date.now()}`, name: teamName, logoUrl: `https://api.dicebear.com/8.x/bottts/svg?seed=${encodeURIComponent(teamName)}` };
            const newStanding = { team: newTeam, wins: 0, losses: 0 };
            setTournament(prev => ({ ...prev, teams: [...prev.teams, newTeam], standings: [...prev.standings, newStanding] }));
            e.currentTarget.reset();
        }
    };
    const handleRemoveTeam = teamId => {
        setTournament(prev => ({ ...prev,
            teams: prev.teams.filter(t => t.id !== teamId),
            matches: prev.matches.filter(m => m.teamA.id !== teamId && m.teamB.id !== teamId),
            standings: prev.standings.filter(s => s.team.id !== teamId)
        }));
    };
    const handleCreateMatch = e => {
        e.preventDefault();
        const { teamAId, teamBId, time } = newMatchState;
        if (!teamAId || !teamBId || teamAId === teamBId || !time.trim()) { alert("Please select two different teams and provide a time."); return; }
        const teamA = tournament.teams.find(t => t.id === teamAId);
        const teamB = tournament.teams.find(t => t.id === teamBId);
        if (!teamA || !teamB) return;
        const newMatch = { id: `m${Date.now()}`, teamA, teamB, scoreA: 0, scoreB: 0, status: MatchStatus.UPCOMING, time: time.trim() };
        setTournament(prev => ({ ...prev, matches: [...prev.matches, newMatch] }));
        setNewMatchState({ teamAId: '', teamBId: '', time: '' });
    };
    const handleNewMatchChange = e => setNewMatchState(prev => ({ ...prev, [e.target.name]: e.target.value }));

    const Fieldset = ({ legend, children }) => createElement("fieldset", { className: "border border-gray-700 rounded-lg p-4" },
        createElement("legend", { className: "px-2 text-lg font-semibold text-yellow-300" }, legend),
        children
    );
    const Input = (props) => createElement("input", { ...props, className: "mt-1 block w-full bg-gray-700 border border-gray-600 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-yellow-500 focus:border-yellow-500 sm:text-sm" });
    const Label = (props) => createElement("label", { ...props, className: "block text-sm font-medium text-gray-300" });
    const Button = (props) => createElement("button", { ...props, className: "bg-yellow-500 text-gray-900 font-bold py-2 px-4 rounded-md hover:bg-yellow-400 transition-colors " + (props.className || '') });
    const Select = (props) => createElement("select", { ...props, className: "mt-1 block w-full bg-gray-700 border-gray-600 rounded-md py-2 px-3 focus:outline-none focus:ring-yellow-500 focus:border-yellow-500 " + (props.className || '') });

    return createElement("div", { className: "bg-gray-800 p-6 rounded-lg shadow-xl space-y-8" },
        createElement("h2", { className: "text-3xl font-bold text-yellow-400 border-b border-gray-700 pb-4" }, "Admin Panel"),
        createElement(Fieldset, { legend: "Tournament Details" },
            createElement("div", { className: "space-y-4 pt-2" },
                createElement("div", null,
                    createElement(Label, { htmlFor: "name" }, "Name"),
                    createElement(Input, { type: "text", name: "name", id: "name", value: tournament.name, onChange: handleTournamentDetailsChange })
                ),
                createElement("div", null,
                    createElement(Label, { htmlFor: "dates" }, "Dates"),
                    createElement(Input, { type: "text", name: "dates", id: "dates", value: tournament.dates, onChange: handleTournamentDetailsChange })
                )
            )
        ),
        createElement(Fieldset, { legend: "Teams" },
            createElement("div", { className: "space-y-4 pt-2" },
                createElement("form", { onSubmit: handleAddTeam, className: "flex gap-4" },
                    createElement("input", { type: "text", name: "teamName", placeholder: "New team name", className: "flex-grow bg-gray-700 border border-gray-600 rounded-md py-2 px-3 focus:outline-none focus:ring-yellow-500 focus:border-yellow-500 sm:text-sm", required: true }),
                    createElement(Button, { type: "submit" }, "Add Team")
                ),
                createElement("ul", { className: "space-y-2 max-h-60 overflow-y-auto" },
                    tournament.teams.map(team => createElement("li", { key: team.id, className: "flex justify-between items-center bg-gray-700 p-2 rounded" },
                        createElement("div", { className: "flex items-center gap-3" },
                            createElement("img", { src: team.logoUrl, alt: team.name, className: "w-8 h-8 rounded-full bg-white p-1" }),
                            createElement("span", null, team.name)
                        ),
                        createElement("button", { onClick: () => handleRemoveTeam(team.id), className: "text-red-500 hover:text-red-400 font-semibold" }, "Remove")
                    ))
                )
            )
        ),
         createElement(Fieldset, { legend: "Create New Match" },
            createElement("form", { onSubmit: handleCreateMatch, className: "grid grid-cols-1 md:grid-cols-4 gap-4 items-end pt-2" },
                createElement("div", { className: "md:col-span-1" },
                    createElement(Label, { htmlFor: "teamAId" }, "Team A"),
                    createElement(Select, { name: "teamAId", id: "teamAId", value: newMatchState.teamAId, onChange: handleNewMatchChange },
                        createElement("option", { value: "" }, "Select Team"),
                        tournament.teams.map(t => createElement("option", { key: t.id, value: t.id }, t.name))
                    )
                ),
                createElement("div", { className: "md:col-span-1" },
                    createElement(Label, { htmlFor: "teamBId" }, "Team B"),
                    createElement(Select, { name: "teamBId", id: "teamBId", value: newMatchState.teamBId, onChange: handleNewMatchChange },
                        createElement("option", { value: "" }, "Select Team"),
                        tournament.teams.map(t => createElement("option", { key: t.id, value: t.id }, t.name))
                    )
                ),
                createElement("div", { className: "md:col-span-1" },
                    createElement(Label, { htmlFor: "time" }, "Time"),
                    createElement(Input, { type: "text", name: "time", id: "time", value: newMatchState.time, onChange: handleNewMatchChange, placeholder: "e.g., 18:00 UTC" })
                ),
                createElement(Button, { type: "submit", className: "w-full" }, "Create Match")
            )
        )
        // Manage sections removed for brevity, as editing is handled on the main view
    );
  };

  // From App.tsx
  const App = () => {
    const [tournamentData, setTournamentData] = useState(initialTournamentData);
    const [isAdminMode, setIsAdminMode] = useState(false);
    return createElement("div", { className: "min-h-screen bg-gray-900 font-sans" },
      createElement(Header, { isAdminMode, setIsAdminMode }),
      createElement("main", { className: "container mx-auto px-4 py-8" },
        createElement(TournamentView, { tournament: tournamentData, isAdminMode, setTournament: setTournamentData }),
        isAdminMode && createElement("div", { className: "mt-12" },
          createElement(AdminView, { tournament: tournamentData, setTournament: setTournamentData })
        )
      ),
      createElement("footer", { className: "text-center py-6 text-gray-500 text-sm" },
        createElement("p", null, "adam_maks-tournament - Inspired by BLAST.tv"),
        createElement("p", { className: "mt-2" },
          "View on ",
          createElement("a", { href: "https://github.com/adammaks/D2T/", target: "_blank", rel: "noopener noreferrer", className: "text-yellow-400 hover:underline" }, "GitHub")
        )
      )
    );
  };

  // From index.tsx
  const rootElement = document.getElementById('root');
  if (!rootElement) throw new Error("Could not find root element to mount to");
  const root = createRoot(rootElement);
  root.render(createElement(App));

})();
