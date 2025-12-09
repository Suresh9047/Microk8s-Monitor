"use client";

import { useEffect, useState } from "react";
import { PageHeader } from "@/components/shared/PageHeader";
import { nexusService, NexusImage } from "@/services/nexus.service";
import { authService } from "@/services/auth.service";
import { Search, Tag, Box, RefreshCw, Folder, ChevronLeft, ChevronRight, Clock, Trash2, CheckSquare, Square, XCircle, Lock, TriangleAlert } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Modal } from "@/components/ui/Modal";
import { Toast, ToastType } from "@/components/ui/Toast";

type ViewMode = 'images' | 'repositories';

// Helper for natural sort (e.g. v0.10 > v0.2)
const sortTags = (tags: string[]) => {
    return [...tags].sort((a, b) => {
        if (a === 'latest') return -1;
        if (b === 'latest') return 1;
        return b.localeCompare(a, undefined, { numeric: true, sensitivity: 'base' });
    });
};

export default function RegistryPage() {
    const [viewMode, setViewMode] = useState<ViewMode>('images');
    const [images, setImages] = useState<NexusImage[]>([]);
    const [repositories, setRepositories] = useState<string[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [searchTerm, setSearchTerm] = useState("");
    const [deletingTag, setDeletingTag] = useState<string | null>(null);
    const [isAdmin, setIsAdmin] = useState(false);

    // Toast State
    const [toast, setToast] = useState<{ msg: string; type: ToastType; show: boolean }>({ msg: '', type: 'info', show: false });
    const showToast = (msg: string, type: ToastType = 'success') => {
        setToast({ msg, type, show: true });
    };

    // Modal & Selection State
    const [selectedRepo, setSelectedRepo] = useState<NexusImage | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedTags, setSelectedTags] = useState<Set<string>>(new Set());
    const [isDeletingSelected, setIsDeletingSelected] = useState(false);

    // Pagination State
    const [currentPage, setCurrentPage] = useState(1);
    const ITEMS_PER_PAGE = 12;

    const fetchData = async () => {
        setLoading(true);
        setError("");

        try {
            const [imagesResult, reposResult] = await Promise.allSettled([
                nexusService.getImages(),
                nexusService.getRepositories()
            ]);

            // Handle Images Result
            if (imagesResult.status === 'fulfilled') {
                const imagesData = imagesResult.value;
                if (imagesData.success) {
                    const sortedImages = imagesData.data.map(img => ({
                        ...img,
                        tags: sortTags(img.tags)
                    }));
                    setImages(sortedImages);

                    if (selectedRepo) {
                        const updatedRepo = sortedImages.find(img => img.image === selectedRepo.image);
                        if (updatedRepo) setSelectedRepo(updatedRepo);
                    }
                } else {
                    setError(prev => prev + (prev ? " | " : "") + (imagesData.message || "Failed to fetch images"));
                }
            } else {
                console.error("Failed to fetch images:", imagesResult.reason);
                setError(prev => prev + (prev ? " | " : "") + (imagesResult.reason.message || "Error fetching images"));
            }

            // Handle Repositories Result
            if (reposResult.status === 'fulfilled') {
                const reposData = reposResult.value;
                if (reposData.success) {
                    setRepositories(reposData.data);
                } else {
                    setError(prev => prev + (prev ? " | " : "") + (reposData.message || "Failed to fetch repositories"));
                }
            } else {
                console.error("Failed to fetch repositories:", reposResult.reason);
                setError(prev => prev + (prev ? " | " : "") + (reposResult.reason.message || "Error fetching repositories"));
            }

        } catch (err) {
            console.error("Critical error in fetchData:", err);
            setError("System error occurred while fetching data");
        } finally {
            setLoading(false);
        }
    };

    // Helper to check if a tag is protected (top 3 most recent)
    const isTagProtected = (imageTags: string[], tag: string) => {
        const index = imageTags.indexOf(tag);
        return index !== -1 && index < 3;
    };

    const handleDeleteTag = async (imageName: string, tag: string) => {
        // Double check protection (though UI should prevent it)
        const image = images.find(img => img.image === imageName);
        if (image && isTagProtected(image.tags, tag)) {
            showToast("Cannot delete protected tag (Top 3 most recent)", 'error');
            return;
        }

        if (!confirm(`Are you sure you want to delete tag ${tag} for image ${imageName}?`)) return;

        setDeletingTag(`${imageName}:${tag}`);
        try {
            const result = await nexusService.deleteImageTag(imageName, tag);
            if (result.success) {
                showToast(`Successfully deleted tag: ${tag}`, 'success');
                fetchData();
            } else {
                showToast("Failed to delete tag: " + result.message, 'error');
            }
        } catch (err) {
            console.error("Error deleting tag:", err);
            showToast("Error deleting tag", 'error');
        } finally {
            setDeletingTag(null);
        }
    };

    const handleOpenModal = (repo: NexusImage) => {
        setSelectedRepo(repo);
        setSelectedTags(new Set());
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setSelectedRepo(null);
        setSelectedTags(new Set());
    };

    const toggleSelectTag = (tag: string) => {
        if (!selectedRepo) return;
        // Prevent selecting protected tags
        if (isTagProtected(selectedRepo.tags, tag)) return;

        const newSelected = new Set(selectedTags);
        if (newSelected.has(tag)) {
            newSelected.delete(tag);
        } else {
            newSelected.add(tag);
        }
        setSelectedTags(newSelected);
    };

    const handleSelectAll = () => {
        if (!selectedRepo) return;

        // Filter only unprotected tags
        const deletableTags = selectedRepo.tags.filter((tag, idx) => idx >= 3);

        if (selectedTags.size > 0 && selectedTags.size === deletableTags.length) {
            setSelectedTags(new Set()); // Deselect all
        } else {
            setSelectedTags(new Set(deletableTags)); // Select all deletable
        }
    };

    const handleDeleteSelected = async () => {
        if (!selectedRepo || selectedTags.size === 0) return;

        if (!confirm(`Are you sure you want to delete ${selectedTags.size} tags for ${selectedRepo.image}? This cannot be undone.`)) return;

        setIsDeletingSelected(true);
        const tagsToDelete = Array.from(selectedTags);
        let successCount = 0;
        let failCount = 0;

        // We delete sequentially to be safer with backend load/rate limits
        for (const tag of tagsToDelete) {
            try {
                const result = await nexusService.deleteImageTag(selectedRepo.image, tag);
                if (result.success) {
                    successCount++;
                } else {
                    console.error(`Failed to delete tag ${tag}: ${result.message}`);
                    failCount++;
                }
            } catch (error) {
                console.error(`Error deleting tag ${tag}:`, error);
                failCount++;
            }
        }

        setIsDeletingSelected(false);
        fetchData();
        setSelectedTags(new Set()); // Clear selection

        if (failCount > 0) {
            showToast(`Deleted ${successCount} tags. Failed: ${failCount}`, 'error');
        } else {
            showToast(`Successfully deleted ${successCount} tags!`, 'success');
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
            ) : (
                <>
                    {error && (
                        <div className="mb-6 p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-500 text-sm flex items-center justify-between">
                            <span className="flex items-center gap-2">
                                <TriangleAlert className="w-4 h-4" />
                                {error}
                            </span>
                            <button onClick={() => setError("")} className="hover:text-red-700 dark:hover:text-red-300">
                                <XCircle className="w-4 h-4" />
                            </button>
                        </div>
                    )}

                    <div className="min-h-[400px]">
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                            {viewMode === 'images' && filteredImages.length > 0 ? (
                                (paginatedData as NexusImage[]).map((repo, idx) => {
                                    const latestTag = repo.tags.length > 0 ? repo.tags[0] : null;
                                    const previousTags = repo.tags.length > 1 ? repo.tags.slice(1) : [];
                                    const isLatestProtected = true; // Index 0 is always in top 3

                                    return (
                                        <div
                                            key={idx}
                                            className="group bg-white dark:bg-slate-900/50 border border-slate-200 dark:border-slate-800 rounded-xl p-4 hover:border-indigo-500/50 dark:hover:border-indigo-500/50 transition-all duration-300 shadow-sm dark:shadow-none hover:shadow-xl dark:hover:shadow-none hover:shadow-indigo-500/5 flex flex-col"
                                        >
                                            <div className="flex items-start justify-between mb-3">
                                                <div className="p-2 bg-indigo-50 dark:bg-indigo-500/10 rounded-lg border border-indigo-100 dark:border-indigo-500/20 group-hover:scale-110 transition-transform duration-300">
                                                    <Box className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
                                                </div>
                                                <button
                                                    onClick={() => handleOpenModal(repo)}
                                                    className="text-[10px] font-mono text-slate-400 bg-slate-100 hover:bg-indigo-50 hover:text-indigo-600 dark:bg-slate-800 dark:hover:bg-indigo-900/30 dark:hover:text-indigo-400 px-2 py-0.5 rounded-full transition-colors cursor-pointer"
                                                >
                                                    {repo.tags.length} tags
                                                </button>
                                            </div>

                                            <h3 className="font-bold text-sm text-slate-900 dark:text-white mb-0.5 truncate" title={repo.image}>
                                                {repo.image}
                                            </h3>
                                            <p className="text-[10px] text-slate-500 dark:text-slate-400 mb-4 font-mono truncate">
                                                docker pull {repo.image}
                                            </p>

                                            <div className="mt-auto space-y-3">
                                                {/* Latest Tag Section */}
                                                {latestTag && (
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
                                                                    <div className="flex gap-1">
                                                                        <button
                                                                            onClick={() => handleOpenModal(repo)}
                                                                            title="Select / Manage"
                                                                            className="ml-1 p-0.5 text-slate-400 hover:text-indigo-500 transition-colors"
                                                                        >
                                                                            <CheckSquare size={12} />
                                                                        </button>
                                                                        <button
                                                                            onClick={() => handleDeleteTag(repo.image, latestTag)}
                                                                            disabled={true} // Latest is index 0 -> ALWAYS protected
                                                                            className="p-0.5 text-slate-400 opacity-50 cursor-not-allowed"
                                                                            title="Protected (Top 3)"
                                                                        >
                                                                            <Lock className="w-3 h-3" />
                                                                        </button>
                                                                    </div>
                                                                )}
                                                            </span>
                                                        </div>
                                                    </div>
                                                )}

                                                {/* Previous Tags Section */}
                                                {previousTags.length > 0 && (
                                                    <div>
                                                        <div className="flex items-center gap-1.5 mb-1.5">
                                                            <Clock size={10} className="text-slate-400" />
                                                            <span className="text-[9px] uppercase font-bold text-slate-400 tracking-wider">Previous</span>
                                                        </div>
                                                        <div className="flex flex-wrap gap-1.5">
                                                            {previousTags.slice(0, 3).map((tag, tIdx) => {
                                                                // Remember tIdx is local to this map. Real index is tIdx + 1
                                                                const isProtected = (tIdx + 1) < 3;

                                                                return (
                                                                    <span
                                                                        key={tIdx}
                                                                        className="group/tag inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-medium bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 border border-slate-200 dark:border-slate-700/50 max-w-full"
                                                                    >
                                                                        <span className="truncate max-w-[60px]" title={tag}>{tag}</span>
                                                                        {isAdmin && (
                                                                            isProtected ? (
                                                                                <Lock className="ml-1 w-2.5 h-2.5 text-slate-300" />
                                                                            ) : (
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
                                                                            )
                                                                        )}
                                                                    </span>
                                                                )
                                                            })}
                                                            {previousTags.length > 3 && (
                                                                <button
                                                                    onClick={() => handleOpenModal(repo)}
                                                                    className="inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-medium text-slate-400 hover:text-indigo-500 hover:bg-indigo-50 dark:hover:bg-indigo-900/30 transition-colors"
                                                                >
                                                                    +{previousTags.length - 3}
                                                                </button>
                                                            )}
                                                        </div>
                                                    </div>
                                                )}

                                                {!latestTag && (
                                                    <div className="text-center py-2 bg-slate-50 dark:bg-slate-800/50 rounded text-[10px] text-slate-400 italic">
                                                        No tags
                                                    </div>
                                                )}
                                            </div>
                                        </div>
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
                        </div>
                    </div>

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

            {/* Tags Modal */}
            <Modal
                isOpen={isModalOpen}
                onClose={handleCloseModal}
                title={selectedRepo ? `Manage Tags: ${selectedRepo.image}` : "Manage Tags"}
                className="max-w-3xl"
            >
                {selectedRepo && (
                    <div className="space-y-4">
                        <div className="flex items-center justify-between sticky top-0 bg-white dark:bg-slate-900 z-10 py-2 border-b border-slate-100 dark:border-slate-800">
                            <div className="flex flex-col">
                                <p className="text-sm text-slate-500">
                                    Found <span className="font-bold text-slate-900 dark:text-white">{selectedRepo.tags.length}</span> tags.
                                </p>
                                <p className="text-[10px] text-orange-500 dark:text-orange-400 flex items-center gap-1">
                                    <Lock size={10} /> Top 3 tags are protected
                                </p>
                            </div>
                            {isAdmin && (
                                <div className="flex items-center gap-2">
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={handleSelectAll}
                                    >
                                        {(selectedTags.size > 0 && selectedTags.size === selectedRepo.tags.length - 3) ? "Deselect All" : "Select All"}
                                    </Button>
                                    <Button
                                        variant="danger"
                                        size="sm"
                                        disabled={selectedTags.size === 0 || isDeletingSelected}
                                        onClick={handleDeleteSelected}
                                    >
                                        {isDeletingSelected ? (
                                            <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                                        ) : (
                                            <Trash2 className="w-4 h-4 mr-2" />
                                        )}
                                        Delete ({selectedTags.size})
                                    </Button>
                                </div>
                            )}
                        </div>

                        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                            {selectedRepo.tags.map((tag, idx) => {
                                const protectedTag = idx < 3;
                                return (
                                    <div
                                        key={idx}
                                        onClick={() => isAdmin && !protectedTag && toggleSelectTag(tag)}
                                        className={`
                                        group relative p-3 rounded-xl border transition-all flex items-center justify-between
                                        ${protectedTag
                                                ? 'bg-slate-100/50 border-slate-100 dark:bg-slate-800/30 dark:border-slate-800 cursor-not-allowed opacity-80'
                                                : selectedTags.has(tag)
                                                    ? 'bg-indigo-50 border-indigo-200 dark:bg-indigo-900/20 dark:border-indigo-500/50 cursor-pointer'
                                                    : 'bg-slate-50 border-slate-200 dark:bg-slate-800/50 dark:border-slate-700 hover:border-indigo-300 dark:hover:border-indigo-700 cursor-pointer'
                                            }
                                    `}
                                    >
                                        <div className="min-w-0 flex-1">
                                            {idx === 0 && (
                                                <span className="block text-[9px] uppercase font-bold text-emerald-600 mb-0.5 tracking-wider">Latest</span>
                                            )}
                                            <div className="font-mono text-xs font-medium text-slate-700 dark:text-slate-300 truncate" title={tag}>
                                                {tag}
                                            </div>
                                        </div>

                                        {isAdmin && (
                                            <div className={`ml-2 text-indigo-600 dark:text-indigo-400 transition-opacity`}>
                                                {protectedTag ? (
                                                    <Lock size={14} className="text-slate-400" />
                                                ) : (
                                                    selectedTags.has(tag) ? <CheckSquare size={16} /> : <Square size={16} className="opacity-20 group-hover:opacity-50" />
                                                )}
                                            </div>
                                        )}
                                    </div>
                                )
                            })}
                        </div>
                    </div>
                )}
            </Modal>

            <Toast
                message={toast.msg}
                type={toast.type}
                isVisible={toast.show}
                onClose={() => setToast(prev => ({ ...prev, show: false }))}
            />
        </>
    );
}
