import { useEffect, useState } from "react";

import { getCurrentUser } from "../services/authService";

import {
    getCredentials,
    searchCredentials,
    getCredentialsByCategory,
    toggleFavorite,
} from "../services/vaultService";

import CredentialModal from "../components/CredentialModal";
import CredentialViewModal from "../components/CredentialViewModal";
import CredentialEditModal from "../components/CredentialEditModal";
import CredentialDeleteModal from "../components/CredentialDeleteModal";

import PasswordHealth from "../components/PasswordHealth";

import ShareCredentialModal from "../components/ShareCredentialModal";
import ShareManagementModal from "../components/ShareManagementModal";

import Icon from "../components/Icon";


function Vault({
    isAdmin,
    onGoToAdmin,
}) {

    // =========================================================
    // USER
    // =========================================================

    const [user, setUser] = useState(null);


    // =========================================================
    // CREDENTIALS
    // =========================================================

    const [credentials, setCredentials] =
        useState([]);

    const [loading, setLoading] =
        useState(true);

    const [error, setError] =
        useState("");


    // =========================================================
    // SEARCH + CATEGORY
    // =========================================================

    const [searchKeyword, setSearchKeyword] =
        useState("");

    const [selectedCategory, setSelectedCategory] =
        useState("ALL");

    const [filterLoading, setFilterLoading] =
        useState(false);


    // =========================================================
    // MODAL STATES
    // =========================================================

    const [showAddModal, setShowAddModal] =
        useState(false);

    const [selectedCredentialId, setSelectedCredentialId] =
        useState(null);

    const [editCredentialId, setEditCredentialId] =
        useState(null);

    const [deleteCredentialData, setDeleteCredentialData] =
        useState(null);

    const [shareCredentialData, setShareCredentialData] =
        useState(null);

    const [manageShareCredentialData, setManageShareCredentialData] =
        useState(null);


    // =========================================================
    // CATEGORIES
    // =========================================================

    const categories = [
        "ALL",
        "PERSONAL",
        "WORK",
        "DEVELOPMENT",
        "SOCIAL",
        "BANKING",
        "ENTERTAINMENT",
        "OTHER",
    ];

    const websiteLabel = (value) => {

        if (!value) {
            return "No website";
        }

        try {
            return new URL(value).hostname.replace(/^www\./, "");
        } catch {
            return value;
        }
    };


    // =========================================================
    // LOAD CURRENT USER
    // =========================================================

    useEffect(() => {

        loadCurrentUser();

    }, []);


    const loadCurrentUser = async () => {

        try {

            setLoading(true);
            setError("");

            const response =
                await getCurrentUser();

            if (!response?.success) {

                throw new Error(
                    response?.message ||
                    "Unable to retrieve current user."
                );
            }

            const currentUser =
                response.data;

            setUser(currentUser);

            await loadCredentials(
                currentUser.id
            );

        } catch (err) {

            console.error(
                "Error loading vault:",
                err
            );

            setError(
                err.response?.data?.message ||
                err.message ||
                "Unable to load your vault."
            );

        } finally {

            setLoading(false);
        }
    };


    // =========================================================
    // LOAD CREDENTIALS
    // =========================================================

    const loadCredentials = async (
        userId
    ) => {

        const response =
            await getCredentials(userId);

        /*
         * Current backend returns a paginated
         * response containing "content".
         */

        if (Array.isArray(response?.content)) {

            setCredentials(
                response.content
            );

            return;
        }

        /*
         * Fallback for ApiResponse-style responses.
         */

        if (Array.isArray(response?.data)) {

            setCredentials(
                response.data
            );

            return;
        }

        if (Array.isArray(response)) {

            setCredentials(
                response
            );

            return;
        }

        setCredentials([]);
    };


    // =========================================================
    // REFRESH VAULT
    // =========================================================

    const refreshVault = async () => {

        if (!user?.id) {
            return;
        }

        try {

            setFilterLoading(true);
            setError("");

            await loadCredentials(
                user.id
            );

        } catch (err) {

            console.error(
                "Vault refresh error:",
                err
            );

            setError(
                err.response?.data?.message ||
                "Unable to refresh your vault."
            );

        } finally {

            setFilterLoading(false);
        }
    };


    // =========================================================
    // SEARCH
    // =========================================================

    const handleSearch = async (
        keyword
    ) => {

        setSearchKeyword(keyword);

        if (!user?.id) {
            return;
        }

        const trimmedKeyword =
            keyword.trim();


        /*
         * Empty search:
         *
         * If a category is selected, reload that
         * category instead of loading everything.
         */

        if (!trimmedKeyword) {

            if (
                selectedCategory === "ALL"
            ) {

                await refreshVault();

            } else {

                await handleCategoryChange(
                    selectedCategory,
                    false
                );
            }

            return;
        }


        try {

            setFilterLoading(true);
            setError("");

            const response =
                await searchCredentials(
                    keyword
                );

            const results =
                Array.isArray(response?.data)
                    ? response.data
                    : Array.isArray(response)
                        ? response
                        : [];

            /*
             * The current backend search endpoint
             * does not accept a category parameter.
             *
             * Therefore, when a category is selected,
             * apply that part locally to the search
             * results returned by the backend.
             */

            if (
                selectedCategory !== "ALL"
            ) {

                setCredentials(
                    results.filter(
                        (credential) =>
                            credential.category ===
                            selectedCategory
                    )
                );

            } else {

                setCredentials(results);
            }

        } catch (err) {

            console.error(
                "Search error:",
                err
            );

            setError(
                err.response?.data?.message ||
                "Search failed."
            );

        } finally {

            setFilterLoading(false);
        }
    };


    // =========================================================
    // CATEGORY FILTER
    // =========================================================

    const handleCategoryChange =
        async (
            category,
            clearSearch = true
        ) => {

            setSelectedCategory(
                category
            );

            if (clearSearch) {

                setSearchKeyword("");
            }

            if (!user?.id) {
                return;
            }

            try {

                setFilterLoading(true);
                setError("");


                // -------------------------------------------------
                // ALL CATEGORIES
                // -------------------------------------------------

                if (
                    category === "ALL"
                ) {

                    await loadCredentials(
                        user.id
                    );

                    return;
                }


                // -------------------------------------------------
                // CATEGORY
                // -------------------------------------------------

                const response =
                    await getCredentialsByCategory(
                        category
                    );

                const results =
                    Array.isArray(response?.data)
                        ? response.data
                        : Array.isArray(response)
                            ? response
                            : [];

                setCredentials(
                    results
                );

            } catch (err) {

                console.error(
                    "Category filter error:",
                    err
                );

                setError(
                    err.response?.data?.message ||
                    "Unable to filter credentials."
                );

            } finally {

                setFilterLoading(false);
            }
        };


    // =========================================================
    // FAVORITE
    // =========================================================

    const handleToggleFavorite = async (
        credentialId
    ) => {

        try {

            setError("");

            const response =
                await toggleFavorite(
                    credentialId
                );

            if (!response?.success) {

                setError(
                    response?.message ||
                    "Unable to update favorite."
                );

                return;
            }

            /*
             * Refresh only the current view.
             */

            if (
                searchKeyword.trim()
            ) {

                await handleSearch(
                    searchKeyword
                );

            } else if (
                selectedCategory !== "ALL"
            ) {

                await handleCategoryChange(
                    selectedCategory,
                    false
                );

            } else {

                await refreshVault();
            }

        } catch (err) {

            console.error(
                "Favorite error:",
                err
            );

            setError(
                err.response?.data?.message ||
                "Unable to update favorite."
            );
        }
    };


    // =========================================================
    // SHARING UPDATED
    // =========================================================

    const handleSharingUpdated = async () => {

        /*
         * Refresh the current vault view so the UI
         * immediately reflects sharing changes.
         */

        if (
            searchKeyword.trim()
        ) {

            await handleSearch(
                searchKeyword
            );

        } else if (
            selectedCategory !== "ALL"
        ) {

            await handleCategoryChange(
                selectedCategory,
                false
            );

        } else {

            await refreshVault();
        }
    };


    // =========================================================
    // LOADING
    // =========================================================

    if (loading) {

        return (

            <div className="vault-page">

                <div className="loading">
                    Loading your vault...
                </div>

            </div>
        );
    }


    // =========================================================
    // DISPLAY
    // =========================================================

    const hasActiveFilter =
        searchKeyword.trim() !== "" ||
        selectedCategory !== "ALL";


    return (

        <div className="vault-page">


            {/* =================================================
                HEADER
            ================================================= */}

            <header className="sv-page-header">

                <div>

                    <span className="sv-eyebrow">
                        Workspace
                    </span>

                    <h1>
                        Password Vault
                    </h1>

                    <p>
                        {credentials.length} credential
                        {credentials.length !== 1 ? "s" : ""} stored securely.
                        Welcome back, {user?.name}.
                    </p>

                </div>


                <div className="sv-header-actions">

                    {isAdmin && (

                        <button
                            className="sv-btn sv-btn-secondary"
                            type="button"
                            onClick={onGoToAdmin}
                        >
                            <Icon name="admin" size={16} />
                            Admin console
                        </button>

                    )}

                    <button
                        className="sv-btn sv-btn-primary"
                        type="button"
                        onClick={() =>
                            setShowAddModal(true)
                        }
                    >
                        <Icon name="plus" size={16} />
                        Add credential
                    </button>

                </div>

            </header>


            <main className="vault-container">


                {/* =================================================
                    PASSWORD HEALTH SUMMARY
                ================================================= */}

                <PasswordHealth compact />


                {/* =================================================
                    VAULT TABLE
                ================================================= */}

                <section className="sv-vault-panel">

                    <div className="sv-vault-toolbar">

                        <div className="sv-search-field">

                            <Icon name="search" size={17} />

                            <input
                                type="text"
                                placeholder="Search credentials..."
                                aria-label="Search credentials"
                                value={searchKeyword}
                                onChange={(event) =>
                                    handleSearch(
                                        event.target.value
                                    )
                                }
                            />

                        </div>


                        <div className="sv-toolbar-select">

                            <Icon name="filter" size={16} />

                            <select
                                value={selectedCategory}
                                aria-label="Filter by category"
                                onChange={(event) =>
                                    handleCategoryChange(
                                        event.target.value
                                    )
                                }
                            >

                                {categories.map(
                                    (category) => (

                                        <option
                                            key={category}
                                            value={category}
                                        >
                                            {category === "ALL"
                                                ? "All categories"
                                                : category}
                                        </option>

                                    )
                                )}

                            </select>

                        </div>


                        {hasActiveFilter && (

                            <button
                                type="button"
                                className="sv-text-link"
                                onClick={async () => {

                                    setSearchKeyword("");
                                    setSelectedCategory("ALL");

                                    await refreshVault();

                                }}
                            >
                                Clear filters
                            </button>

                        )}


                        <span className="sv-toolbar-count">

                            {credentials.length}
                            {" "}
                            {credentials.length === 1
                                ? "item"
                                : "items"}

                        </span>

                    </div>


                    {filterLoading && (

                        <div className="sv-inline-loading" role="status">
                            Updating results…
                        </div>

                    )}


                    {error && (

                        <div className="sv-inline-error" role="alert">
                            {error}
                        </div>

                    )}


                    {credentials.length === 0 ? (

                        <div className="sv-empty-state large">

                            <span className="sv-empty-icon" aria-hidden="true">
                                <Icon name={hasActiveFilter ? "search" : "vault"} size={24} />
                            </span>

                            <div>

                                <h2>
                                    {hasActiveFilter
                                        ? "No matching credentials"
                                        : "Your vault is empty"}
                                </h2>

                                <p>
                                    {hasActiveFilter
                                        ? "Try a different search term or category."
                                        : "Add your first credential to start protecting your accounts."}
                                </p>

                            </div>

                            {hasActiveFilter ? (

                                <button
                                    className="sv-btn sv-btn-secondary"
                                    type="button"
                                    onClick={async () => {

                                        setSearchKeyword("");
                                        setSelectedCategory("ALL");

                                        await refreshVault();

                                    }}
                                >
                                    Clear filters
                                </button>

                            ) : (

                                <button
                                    className="sv-btn sv-btn-primary"
                                    type="button"
                                    onClick={() =>
                                        setShowAddModal(true)
                                    }
                                >
                                    <Icon name="plus" size={16} />
                                    Add credential
                                </button>

                            )}

                        </div>

                    ) : (

                        <>

                            <div className="sv-table-header" aria-hidden="true">

                                <span>
                                    Credential
                                </span>

                                <span>
                                    Category
                                </span>

                                <span>
                                    Website
                                </span>

                                <span>
                                    Actions
                                </span>

                            </div>


                            <div className="sv-vault-table" role="list">

                                {credentials.map(
                                    (credential) => {

                                        const initial =
                                            credential.title
                                                ?.charAt(0)
                                                .toUpperCase() || "V";

                                        const category =
                                            credential.category ||
                                            "OTHER";

                                        return (

                                            <div
                                                className="sv-vault-row"
                                                role="listitem"
                                                key={credential.id}
                                            >

                                                <div className="sv-vault-credential">

                                                    <span className="sv-credential-avatar" aria-hidden="true">
                                                        {initial}
                                                    </span>

                                                    <div className="sv-credential-copy">

                                                        <strong>
                                                            {credential.title}
                                                        </strong>

                                                        <span>
                                                            {credential.username || "No username"}
                                                        </span>

                                                    </div>


                                                    <button
                                                        className={`sv-favorite-button ${credential.favorite
                                                            ? "is-active"
                                                            : ""
                                                            }`}
                                                        type="button"
                                                        aria-label={
                                                            credential.favorite
                                                                ? `Remove ${credential.title} from favorites`
                                                                : `Add ${credential.title} to favorites`
                                                        }
                                                        title={
                                                            credential.favorite
                                                                ? "Remove from favorites"
                                                                : "Add to favorites"
                                                        }
                                                        onClick={() =>
                                                            handleToggleFavorite(
                                                                credential.id
                                                            )
                                                        }
                                                    >
                                                        <Icon
                                                            name="star"
                                                            size={15}
                                                            className={
                                                                credential.favorite
                                                                    ? "sv-star-filled"
                                                                    : "sv-star"
                                                            }
                                                        />
                                                    </button>

                                                </div>


                                                <span
                                                    className={`sv-category-badge ${String(category).toLowerCase()}`}
                                                >
                                                    {category}
                                                </span>


                                                <span className="sv-vault-site">
                                                    {websiteLabel(credential.websiteUrl)}
                                                </span>


                                                <div className="sv-row-actions">

                                                    <button
                                                        type="button"
                                                        aria-label={`View ${credential.title}`}
                                                        title="View credential"
                                                        onClick={() =>
                                                            setSelectedCredentialId(
                                                                credential.id
                                                            )
                                                        }
                                                    >
                                                        <Icon name="eye" size={16} />
                                                    </button>

                                                    <button
                                                        type="button"
                                                        aria-label={`Edit ${credential.title}`}
                                                        title="Edit credential"
                                                        onClick={() =>
                                                            setEditCredentialId(
                                                                credential.id
                                                            )
                                                        }
                                                    >
                                                        <Icon name="edit" size={16} />
                                                    </button>

                                                    <button
                                                        type="button"
                                                        aria-label={`Share ${credential.title}`}
                                                        title="Share credential"
                                                        onClick={() =>
                                                            setShareCredentialData(
                                                                credential
                                                            )
                                                        }
                                                    >
                                                        <Icon name="share" size={16} />
                                                    </button>

                                                    <button
                                                        type="button"
                                                        aria-label={`Manage sharing for ${credential.title}`}
                                                        title="Manage sharing"
                                                        onClick={() =>
                                                            setManageShareCredentialData(
                                                                credential
                                                            )
                                                        }
                                                    >
                                                        <Icon name="users" size={16} />
                                                    </button>

                                                    <button
                                                        type="button"
                                                        className="is-danger"
                                                        aria-label={`Delete ${credential.title}`}
                                                        title="Delete credential"
                                                        onClick={() =>
                                                            setDeleteCredentialData(
                                                                credential
                                                            )
                                                        }
                                                    >
                                                        <Icon name="trash" size={16} />
                                                    </button>

                                                </div>

                                            </div>

                                        );
                                    }
                                )}

                            </div>

                        </>

                    )}

                </section>

            </main>


            {/* =================================================
                ADD MODAL
            ================================================= */}

            {showAddModal &&
                user && (

                    <CredentialModal
                        userId={user.id}

                        onClose={() =>
                            setShowAddModal(false)
                        }

                        onCreated={() => {

                            setShowAddModal(false);

                            handleSharingUpdated();

                        }}
                    />

                )}


            {/* =================================================
                VIEW MODAL
            ================================================= */}

            {selectedCredentialId !== null &&
                user && (

                    <CredentialViewModal
                        credentialId={
                            selectedCredentialId
                        }

                        userId={
                            user.id
                        }

                        onClose={() =>
                            setSelectedCredentialId(null)
                        }
                    />

                )}


            {/* =================================================
                EDIT MODAL
            ================================================= */}

            {editCredentialId !== null &&
                user && (

                    <CredentialEditModal
                        credentialId={
                            editCredentialId
                        }

                        userId={
                            user.id
                        }

                        onClose={() =>
                            setEditCredentialId(null)
                        }

                        onUpdated={() => {

                            setEditCredentialId(null);

                            handleSharingUpdated();

                        }}
                    />

                )}


            {/* =================================================
                DELETE MODAL
            ================================================= */}

            {deleteCredentialData !== null &&
                user && (

                    <CredentialDeleteModal
                        credential={
                            deleteCredentialData
                        }

                        userId={
                            user.id
                        }

                        onClose={() =>
                            setDeleteCredentialData(null)
                        }

                        onDeleted={() => {

                            setDeleteCredentialData(null);

                            handleSharingUpdated();

                        }}
                    />

                )}


            {/* =================================================
                SHARE MODAL
            ================================================= */}

            {shareCredentialData !== null &&
                user && (

                    <ShareCredentialModal
                        credential={
                            shareCredentialData
                        }

                        userId={
                            user.id
                        }

                        onClose={() =>
                            setShareCredentialData(null)
                        }

                        onShared={async () => {

                            setShareCredentialData(null);

                            await handleSharingUpdated();

                        }}
                    />

                )}


            {/* =================================================
                MANAGE SHARING MODAL
            ================================================= */}

            {manageShareCredentialData !== null &&
                user && (

                    <ShareManagementModal
                        credential={
                            manageShareCredentialData
                        }

                        onClose={() =>
                            setManageShareCredentialData(null)
                        }

                        onUpdated={async () => {

                            setManageShareCredentialData(null);

                            await handleSharingUpdated();

                        }}
                    />

                )}

        </div>
    );
}


export default Vault;