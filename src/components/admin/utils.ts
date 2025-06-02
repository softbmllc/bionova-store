// src/components/admin/utils.ts
export function getLeagueByTeam(team: string): string | undefined {
    const teamsByLeague: Record<string, string[]> = {
      "Premier League": ["Arsenal", "Chelsea", "Liverpool", "Manchester City", "Manchester United", "Tottenham"],
      "La Liga": ["Barcelona", "Real Madrid", "Atletico Madrid", "Sevilla", "Valencia"],
      "Serie A": ["Juventus", "Inter Milan", "AC Milan", "Napoli", "Roma"],
      "Bundesliga": ["Bayern Munich", "Borussia Dortmund", "RB Leipzig"],
      "Selecciones": ["Uruguay", "Argentina", "Brasil", "Francia", "España"],
      "Uruguay": ["Nacional", "Peñarol"],
      "Retro": ["Italia 90", "Maradona 86", "Ajax 95", "Manchester United 99"]
    };
  
    for (const league in teamsByLeague) {
      if (teamsByLeague[league].includes(team)) {
        return league;
      }
    }
    return undefined;
  }
  