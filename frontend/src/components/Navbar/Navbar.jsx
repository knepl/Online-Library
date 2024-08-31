import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import ProfileInfo from "../BookCard/ProfileInfo";
import SearchBar from "../SearchBar/SearchBar";

const Navbar = ({
    userInfo,
    onSearchVolume,
    handleClearSearch,
    setIsLoading,
}) => {
    const [searchQuery, setSearchQuery] = useState("");
    const navigate = useNavigate();

    const onLogout = () => {
        localStorage.clear();
        navigate("/login");
    };

    const handleSearch = () => {
        if (searchQuery) {
            setIsLoading(true);
            onSearchVolume(searchQuery);
        }
    };
    const handleKeyDown = (event) => {
        if (event.key === "Enter") {
            handleSearch();
        }
    };

    const onClearSearch = () => {
        setSearchQuery("");
        handleClearSearch();
    };

    return (
        <div className="bg-white flex items-center justify-between px-6 py-2 drop-shadow">
            <h2
                className="text-xl font-medium text-black py-2"
                onClick={() => navigate("/home")}
            >
                Library
            </h2>
            <h2
                className="text-xl font-medium text-black py-2"
                onClick={() => navigate("/lists")}
            >
                Lists
            </h2>

            <SearchBar
                value={searchQuery}
                onChange={({ target }) => {
                    setSearchQuery(target.value);
                }}
                handleSearch={handleSearch}
                onClearSearch={onClearSearch}
                handleKeyDown={handleKeyDown}
            />
            <ProfileInfo userInfo={userInfo} onLogout={onLogout} />
        </div>
    );
};

export default Navbar;
