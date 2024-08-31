import axios, { all } from "axios";
import React, { useEffect, useState } from "react";
import { TailSpin } from "react-loader-spinner";
import { useNavigate } from "react-router-dom";
import { useRecoilValue } from "recoil";
import { BookCard } from "../../components/BookCard/BookCard";
import Navbar from "../../components/Navbar/Navbar";
import { authState } from "../../recoil/authAtom";
import axiosInstance from "../../utils/axiosInstance";

import Toast from "../../components/ToastMessage/Toast";
import { BOOKS_API_KEY } from "../../utils/constants";
const Home = () => {
    const [allVolumes, setAllVolumes] = useState([]);
    const [filterdValues, setFilteredValues] = useState([]);
    const [userInfo, setUserInfo] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const auth = useRecoilValue(authState);

    const [showToastMsg, setShowToastMsg] = useState({
        isShown: false,
        message: "",
        type: "add",
    });

    const handleClearSearch = () => {
        setIsLoading(false);
        getAllVolumes();
    };
    const showToastMessage = (message, type) => {
        setShowToastMsg({
            isShown: true,
            message,
            type,
        });
    };

    const handleCloseToast = () => {
        setShowToastMsg({
            isShown: false,
            message: "",
            type: "close",
        });
    };

    useEffect(() => {
        setIsLoading(true);
        getAllVolumes();
        getUserInfo();
        return () => {};
    }, []);

    const navigate = useNavigate();

    const addToReadingList = async (data) => {
        try {
            await axiosInstance
                .post("/add-books-to-reading-list", data)
                .then((res) => {
                    if (res.data) {
                        showToastMessage(
                            "Successfully added book to the reading list",
                            "add"
                        );
                    }
                });
        } catch (error) {
            console.log("An unexpected error occurred. Please try again.");
        }
    };

    const addToAlreadyReadList = async (data) => {
        try {
            await axiosInstance.post("/read-book", data).then((res) => {
                if (res.data) {
                    showToastMessage(
                        "Successfully added book to the read books",
                        "add"
                    );
                }
            });
        } catch (error) {
            console.log("An unexpected error occurred. Please try again.");
        }
    };

    //Get User Info
    const getUserInfo = async () => {
        try {
            const response = await axiosInstance.get("/get-user");
            if (response.data && response.data.user) {
                setUserInfo(response.data.user);
            }
        } catch (error) {
            if (error.response.status === 401) {
                localStorage.clear();
                navigate("/login");
            }
        }
    };

    //Get all books
    const getAllVolumes = async () => {
        try {
            const response = await axios
                .get(BOOKS_API_KEY + "/?q=A")
                .then((res) => {
                    if (res.data) {
                        console.log(res);
                        setAllVolumes(res.data.items);
                        setFilteredValues(res.data.items);
                    }
                });
        } catch (error) {
            console.log("An unexpected error occurred. Please try again.");
        }
        setIsLoading(false);
    };

    //Search for a Volume
    const onSearchVolume = async (query) => {
        try {
            const response = await axios
                .get(BOOKS_API_KEY, {
                    params: { q: query },
                })
                .then((res) => {
                    if (res.data) {
                        setAllVolumes(res.data.items);
                        setFilteredValues(res.data.items);
                    }
                });
        } catch (error) {
            console.log(error);
        }
        setIsLoading(false);
    };

    const [selectedSort, setSelectedSort] = useState("");
    const [selectedGenre, setSelectedGenre] = useState("");

    // Handle form submission
    const handleSortSubmit = (event) => {
        event.preventDefault();
        switch (selectedSort) {
            case "title":
                filterdValues.sort((a, b) =>
                    a.volumeInfo.title.localeCompare(b.volumeInfo.title)
                );
                break;
            case "author":
                filterdValues.sort((a, b) =>
                    a.volumeInfo.authors?.[0].localeCompare(
                        b.volumeInfo.authors?.[0]
                    )
                );
                break;
            default:
                break;
        }
    };

    // Handle change in the select element
    const handleSortChange = (event) => {
        setSelectedSort(event.target.value);
    };

    const handleFilterSubmit = (event) => {
        event.preventDefault();
        setFilteredValues(allVolumes);
        console.log(selectedGenre);
        if (selectedGenre !== "all") {
            const filteredAllVolumes = allVolumes.filter(
                (volume) => volume.volumeInfo?.categories?.[0] === selectedGenre
            );
            setFilteredValues(filteredAllVolumes);
        }
    };

    const handleFilterChange = (event) => {
        setSelectedGenre(event.target.value);
    };

    const getCaterogories = (data) => {
        const categoriesSet = new Set(
            data
                .map((volume) => volume.volumeInfo?.categories?.[0])
                .filter((category) => category && category.trim() !== "") // Exclude empty or whitespace-only strings
        );
        return Array.from(categoriesSet);
    };

    return (
        <>
            <Navbar
                onSearchVolume={onSearchVolume}
                handleClearSearch={handleClearSearch}
                setIsLoading={setIsLoading}
                userInfo={userInfo}
            />

            {isLoading ? (
                <div className="loader">
                    <TailSpin
                        visible={true}
                        height="80"
                        width="80"
                        color="#4fa94d"
                        ariaLabel="tail-spin-loading"
                        radius="1"
                        wrapperStyle={{}}
                        wrapperClass=""
                    />
                </div>
            ) : (
                <>
                    <div
                        className="filters"
                        style={{
                            display: "flex",
                            justifyContent: "space-evenly",
                        }}
                    >
                        <form onSubmit={handleSortSubmit}>
                            <select
                                id="books"
                                value={selectedSort}
                                onChange={handleSortChange}
                            >
                                <option value="">
                                    Please choose an option to sort
                                </option>
                                <option value="author">Author</option>
                                <option value="title">Title</option>
                            </select>
                            <input
                                type="submit"
                                value="Sort"
                                style={{
                                    marginLeft: "10px",
                                    padding: "4px",
                                    backgroundColor: "lightblue",
                                }}
                            />
                        </form>
                        <form onSubmit={handleFilterSubmit}>
                            <select
                                id="genres"
                                value={selectedGenre}
                                onChange={handleFilterChange}
                            >
                                <option value="all">Show all options</option>
                                {getCaterogories(allVolumes).map(
                                    (category, index) => {
                                        return (
                                            <option
                                                key={index}
                                                value={category}
                                            >
                                                {category}
                                            </option>
                                        );
                                    }
                                )}
                            </select>
                            <input
                                type="submit"
                                value="Filter"
                                style={{
                                    marginLeft: "10px",
                                    padding: "4px",
                                    backgroundColor: "lightblue",
                                }}
                            />
                        </form>
                    </div>
                    <div className="container gallery">
                        {filterdValues
                            ? filterdValues.map((volume, idx) => (
                                  <BookCard
                                      key={idx}
                                      title={volume.volumeInfo.title}
                                      authors={volume.volumeInfo.authors}
                                      descr={volume.volumeInfo.subtitle}
                                      imgSrc={
                                          volume.volumeInfo.imageLinks
                                              ? volume.volumeInfo.imageLinks
                                                    .thumbnail
                                              : undefined
                                      }
                                      addToAlreadyReadList={
                                          addToAlreadyReadList
                                      }
                                      addToReadingList={addToReadingList}
                                  />
                              ))
                            : undefined}
                    </div>
                </>
            )}
            <Toast
                isShown={showToastMsg.isShown}
                message={showToastMsg.message}
                type={showToastMsg.type}
                onClose={handleCloseToast}
            />
        </>
    );
};

export default Home;
