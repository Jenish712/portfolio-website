import React, { useMemo, useState, useEffect } from "react";
import { Section } from "../components/ui/section";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Input, Textarea } from "../components/ui/input";
import { Separator } from "../components/ui/separator";
import { Badge } from "../components/ui/badge";
import { addProject, getExtraProjects, removeProjectBySlug } from "../data/projects-store";
import { api } from "../utils/api";
import { Lock, Plus, Trash2, Shield, Eye, EyeOff, LogOut, Settings } from "lucide-react";
import { Led } from "../components/ui/led";

const ADMIN_ID = process.env.REACT_APP_ADMIN_ID;
const ADMIN_KEY = process.env.REACT_APP_ADMIN_KEY;

export function Admin() {
  const [authed, setAuthed] = useState(false);
  const [id, setId] = useState("");
  const [pass, setPass] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [form, setForm] = useState({
    title: "",
    category: "",
    description: "",
    tech: "",
    tags: "",
    links: "",
  });
  const [saving, setSaving] = useState(false);
  const [token, setToken] = useState("");
  const [remoteList, setRemoteList] = useState(null);
  const extras = getExtraProjects();

  useEffect(() => {
    try {
      if (sessionStorage.getItem("admin_ok") === "1") setAuthed(true);
    } catch {}
  }, []);

  const envConfigured = Boolean(ADMIN_ID) && Boolean(ADMIN_KEY);
  const apiConfigured = Boolean(process.env.REACT_APP_API_URL);

  const tryLogin = async (e) => {
    e.preventDefault();
    if (!envConfigured) return;
    const ok = id === ADMIN_ID && pass === ADMIN_KEY;
    if (!ok) {
      alert("Invalid credentials");
      return;
    }
    // If backend API is configured, perform login to obtain JWT
    if (apiConfigured) {
      try {
        const { token } = await api.login(id, pass);
        setToken(token);
        try { sessionStorage.setItem("admin_token", token); } catch {}
      } catch (err) {
        console.error(err);
        alert("Backend login failed. Check API server.");
        return;
      }
    }
    setAuthed(true);
    setId("");
    setPass("");
    try { sessionStorage.setItem("admin_ok", "1"); } catch {}
  };

  const logout = () => {
    setAuthed(false);
    setId("");
    setPass("");
    setToken("");
    setRemoteList(null);
    try { sessionStorage.removeItem("admin_ok"); sessionStorage.removeItem("admin_token"); } catch {}
  };

  useEffect(() => {
    // Restore token if present
    try {
      const t = sessionStorage.getItem("admin_token");
      if (t) setToken(t);
    } catch {}
  }, []);

  useEffect(() => {
    // Load remote projects list when authed and API configured
    const load = async () => {
      if (!authed || !apiConfigured) return;
      try {
        const data = await api.list({ pageSize: 50 });
        setRemoteList(data.items || []);
      } catch (e) {
        console.warn("Failed to load remote projects", e);
      }
    };
    load();
  }, [authed, apiConfigured]);

  const onSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const proj = {
        title: form.title.trim(),
        category: form.category.trim() || "Misc",
        description: form.description.trim(),
        summary: form.description.trim(),
        tech: form.tech.split(",").map((s) => s.trim()).filter(Boolean),
        tags: form.tags.split(",").map((s) => s.trim()).filter(Boolean),
        links: form.links
          .split("\n")
          .map((l) => l.trim())
          .filter(Boolean)
          .map((line) => {
            const [label, url] = line.split("|");
            return { label: (label || "Link").trim(), url: (url || "#").trim() };
          }),
      };
      if (apiConfigured && token) {
        // generate slug from title
        const slug = proj.title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
        const payload = { ...proj, slug, content: [], highlights: [], metrics: [], gallery: [], detailSections: [], tech: proj.tech, tags: proj.tags, status: "draft", version: 1 };
        const created = await api.create(payload, token);
        setForm({ title: "", category: "", description: "", tech: "", tags: "", links: "" });
        alert(`Created project in API: ${created.slug}`);
        // refresh list
        try { const data = await api.list({ pageSize: 50 }); setRemoteList(data.items || []); } catch {}
      } else {
        const slug = addProject(proj);
        setForm({ title: "", category: "", description: "", tech: "", tags: "", links: "" });
        alert(`Added project: ${slug}`);
      }
    } finally {
      setSaving(false);
    }
  };

  const slugPreview = useMemo(() =>
    form.title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, ""),
    [form.title]
  );

  if (!authed) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-emerald-900/20 via-neutral-950 to-emerald-900/10 flex items-center justify-center p-4">
        <Card className="border border-emerald-800/40 bg-neutral-900/60 backdrop-blur-sm max-w-md w-full shadow-2xl">
          <CardHeader className="text-center pb-4">
            <div className="w-16 h-16 bg-emerald-500/10 rounded-full flex items-center justify-center mx-auto mb-4 border border-emerald-500/20">
              <Shield className="h-8 w-8 text-emerald-400" />
            </div>
            <CardTitle className="text-2xl font-bold bg-gradient-to-r from-emerald-300 to-teal-300 bg-clip-text text-transparent">
              Admin Portal
            </CardTitle>
            <p className="text-sm text-muted-foreground mt-2">
              Secure access to portfolio management
            </p>
          </CardHeader>
          <CardContent>
            {!envConfigured && (
              <div className="mb-4 p-3 rounded-lg border border-amber-500/20 bg-amber-500/5">
                <div className="text-sm text-amber-400 font-medium">⚠️ Configuration Required</div>
                <div className="text-xs text-amber-400/80 mt-1">
                  Set REACT_APP_ADMIN_ID and REACT_APP_ADMIN_KEY in your .env file and rebuild.
                </div>
              </div>
            )}
            <form onSubmit={tryLogin} className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium text-emerald-300">Admin ID</label>
                <Input 
                  value={id} 
                  onChange={(e) => setId(e.target.value)} 
                  placeholder="Enter admin ID"
                  className="bg-neutral-800/60 border-emerald-700/30 focus:border-emerald-500/60 text-white placeholder:text-neutral-400"
                  required
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-emerald-300">Password</label>
                <div className="relative">
                  <Input 
                    type={showPassword ? "text" : "password"}
                    value={pass} 
                    onChange={(e) => setPass(e.target.value)} 
                    placeholder="Enter password"
                    className="bg-neutral-800/60 border-emerald-700/30 focus:border-emerald-500/60 text-white placeholder:text-neutral-400 pr-10"
                    required
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-1 top-1 h-8 w-8 p-0 hover:bg-emerald-500/10"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </Button>
                </div>
              </div>
              <Button 
                type="submit" 
                disabled={!envConfigured || !id.trim() || !pass.trim()} 
                className="w-full bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-medium py-2.5 shadow-lg"
              >
                <Lock className="h-4 w-4 mr-2" />
                Access Admin Panel
              </Button>
            </form>
            <div className="mt-6 pt-4 border-t border-emerald-800/30">
              <div className="text-xs text-center text-muted-foreground">
                🔒 Secure access only • Portfolio Management System
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-900/10 via-neutral-950 to-emerald-900/5">
      {/* Admin Header */}
      <div className="sticky top-0 z-40 backdrop-blur-sm bg-neutral-950/80 border-b border-emerald-800/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-emerald-500/10 rounded-lg flex items-center justify-center border border-emerald-500/20">
                <Settings className="h-5 w-5 text-emerald-400" />
              </div>
              <div>
                <h1 className="text-xl font-bold bg-gradient-to-r from-emerald-300 to-teal-300 bg-clip-text text-transparent">
                  Admin Panel
                </h1>
                <p className="text-sm text-muted-foreground">Portfolio Management System</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Badge variant="outline" className="border-emerald-500/30 text-emerald-300">
                Authenticated
              </Badge>
              <Button
                onClick={logout}
                variant="outline"
                size="sm"
                className="border-red-500/30 text-red-400 hover:bg-red-500/10 hover:border-red-500/60"
              >
                <LogOut className="h-4 w-4 mr-2" />
                Logout
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid lg:grid-cols-3 gap-6">
          {/* Add New Project */}
          <Card className="border border-emerald-800/40 bg-neutral-900/60 backdrop-blur-sm lg:col-span-2 shadow-xl">
            <CardHeader className="pb-4">
              <CardTitle className="text-emerald-300 flex items-center gap-2">
                <Plus className="h-5 w-5" />
                Add New Project
              </CardTitle>
              <p className="text-sm text-muted-foreground">Create and publish a new portfolio project</p>
            </CardHeader>
            <CardContent>
              <form onSubmit={onSubmit} className="space-y-6">
                <div className="grid sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-emerald-300">Project Title *</label>
                    <Input 
                      required 
                      value={form.title} 
                      onChange={(e) => setForm({ ...form, title: e.target.value })}
                      placeholder="Enter project title"
                      className="bg-neutral-800/60 border-emerald-700/30 focus:border-emerald-500/60 text-white placeholder:text-neutral-400"
                    />
                    {form.title && (
                      <div className="text-xs text-muted-foreground">Slug preview: /{slugPreview}</div>
                    )}
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-emerald-300">Category</label>
                    <Input 
                      value={form.category} 
                      onChange={(e) => setForm({ ...form, category: e.target.value })}
                      placeholder="e.g., Web App, Mobile, API"
                      className="bg-neutral-800/60 border-emerald-700/30 focus:border-emerald-500/60 text-white placeholder:text-neutral-400"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-emerald-300">Description *</label>
                  <Textarea 
                    rows={4} 
                    required
                    value={form.description} 
                    onChange={(e) => setForm({ ...form, description: e.target.value })}
                    placeholder="Describe your project, its features, and impact..."
                    className="bg-neutral-800/60 border-emerald-700/30 focus:border-emerald-500/60 text-white placeholder:text-neutral-400"
                  />
                </div>

                <div className="grid sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-emerald-300">Technologies</label>
                    <Input 
                      value={form.tech} 
                      onChange={(e) => setForm({ ...form, tech: e.target.value })} 
                      placeholder="React, TypeScript, Node.js..."
                      className="bg-neutral-800/60 border-emerald-700/30 focus:border-emerald-500/60 text-white placeholder:text-neutral-400"
                    />
                    <div className="text-xs text-muted-foreground">Separate with commas</div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-emerald-300">Tags</label>
                    <Input 
                      value={form.tags} 
                      onChange={(e) => setForm({ ...form, tags: e.target.value })} 
                      placeholder="Frontend, Full-Stack, API..."
                      className="bg-neutral-800/60 border-emerald-700/30 focus:border-emerald-500/60 text-white placeholder:text-neutral-400"
                    />
                    <div className="text-xs text-muted-foreground">Used for filtering</div>
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-emerald-300">Project Links</label>
                  <Textarea 
                    rows={3} 
                    value={form.links} 
                    onChange={(e) => setForm({ ...form, links: e.target.value })} 
                    placeholder="GitHub|https://github.com/username/repo&#10;Live Demo|https://your-project.com&#10;Documentation|https://docs.your-project.com"
                    className="bg-neutral-800/60 border-emerald-700/30 focus:border-emerald-500/60 text-white placeholder:text-neutral-400"
                  />
                  <div className="text-xs text-muted-foreground">Format: Label|URL (one per line)</div>
                </div>

                <div className="flex gap-3 pt-2">
                  <Button 
                    type="submit" 
                    disabled={saving || !form.title.trim() || !form.description.trim()} 
                    className="bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-medium shadow-lg disabled:opacity-50"
                  >
                    {saving ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent mr-2" />
                        Adding...
                      </>
                    ) : (
                      <>
                        <Plus className="h-4 w-4 mr-2" />
                        Add Project
                      </>
                    )}
                  </Button>
                  <Button 
                    type="button" 
                    variant="outline"
                    onClick={() => setForm({ title: "", category: "", description: "", tech: "", tags: "", links: "" })}
                    className="border-emerald-700/50 text-emerald-300 hover:bg-emerald-500/10"
                  >
                    Clear Form
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>

          {/* Manage Projects */}
          <Card className="border border-emerald-800/40 bg-neutral-900/60 backdrop-blur-sm shadow-xl">
            <CardHeader className="pb-4">
              <CardTitle className="text-emerald-300 flex items-center gap-2">
                <Settings className="h-5 w-5" />
                Manage Projects
              </CardTitle>
              <div className="flex items-center justify-between gap-2">
                <p className="text-sm text-muted-foreground">
                  {apiConfigured
                    ? `${remoteList?.length ?? 0} API project${(remoteList?.length ?? 0) !== 1 ? 's' : ''}`
                    : `${extras.length} locally added project${extras.length !== 1 ? 's' : ''}`}
                </p>
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <Led on={apiConfigured} />
                  <span>{apiConfigured ? (token ? "API mode: Connected" : "API mode: Not logged in") : "Local mode"}</span>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              {apiConfigured ? (
                (remoteList?.length ?? 0) === 0 ? (
                  <div className="text-center py-8">
                    <div className="w-12 h-12 bg-emerald-500/10 rounded-full flex items-center justify-center mx-auto mb-3 border border-emerald-500/20">
                      <Plus className="h-6 w-6 text-emerald-400" />
                    </div>
                    <div className="text-sm text-muted-foreground mb-2">No projects in API yet</div>
                    <div className="text-xs text-muted-foreground">Add your first project using the form</div>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {remoteList.map((p) => (
                      <div key={p.id} className="group rounded-lg border border-emerald-800/30 bg-neutral-800/40 p-4 hover:border-emerald-600/50 transition-all duration-200">
                        <div className="flex items-start justify-between gap-3">
                          <div className="flex-1 min-w-0">
                            <div className="font-medium text-white truncate">{p.title}</div>
                            <div className="text-xs text-emerald-400 mt-1">/{p.slug}</div>
                            <div className="text-xs text-muted-foreground mt-2 line-clamp-2">{p.summary}</div>
                            {Array.isArray(p.tags) && p.tags.length > 0 && (
                              <div className="flex flex-wrap gap-1 mt-2">
                                {p.tags.slice(0, 3).map((tag) => (
                                  <Badge key={tag} variant="outline" className="text-xs border-emerald-700/50 text-emerald-300">
                                    {tag}
                                  </Badge>
                                ))}
                                {p.tags.length > 3 && (
                                  <Badge variant="outline" className="text-xs border-emerald-700/50 text-emerald-300">
                                    +{p.tags.length - 3}
                                  </Badge>
                                )}
                              </div>
                            )}
                          </div>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={async () => {
                              if (!window.confirm(`Delete "${p.title}"?`)) return;
                              try {
                                await api.remove(p.id, token);
                                const data = await api.list({ pageSize: 50 });
                                setRemoteList(data.items || []);
                              } catch (e) {
                                alert('Failed to delete via API');
                              }
                            }}
                            className="border-red-500/30 text-red-400 hover:bg-red-500/10 hover:border-red-500/60 opacity-0 group-hover:opacity-100 transition-opacity"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                )
              ) : (
                extras.length === 0 ? (
                  <div className="text-center py-8">
                    <div className="w-12 h-12 bg-emerald-500/10 rounded-full flex items-center justify-center mx-auto mb-3 border border-emerald-500/20">
                      <Plus className="h-6 w-6 text-emerald-400" />
                    </div>
                    <div className="text-sm text-muted-foreground mb-2">No projects added yet</div>
                    <div className="text-xs text-muted-foreground">Add your first project using the form</div>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {extras.map((p) => (
                      <div key={p.slug} className="group rounded-lg border border-emerald-800/30 bg-neutral-800/40 p-4 hover:border-emerald-600/50 transition-all duration-200">
                        <div className="flex items-start justify-between gap-3">
                          <div className="flex-1 min-w-0">
                            <div className="font-medium text-white truncate">{p.title}</div>
                            <div className="text-xs text-emerald-400 mt-1">/{p.slug}</div>
                            <div className="text-xs text-muted-foreground mt-2 line-clamp-2">{p.description}</div>
                            {p.tags && p.tags.length > 0 && (
                              <div className="flex flex-wrap gap-1 mt-2">
                                {p.tags.slice(0, 3).map((tag) => (
                                  <Badge key={tag} variant="outline" className="text-xs border-emerald-700/50 text-emerald-300">
                                    {tag}
                                  </Badge>
                                ))}
                                {p.tags.length > 3 && (
                                  <Badge variant="outline" className="text-xs border-emerald-700/50 text-emerald-300">
                                    +{p.tags.length - 3}
                                  </Badge>
                                )}
                              </div>
                            )}
                          </div>
                          <Button 
                            variant="outline" 
                            size="sm" 
                            onClick={() => {
                              if (window.confirm(`Delete "${p.title}"?`)) {
                                removeProjectBySlug(p.slug);
                              }
                            }}
                            className="border-red-500/30 text-red-400 hover:bg-red-500/10 hover:border-red-500/60 opacity-0 group-hover:opacity-100 transition-opacity"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                )
              )}
            </CardContent>
          </Card>
        </div>
        
        <div className="mt-8 p-4 rounded-lg border border-emerald-800/30 bg-neutral-900/40">
          <div className="text-xs text-center text-muted-foreground">
            🔒 Admin access is client-side only for demo purposes. Use a real backend for production security.
          </div>
        </div>
      </div>
    </div>
  );
}

export default Admin;

