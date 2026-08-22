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

import { useAuth } from "../context/AuthContext";


function Vault({
    isAdmin,
    onGoToAdmin,
    onLogout,
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

    const { logout } = useAuth();


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
    // LOGOUT
    // =========================================================

    const handleLogout = () => {

        if (onLogout) {

            onLogout();

            return;
        }

        logout();
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

            <header className="vault-header">

                <div>

                    <h1>
                        SecureVault
                    </h1>

                    <p>
                        Welcome, {user?.name}
                    </p>

                </div>


                <div className="vault-header-actions">

                    <button
                        className="add-button"
                        type="button"
                        onClick={() =>
                            setShowAddModal(true)
                        }
                    >
                        Add Credential
                    </button>


                    {isAdmin && (

                        <button
                            className="admin-nav-button"
                            type="button"
                            onClick={onGoToAdmin}
                        >
                            Admin Dashboard
                        </button>

                    )}


                    <button
                        className="logout-button"
                        type="button"
                        onClick={handleLogout}
                    >
                        Logout
                    </button>

                </div>

            </header>


            {/* =================================================
                MAIN
            ================================================= */}

            <main className="vault-container">


                {/* =================================================
                    PASSWORD HEALTH
                ================================================= */}

                <PasswordHealth
                    userId={user?.id}
                />


                {/* =================================================
                    VAULT TITLE
                ================================================= */}

                <div className="vault-top">

                    <div>

                        <h2>
                            My Vault
                        </h2>

                        <p>
                            {credentials.length} credential
                            {credentials.length !== 1
                                ? "s"
                                : ""}
                        </p>

                    </div>

                </div>


                {/* =================================================
                    SEARCH + FILTER
                ================================================= */}

                <div className="vault-controls">

                    <input
                        type="text"
                        placeholder="Search credentials..."
                        value={searchKeyword}
                        onChange={(event) =>
                            handleSearch(
                                event.target.value
                            )
                        }
                        className="search-input"
                    />


                    <select
                        value={selectedCategory}
                        onChange={(event) =>
                            handleCategoryChange(
                                event.target.value
                            )
                        }
                        className="category-select"
                    >

                        {categories.map(
                            (category) => (

                                <option
                                    key={category}
                                    value={category}
                                >
                                    {category === "ALL"
                                        ? "All Categories"
                                        : category}
                                </option>

                            )
                        )}

                    </select>


                    {hasActiveFilter && (

                        <button
                            type="button"
                            className="text-button"
                            onClick={async () => {

                                setSearchKeyword("");
                                setSelectedCategory("ALL");

                                await refreshVault();

                            }}
                        >
                            Clear filters
                        </button>

                    )}

                </div>


                {/* =================================================
                    FILTER LOADING
                ================================================= */}

                {filterLoading && (

                    <div className="filter-loading">
                        Updating results...
                    </div>

                )}


                {/* =================================================
                    ERROR
                ================================================= */}

                {error && (

                    <div className="error-message">
                        {error}
                    </div>

                )}


                {/* =================================================
                    CREDENTIALS
                ================================================= */}

                {credentials.length === 0 ? (

                    <div className="empty-vault">

                        {hasActiveFilter ? (

                            <>
                                <h3>
                                    No matching credentials
                                </h3>

                                <p>
                                    Try a different search term
                                    or category.
                                </p>

                                <button
                                    className="text-button"
                                    type="button"
                                    onClick={async () => {

                                        setSearchKeyword("");
                                        setSelectedCategory("ALL");

                                        await refreshVault();

                                    }}
                                >
                                    Clear filters
                                </button>
                            </>

                        ) : (

                            <>
                                <h3>
                                    Your vault is empty
                                </h3>

                                <p>
                                    Add your first credential
                                    to get started.
                                </p>

                                <button
                                    className="add-button"
                                    type="button"
                                    onClick={() =>
                                        setShowAddModal(true)
                                    }
                                >
                                    Add Credential
                                </button>
                            </>

                        )}

                    </div>

                ) : (

                    <div className="credential-grid">

                        {credentials.map(
                            (credential) => (

                                <div
                                    className="credential-card"
                                    key={credential.id}
                                >


                                    {/* =============================
                                        CARD HEADER
                                    ============================== */}

                                    <div className="credential-card-header">

                                        <div>

                                            <h3>
                                                {credential.title}
                                            </h3>

                                            <span>
                                                {credential.category}
                                            </span>

                                        </div>


                                        <button
                                            className={`favorite-button ${credential.favorite
                                                ? "favorite-active"
                                                : ""
                                                }`}
                                            type="button"
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
                                            {credential.favorite
                                                ? "★"
                                                : "☆"}
                                        </button>

                                    </div>


                                    {/* =============================
                                        CREDENTIAL INFO
                                    ============================== */}

                                    <div className="credential-info">

                                        <div>

                                            <label>
                                                Username
                                            </label>

                                            <p>
                                                {credential.username}
                                            </p>

                                        </div>


                                        <div>

                                            <label>
                                                Website
                                            </label>

                                            <p>
                                                {credential.websiteUrl ||
                                                    "Not provided"}
                                            </p>

                                        </div>

                                    </div>


                                    {/* =============================
                                        ACTIONS
                                    ============================== */}

                                    <div className="credential-actions">

                                        <button
                                            type="button"
                                            onClick={() =>
                                                setSelectedCredentialId(
                                                    credential.id
                                                )
                                            }
                                        >
                                            View
                                        </button>


                                        <button
                                            type="button"
                                            onClick={() =>
                                                setEditCredentialId(
                                                    credential.id
                                                )
                                            }
                                        >
                                            Edit
                                        </button>


                                        <button
                                            type="button"
                                            onClick={() =>
                                                setShareCredentialData(
                                                    credential
                                                )
                                            }
                                        >
                                            Share
                                        </button>


                                        <button
                                            type="button"
                                            onClick={() =>
                                                setManageShareCredentialData(
                                                    credential
                                                )
                                            }
                                        >
                                            Manage Sharing
                                        </button>


                                        <button
                                            type="button"
                                            onClick={() =>
                                                setDeleteCredentialData(
                                                    credential
                                                )
                                            }
                                        >
                                            Delete
                                        </button>

                                    </div>

                                </div>

                            )
                        )}

                    </div>

                )}


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