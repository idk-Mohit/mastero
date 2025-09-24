import { useEffect, useState } from "react";

type Skill = {
  id: number;
  name: string;
  description: string;
  is_active: number;
};

export default function SkillsSection() {
  const [skills, setSkills] = useState<Skill[]>([]);
  const [loading, setLoading] = useState(false);
  const [newSkill, setNewSkill] = useState({ name: "", description: "" });
  const [open, setOpen] = useState(false);

  const loadSkills = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/skills");
      const data = await res.json();
      if (data.success) {
        setSkills(data.data);
      }
    } catch (err) {
      console.error("Failed to load skills:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadSkills();
  }, []);

  const addSkill = async () => {
    try {
      const res = await fetch("/api/skills", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: newSkill.name,
          description: newSkill.description,
          is_active: 1,
        }),
      });
      const data = await res.json();
      if (data.success) {
        loadSkills();
        setNewSkill({ name: "", description: "" });
        setOpen(false);
      }
    } catch (err) {
      console.error("Failed to add skill:", err);
    }
  };

  const deleteSkill = async (id: number) => {
    try {
      await fetch(`/api/skills/${id}`, { method: "DELETE" });
      loadSkills();
    } catch (err) {
      console.error("Failed to delete skill:", err);
    }
  };

  return (
    <div className="card-enhanced rounded-xl p-6 animate-fade-in">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
          Manage Skills
        </h2>
        <button
          onClick={() => setOpen(true)}
          className="btn-gradient px-4 py-2 text-white font-medium rounded-lg"
        >
          Add Skill
        </button>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-12">
          <div className="spinner w-8 h-8 border-4 border-purple-200 border-t-purple-600 rounded-full"></div>
        </div>
      ) : skills.length === 0 ? (
        <div className="text-center py-12">
          <div className="w-16 h-16 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
            <svg
              className="w-8 h-8 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
              />
            </svg>
          </div>
          <p className="text-gray-500 font-medium">No skills found</p>
        </div>
      ) : (
        <div className="overflow-hidden rounded-lg border border-gray-200">
          <table className="w-full">
            <thead className="bg-gradient-to-r from-gray-50 to-gray-100">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Name
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Description
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {skills.map((skill, index) => (
                <tr
                  key={skill.id}
                  className="table-row-hover stagger-item"
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <td className="px-4 py-3 text-sm font-medium text-gray-900">
                    {skill.name}
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-500">
                    {skill.description}
                  </td>
                  <td className="px-4 py-3 text-sm">
                    <span
                      className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                        skill.is_active
                          ? "status-active text-white"
                          : "status-inactive text-white"
                      }`}
                    >
                      {skill.is_active ? "Active" : "Inactive"}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-sm">
                    <div className="flex gap-2">
                      <button
                        onClick={() =>
                          alert("Edit modal coming soon for " + skill.name)
                        }
                        className="px-3 py-1 text-xs text-blue-600 hover:bg-blue-50 rounded-lg transition-colors duration-200"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => deleteSkill(skill.id)}
                        className="px-3 py-1 text-xs text-red-600 hover:bg-red-50 rounded-lg transition-colors duration-200"
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Add Skill Modal */}
      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center modal-backdrop animate-fade-in">
          <div className="bg-white rounded-xl shadow-2xl max-w-md w-full m-4 animate-scale-in">
            <div className="p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Add New Skill
              </h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Name
                  </label>
                  <input
                    type="text"
                    value={newSkill.name}
                    onChange={(e) =>
                      setNewSkill({ ...newSkill, name: e.target.value })
                    }
                    placeholder="e.g. React"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Description
                  </label>
                  <input
                    type="text"
                    value={newSkill.description}
                    onChange={(e) =>
                      setNewSkill({ ...newSkill, description: e.target.value })
                    }
                    placeholder="Skill description"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  />
                </div>
                <div className="flex gap-3 pt-4">
                  <button
                    onClick={addSkill}
                    className="flex-1 btn-gradient py-2 text-white font-medium rounded-lg"
                  >
                    Save
                  </button>
                  <button
                    onClick={() => setOpen(false)}
                    className="flex-1 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors duration-200"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
