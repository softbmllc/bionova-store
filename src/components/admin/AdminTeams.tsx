// src/components/admin/AdminTeams.tsx
import { useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  fetchLeagues,
  fetchSubcategories,
  fetchTeams,
  createTeam,
  deleteTeam,
} from "../../firebaseUtils";

export default function AdminTeams() {
  const [leagues, setLeagues] = useState<{ id: string; name: string }[]>([]);
  const [subcategories, setSubcategories] = useState<{ id: string; name: string }[]>([]);
  const [teams, setTeams] = useState<{ id: string; name: string }[]>([]);

  const [selectedLeagueId, setSelectedLeagueId] = useState("");
  const [selectedSubcategoryId, setSelectedSubcategoryId] = useState("");

  const [newTeam, setNewTeam] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadLeagues();
  }, []);

  const loadLeagues = async () => {
    const fetched = await fetchLeagues();
    setLeagues(fetched);
  };

  const loadSubcategories = async (leagueId: string) => {
    const fetched = await fetchSubcategories(leagueId);
    setSubcategories(fetched);
  };

  const loadTeams = async (leagueId: string, subId: string) => {
    const fetched = await fetchTeams(leagueId, subId);
    setTeams(fetched);
  };

  const handleCreateTeam = async () => {
    if (!newTeam.trim() || !selectedLeagueId || !selectedSubcategoryId) return;
    try {
      setLoading(true);
      await createTeam(selectedLeagueId, selectedSubcategoryId, newTeam.trim());
      setNewTeam("");
      await loadTeams(selectedLeagueId, selectedSubcategoryId);
    } catch (err) {
      console.error("Error creando equipo:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteTeam = async (teamId: string) => {
    if (!selectedLeagueId || !selectedSubcategoryId) return;
    try {
      setLoading(true);
      await deleteTeam(selectedLeagueId, selectedSubcategoryId, teamId);
      await loadTeams(selectedLeagueId, selectedSubcategoryId);
    } catch (err) {
      console.error("Error eliminando equipo:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-6">Administrar Equipos / Marcas</h2>

      <div className="flex gap-4 mb-4">
        <select
          className="border px-2 py-1"
          value={selectedLeagueId}
          onChange={async (e) => {
            const id = e.target.value;
            setSelectedLeagueId(id);
            setSelectedSubcategoryId("");
            setTeams([]);
            await loadSubcategories(id);
          }}
        >
          <option value="">Seleccionar Categoría</option>
          {leagues.map((l) => (
            <option key={l.id} value={l.id}>{l.name}</option>
          ))}
        </select>

        <select
          className="border px-2 py-1"
          value={selectedSubcategoryId}
          onChange={async (e) => {
            const id = e.target.value;
            setSelectedSubcategoryId(id);
            await loadTeams(selectedLeagueId, id);
          }}
          disabled={!selectedLeagueId}
        >
          <option value="">Seleccionar Subcategoría</option>
          {subcategories.map((s) => (
            <option key={s.id} value={s.id}>{s.name}</option>
          ))}
        </select>
      </div>

      {selectedSubcategoryId && (
        <div className="mb-6">
          <div className="flex gap-4 mb-4">
            <Input
              placeholder="Nuevo equipo / marca"
              value={newTeam}
              onChange={(e) => setNewTeam(e.target.value)}
            />
            <Button onClick={handleCreateTeam} disabled={loading || !newTeam.trim()}>
              Crear
            </Button>
          </div>

          <table className="w-full border text-sm">
            <thead>
              <tr className="bg-gray-100">
                <th className="px-4 py-2 border">ID</th>
                <th className="px-4 py-2 border">Equipo / Marca</th>
                <th className="px-4 py-2 border">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {teams.map((team) => (
                <tr key={team.id} className="text-center">
                  <td className="border px-4 py-2 text-xs text-gray-400">{team.id}</td>
                  <td className="border px-4 py-2 font-medium">{team.name}</td>
                  <td className="border px-4 py-2">
                    <Button
                      className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded text-xs"
                      onClick={() => handleDeleteTeam(team.id)}
                      disabled={loading}
                    >
                      Eliminar
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
