"use client";

import { useEffect, useState } from "react";
import { PageHeader } from "@/components/shared/PageHeader";
import { nexusService, NexusImage } from "@/services/nexus.service";
import { authService } from "@/services/auth.service";
import { Search, Tag, Box, RefreshCw, Folder, ChevronLeft, ChevronRight, Clock, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/Button";

type ViewMode = 'images' | 'repositories';

export default function RegistryPage() {
    const [viewMode, setViewMode] = useState<ViewMode>('images');
    const [images, setImages] = useState<NexusImage[]>([]);
    const [repositories, setRepositories] = useState<string[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [searchTerm, setSearchTerm] = useState("");
    const [deletingTag, setDeletingTag] = useState<string | null>(null);
    const [isAdmin, setIsAdmin] = useState(false);

    // Pagination State
    const [currentPage, setCurrentPage] = useState(1);
    const ITEMS_PER_PAGE = 12;

    const fetchData = async () => {
        setLoading(true);
        setError("");
        try {
            const [imagesData, reposData] = await Promise.all([
                nexusService.getImages(),
                nexusService.getRepositories()
            ]);

            if (imagesData.success) {
                setImages(imagesData.data);
            } else {
                setError(prev => prev + " " + (imagesData.message || "Failed to fetch images"));
            }

            if (reposData.success) {
                setRepositories(reposData.data);
            } else {
                setError(prev => prev + " " + (reposData.message || "Failed to fetch repositories"));
            }

        } catch (err) {
            console.error("Failed to fetch nexus data:", err);
            setError("Failed to connect to Nexus service");
        } finally {
            setLoading(false);
        }
    };

    const handleDeleteTag = async (imageName: string, tag: string) => {
        if (!confirm(`Are you sure you want to delete tag ${tag} for image ${imageName}?`)) return;

        setDeletingTag(`${imageName}:${tag}`);
        try {
            const result = await nexusService.deleteImageTag(imageName, tag);
            if (result.success) {
                // Refresh data to show updated list
                fetchData();
            } else {
                alert("Failed to delete tag: " + result.message);
            }
        } catch (err) {
            console.error("Error deleting tag:", err);
            alert("Error deleting tag");
        } finally {
            setDeletingTag(null);
        }
    };

    useEffect(() => {
        const user = authService.getUser();
        setIsAdmin(user?.role === 'admin' || user?.role === 'ADMIN');
        fetchData();
    }, []);

    // Reset page on search or view mode change
    useEffect(() => {
        setCurrentPage(1);
    }, [searchTerm, viewMode]);

    const filteredImages = images.filter(img =>
        img.image.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const filteredRepos = repositories.filter(repo =>
        repo.toLowerCase().includes(searchTerm.toLowerCase())
    );

    // Pagination Logic
    const currentData = viewMode === 'images' ? filteredImages : filteredRepos;
    const totalPages = Math.ceil(currentData.length / ITEMS_PER_PAGE);
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    // Cast to any[] to handle the union type of filtering, then cast back when mapping
    const paginatedData = currentData.slice(startIndex, startIndex + ITEMS_PER_PAGE);

    return (
        <>
            <PageHeader
                title="Image Registry"
                description="Browse Docker images and repositories stored in Nexus."
                action={
                    <div className="flex gap-2">
                        <div className="bg-slate-100 dark:bg-slate-800 p-1 rounded-lg flex text-xs font-medium">
                            <button
                                onClick={() => setViewMode('images')}
                                className={`px-3 py-1 rounded-md transition-all ${viewMode === 'images' ? 'bg-white dark:bg-slate-700 shadow text-slate-900 dark:text-white' : 'text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'}`}
                            >
                                Images & Tags
                            </button>
                            <button
                                onClick={() => setViewMode('repositories')}
                                className={`px-3 py-1 rounded-md transition-all ${viewMode === 'repositories' ? 'bg-white dark:bg-slate-700 shadow text-slate-900 dark:text-white' : 'text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'}`}
                            >
                                Repositories
                            </button>
                        </div>
                        <Button variant="secondary" size="sm" onClick={fetchData}>
                            <RefreshCw className={`w-4 h-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
                            Refresh
                        </Button>
                    </div>
                }
            />

            {/* Search Bar */}
            <div className="mb-8 relative max-w-md">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                <input
                    type="text"
                    placeholder={`Filter ${viewMode}...`}
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full bg-white dark:bg-slate-900/50 border border-slate-200 dark:border-slate-800 rounded-xl pl-10 pr-4 py-2 text-sm text-slate-900 dark:text-white placeholder:text-slate-500 focus:ring-2 focus:ring-indigo-500/20 outline-none transition-colors"
                />
            </div>

            {loading ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {[1, 2, 3, 4, 5, 6].map((i) => (
                        <div key={i} className="h-48 rounded-2xl bg-slate-100 dark:bg-slate-800/50 animate-pulse" />
                    ))}
                </div>
            ) : error ? (
                <div className="p-6 rounded-2xl bg-red-500/10 border border-red-500/20 text-red-500 text-center">
                    {error}
                </div>
            ) : (
                <>
                    <div className="min-h-[400px]">
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                            {viewMode === 'images' && filteredImages.length > 0 ? (
                                (paginatedData as NexusImage[]).map((repo, idx) => {
                                    const latestTag = repo.tags.length > 0 ? repo.tags[0] : null;
                                    const previousTags = repo.tags.length > 1 ? repo.tags.slice(1) : [];

                                    return (
                                        <div
                                            key={idx}
                                            className="group bg-white dark:bg-slate-900/50 border border-slate-200 dark:border-slate-800 rounded-xl p-4 hover:border-indigo-500/50 dark:hover:border-indigo-500/50 transition-all duration-300 shadow-sm dark:shadow-none hover:shadow-xl dark:hover:shadow-none hover:shadow-indigo-500/5 flex flex-col"
                                        >
                                            <div className="flex items-start justify-between mb-3">
                                                <div className="p-2 bg-indigo-50 dark:bg-indigo-500/10 rounded-lg border border-indigo-100 dark:border-indigo-500/20 group-hover:scale-110 transition-transform duration-300">
                                                    <Box className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
                                                </div>
                                                <span className="text-[10px] font-mono text-slate-400 bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded-full">
                                                    {repo.tags.length} tags
                                                </span>
                                            </div>

                                            <h3 className="font-bold text-sm text-slate-900 dark:text-white mb-0.5 truncate" title={repo.image}>
                                                {repo.image}
                                            </h3>
                                            <p className="text-[10px] text-slate-500 dark:text-slate-400 mb-4 font-mono truncate">
                                                docker pull {repo.image}
                                            </p>

                                            <div className="mt-auto space-y-3">
                                                {/* Latest Tag Section */}
                                                {
                                                    latestTag && (
                                                        <div>
                                                            <div className="flex items-center gap-1.5 mb-1.5">
                                                                <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                                                                <span className="text-[9px] uppercase font-bold text-slate-500 tracking-wider">Latest</span>
                                                            </div>
                                                            <div className="flex items-center group/tag">
                                                                <span className="inline-flex items-center px-2.5 py-1 rounded-md text-xs font-semibold bg-emerald-50 dark:bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border border-emerald-100 dark:border-emerald-500/20 w-full justify-between">
                                                                    <span className="flex items-center truncate">
                                                                        <Tag size={12} className="mr-1.5 opacity-70 shrink-0" />
                                                                        <span className="truncate">{latestTag}</span>
                                                                    </span>
                                                                    {isAdmin && (
                                                                        <button
                                                                            onClick={() => handleDeleteTag(repo.image, latestTag)}
                                                                            disabled={deletingTag === `${repo.image}:${latestTag}`}
                                                                            className="ml-2 p-0.5 text-emerald-600 dark:text-emerald-400 hover:text-red-500 dark:hover:text-red-400 transition-colors"
                                                                            title="Delete Tag"
                                                                        >
                                                                            {deletingTag === `${repo.image}:${latestTag}` ? (
                                                                                <RefreshCw className="w-3 h-3 animate-spin" />
                                                                            ) : (
                                                                                <Trash2 className="w-3 h-3" />
                                                                            )}
                                                                        </button>
                                                                    )}
                                                                </span>
                                                            </div>
                                                        </div>
                                                    )
                                                }

                                                {/* Previous Tags Section */}
                                                {
                                                    previousTags.length > 0 && (
                                                        <div>
                                                            <div className="flex items-center gap-1.5 mb-1.5">
                                                                <Clock size={10} className="text-slate-400" />
                                                                <span className="text-[9px] uppercase font-bold text-slate-400 tracking-wider">Previous</span>
                                                            </div>
                                                            <div className="flex flex-wrap gap-1.5">
                                                                {previousTags.slice(0, 3).map((tag, tIdx) => (
                                                                    <span
                                                                        key={tIdx}
                                                                        className="group/tag inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-medium bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 border border-slate-200 dark:border-slate-700/50 max-w-full"
                                                                    >
                                                                        <span className="truncate max-w-[60px]" title={tag}>{tag}</span>
                                                                        {isAdmin && (
                                                                            <button
                                                                                onClick={() => handleDeleteTag(repo.image, tag)}
                                                                                disabled={deletingTag === `${repo.image}:${tag}`}
                                                                                className="ml-1 p-0.5 text-slate-400 hover:text-red-500 transition-colors"
                                                                                title="Delete Tag"
                                                                            >
                                                                                {deletingTag === `${repo.image}:${tag}` ? (
                                                                                    <RefreshCw className="w-2.5 h-2.5 animate-spin" />
                                                                                ) : (
                                                                                    <Trash2 className="w-2.5 h-2.5" />
                                                                                )}
                                                                            </button>
                                                                        )}
                                                                    </span>
                                                                ))}
                                                                {previousTags.length > 3 && (
                                                                    <span className="inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-medium text-slate-400">
                                                                        +{previousTags.length - 3}
                                                                    </span>
                                                                )}
                                                            </div>
                                                        </div>
                                                    )
                                                }

                                                {
                                                    !latestTag && (
                                                        <div className="text-center py-2 bg-slate-50 dark:bg-slate-800/50 rounded text-[10px] text-slate-400 italic">
                                                            No tags
                                                        </div>
                                                    )
                                                }
                                            </div >
                                        </div >
                                    );
                                })
                            ) : viewMode === 'repositories' && filteredRepos.length > 0 ? (
                                (paginatedData as string[]).map((repoName, idx) => (
                                    <div
                                        key={idx}
                                        className="group bg-white dark:bg-slate-900/50 border border-slate-200 dark:border-slate-800 rounded-xl p-4 hover:border-indigo-500/50 dark:hover:border-indigo-500/50 transition-all duration-300 shadow-sm dark:shadow-none hover:shadow-xl dark:hover:shadow-none hover:shadow-indigo-500/5 flex items-center gap-3"
                                    >
                                        <div className="p-2 bg-emerald-50 dark:bg-emerald-500/10 rounded-lg border border-emerald-100 dark:border-emerald-500/20 group-hover:scale-110 transition-transform duration-300">
                                            <Folder className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
                                        </div>
                                        <div className="min-w-0">
                                            <h3 className="font-bold text-sm text-slate-900 dark:text-white mb-0.5 truncate" title={repoName}>
                                                {repoName}
                                            </h3>
                                            <p className="text-[10px] text-slate-500">Repository</p>
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <div className="col-span-full text-center py-20 text-slate-500">
                                    <Box className="w-12 h-12 mx-auto mb-4 opacity-20" />
                                    <p>No results found for {viewMode}.</p>
                                </div>
                            )}
                        </div >
                    </div >

                    {/* Pagination Controls */}
                    {totalPages > 1 && (
                        <div className="mt-8 flex items-center justify-between border-t border-slate-200 dark:border-slate-800 pt-4">
                            <p className="text-sm text-slate-500">
                                Showing <span className="font-medium">{startIndex + 1}</span> to <span className="font-medium">{Math.min(startIndex + ITEMS_PER_PAGE, currentData.length)}</span> of <span className="font-medium">{currentData.length}</span> results
                            </p>
                            <div className="flex items-center gap-2">
                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                                    disabled={currentPage === 1}
                                >
                                    <ChevronLeft className="w-4 h-4" />
                                </Button>
                                <div className="flex items-center gap-1">
                                    {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                                        <button
                                            key={page}
                                            onClick={() => setCurrentPage(page)}
                                            className={`w-8 h-8 rounded-lg text-sm font-medium transition-colors ${currentPage === page
                                                ? "bg-indigo-600 text-white"
                                                : "text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
                                                }`}
                                        >
                                            {page}
                                        </button>
                                    ))}
                                </div>
                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                                    disabled={currentPage === totalPages}
                                >
                                    <ChevronRight className="w-4 h-4" />
                                </Button>
                            </div>
                        </div>
                    )}
                </>
            )}
        </>
    );
}
