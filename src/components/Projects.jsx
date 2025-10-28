import React, { useState, useMemo, useEffect } from "react";
import { Section, Pill } from "./ui/section";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { ScrollReveal } from "./ui/scroll-reveal";
import { ProjectCard } from "./ProjectCard";
import { getAllProjects } from "../data/projects-store";
import { api } from "../utils/api";
import { FolderOpen, Search, SortDesc, Filter, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export function Projects() {
  const [activeTab, setActiveTab] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState("recent"); // recent, title, category
  const [apiProjects, setApiProjects] = useState([]);
  const [loadingApi, setLoadingApi] = useState(false);
  
  // Fetch published projects from API
  useEffect(() => {
    const fetchApiProjects = async () => {
      // Check if API is configured
      const apiConfigured = Boolean(process.env.REACT_APP_API_URL);
      
      console.log('[Projects] useEffect running');
      console.log('[Projects] API configured:', apiConfigured);
      console.log('[Projects] REACT_APP_API_URL:', process.env.REACT_APP_API_URL);
      
      if (!apiConfigured) {
        console.log('[Projects] API not configured, skipping fetch');
        return;
      }

      setLoadingApi(true);
      try {
        console.log('[Projects] Fetching published projects from API...');
        const response = await api.list({ status: 'published', pageSize: 50 });
        console.log('[Projects] API response:', response);
        setApiProjects(response.items || []);
      } catch (error) {
        console.error('[Projects] Failed to fetch API projects:', error);
        setApiProjects([]);
      } finally {
        setLoadingApi(false);
      }
    };

    // Temporarily disabled - check browser console for errors
    // fetchApiProjects();
  }, []);

  // Get all projects (static + local + API)
  const allProjects = useMemo(() => {
    const staticAndLocal = getAllProjects();
    // Combine with API projects, avoiding duplicates by slug
    const existingSlugs = new Set(staticAndLocal.map(p => p.slug));
    const uniqueApiProjects = apiProjects.filter(p => !existingSlugs.has(p.slug));
    return [...staticAndLocal, ...uniqueApiProjects];
  }, [apiProjects]);
  
  // Get unique categories
  const categories = useMemo(() => {
    const cats = [...new Set(allProjects.map(p => p.category))];
    return ["all", ...cats];
  }, [allProjects]);

  // Filter and sort projects
  const filteredAndSortedProjects = useMemo(() => {
    let filtered = allProjects;
    
    // Filter by category
    if (activeTab !== "all") {
      filtered = filtered.filter(p => p.category === activeTab);
    }
    
    // Filter by search query
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase().trim();
      filtered = filtered.filter(p => 
        p.title.toLowerCase().includes(query) ||
        p.description.toLowerCase().includes(query) ||
        p.tech.some(tech => tech.toLowerCase().includes(query)) ||
        p.tags.some(tag => tag.toLowerCase().includes(query))
      );
    }
    
    // Sort projects
    switch (sortBy) {
      case "title":
        filtered = [...filtered].sort((a, b) => a.title.localeCompare(b.title));
        break;
      case "category":
        filtered = [...filtered].sort((a, b) => a.category.localeCompare(b.category));
        break;
      case "recent":
      default:
        // Keep original order (most recent first)
        break;
    }
    
    return filtered;
  }, [allProjects, activeTab, searchQuery, sortBy]);

  const clearSearch = () => {
    setSearchQuery("");
  };

  const clearFilters = () => {
    setActiveTab("all");
    setSearchQuery("");
    setSortBy("recent");
  };

  return (
    <ScrollReveal delay={0.3} direction="left" duration={1.0}>
      <Section id="projects" title="Featured Projects" icon={FolderOpen}>
      <div className="space-y-6">
        {/* Enhanced controls */}
        <div className="space-y-4">
          {/* Search and sort controls */}
          <div className="flex flex-col sm:flex-row gap-4">
            {/* Search input */}
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search projects by title, tech, or keywords..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 pr-10"
              />
              {searchQuery && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={clearSearch}
                  className="absolute right-1 top-1/2 transform -translate-y-1/2 h-6 w-6 p-0 hover:bg-neutral-700/50"
                >
                  <X className="h-3 w-3" />
                </Button>
              )}
            </div>
            
            {/* Sort dropdown */}
            <div className="flex gap-2">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="px-3 py-2 bg-background border rounded-md text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              >
                <option value="recent">Most Recent</option>
                <option value="title">Title A-Z</option>
                <option value="category">Category</option>
              </select>
              
              {(activeTab !== "all" || searchQuery || sortBy !== "recent") && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={clearFilters}
                  className="border text-muted-foreground hover:bg-accent"
                >
                  <Filter className="h-4 w-4 mr-1" />
                  Clear
                </Button>
              )}
            </div>
          </div>

          {/* Active filters indicator */}
          <AnimatePresence>
            {(activeTab !== "all" || searchQuery) && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="flex flex-wrap gap-2 text-sm"
              >
                <span className="text-muted-foreground">Active filters:</span>
                {activeTab !== "all" && (
                  <Pill variant="secondary" className="bg-emerald-500/10 text-emerald-300 border-emerald-500/30">
                    Category: {activeTab}
                  </Pill>
                )}
                {searchQuery && (
                  <Pill variant="secondary" className="bg-blue-500/10 text-blue-300 border-blue-500/30">
                    Search: "{searchQuery}"
                  </Pill>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Enhanced tabs with project counts */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          {/* Mobile: Dropdown select */}
          <div className="md:hidden">
            <select
              value={activeTab}
              onChange={(e) => setActiveTab(e.target.value)}
              className="w-full px-4 py-3 bg-card/60 dark:bg-neutral-900/40 border dark:border-emerald-800/40 rounded-md text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 capitalize"
            >
              {categories.map((category) => {
                const count = category === "all" 
                  ? allProjects.length 
                  : allProjects.filter(p => p.category === category).length;
                
                return (
                  <option key={category} value={category} className="capitalize">
                    {category} ({count})
                  </option>
                );
              })}
            </select>
          </div>

          {/* Desktop: Tab buttons */}
          <TabsList className="hidden md:flex w-full h-auto flex-wrap justify-start gap-2 bg-card/60 dark:bg-neutral-900/40 border dark:border-emerald-800/40 p-2 rounded-md">
            {categories.map((category) => {
              const count = category === "all" 
                ? allProjects.length 
                : allProjects.filter(p => p.category === category).length;
              
              return (
                <TabsTrigger 
                  key={category} 
                  value={category}
                  className="flex-shrink-0 px-3 py-2 hover:text-foreground data-[state=active]:bg-emerald-500/20 data-[state=active]:text-emerald-300"
                >
                  <span className="capitalize truncate max-w-[200px]" title={category}>
                    {category}
                  </span>
                  <span className="ml-2 px-1.5 py-0.5 text-xs bg-foreground/10 text-foreground/70 rounded-full flex-shrink-0">
                    {count}
                  </span>
                </TabsTrigger>
              );
            })}
          </TabsList>

          {/* Results info */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mt-6 mb-4">
            <div className="text-sm text-muted-foreground order-2 sm:order-1">
              {filteredAndSortedProjects.length === 0 ? (
                "No projects found"
              ) : (
                `Showing ${filteredAndSortedProjects.length} of ${allProjects.length} projects`
              )}
            </div>
            {sortBy !== "recent" && (
              <div className="text-sm text-muted-foreground flex items-center gap-1 order-1 sm:order-2">
                <SortDesc className="h-4 w-4" />
                Sorted by {sortBy}
              </div>
            )}
          </div>

          {categories.map((category) => (
            <TabsContent key={category} value={category} className="mt-0">
              <AnimatePresence mode="wait">
                {filteredAndSortedProjects.length === 0 ? (
                  <motion.div
                    key="empty"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    className="text-center py-12"
                  >
                    <FolderOpen className="h-16 w-16 text-neutral-600 mx-auto mb-4" />
                    <h3 className="text-xl font-semibold text-neutral-300 mb-2">No Projects Found</h3>
                    <p className="text-neutral-400 mb-6">
                      {searchQuery ? `No projects match "${searchQuery}"` : `No projects in ${category} category`}
                    </p>
                    <Button 
                      onClick={clearFilters}
                      className="bg-emerald-600 hover:bg-emerald-500"
                    >
                      View All Projects
                    </Button>
                  </motion.div>
                ) : (
                  <motion.div
                    key="projects"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
                  >
                      {filteredAndSortedProjects.map((project, index) => (
                        <motion.div
                          key={project.slug}
                          initial={{ opacity: 0, y: 40, scale: 0.9 }}
                          animate={{ opacity: 1, y: 0, scale: 1 }}
                          transition={{ 
                            delay: index * 0.12,
                            duration: 0.7,
                            ease: [0.21, 0.47, 0.32, 0.98]
                          }}
                        >
                        <ProjectCard project={project} />
                      </motion.div>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </TabsContent>
          ))}
        </Tabs>
      </div>
    </Section>
    </ScrollReveal>
  );
}


