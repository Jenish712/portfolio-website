import React, { useState, useMemo } from "react";
import { Section, Pill } from "./ui/section";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { ProjectCard } from "./ProjectCard";
import { PROJECTS } from "../data/projects";
import { FolderOpen, Search, SortDesc, Filter, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export function Projects() {
  const [activeTab, setActiveTab] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState("recent"); // recent, title, category
  
  // Get unique categories
  const categories = useMemo(() => {
    const cats = [...new Set(PROJECTS.map(p => p.category))];
    return ["all", ...cats];
  }, []);

  // Filter and sort projects
  const filteredAndSortedProjects = useMemo(() => {
    let filtered = PROJECTS;
    
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
  }, [activeTab, searchQuery, sortBy]);

  const clearSearch = () => {
    setSearchQuery("");
  };

  const clearFilters = () => {
    setActiveTab("all");
    setSearchQuery("");
    setSortBy("recent");
  };

  return (
    <Section id="projects" title="Featured Projects" icon={FolderOpen}>
      <div className="space-y-6">
        {/* Enhanced controls */}
        <div className="space-y-4">
          {/* Search and sort controls */}
          <div className="flex flex-col sm:flex-row gap-4">
            {/* Search input */}
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-neutral-400" />
              <Input
                placeholder="Search projects by title, tech, or keywords..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 pr-10 bg-neutral-800/50 border-neutral-600/50 text-neutral-100 placeholder:text-neutral-400 focus:border-emerald-500 focus:ring-emerald-500/20"
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
                className="px-3 py-2 bg-neutral-800/50 border border-neutral-600/50 rounded-md text-neutral-100 text-sm focus:border-emerald-500 focus:ring-emerald-500/20"
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
                  className="border-neutral-600/50 text-neutral-300 hover:bg-neutral-700/50"
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
                <span className="text-neutral-400">Active filters:</span>
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
          <TabsList className="grid w-full grid-cols-2 md:grid-cols-4 bg-neutral-800/50 border border-neutral-700/50">
            {categories.map((category) => {
              const count = category === "all" 
                ? PROJECTS.length 
                : PROJECTS.filter(p => p.category === category).length;
              
              return (
                <TabsTrigger 
                  key={category} 
                  value={category}
                  className="data-[state=active]:bg-emerald-500/20 data-[state=active]:text-emerald-300 text-neutral-400 hover:text-neutral-200 transition-all duration-200"
                >
                  <span className="capitalize">{category}</span>
                  <span className="ml-2 px-1.5 py-0.5 text-xs bg-neutral-700/50 rounded-full">
                    {count}
                  </span>
                </TabsTrigger>
              );
            })}
          </TabsList>

          {/* Results info */}
          <div className="flex items-center justify-between mt-6 mb-4">
            <div className="text-sm text-neutral-400">
              {filteredAndSortedProjects.length === 0 ? (
                "No projects found"
              ) : (
                `Showing ${filteredAndSortedProjects.length} of ${PROJECTS.length} projects`
              )}
            </div>
            {sortBy !== "recent" && (
              <div className="text-sm text-neutral-400 flex items-center gap-1">
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
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ 
                          delay: index * 0.1,
                          duration: 0.3 
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
  );
}