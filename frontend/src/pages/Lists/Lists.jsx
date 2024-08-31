import React, { useEffect, useState } from "react";
import { TailSpin } from "react-loader-spinner";
import { useNavigate } from "react-router-dom";
import { BookCard } from "../../components/BookCard/BookCard";
import Navbar from "../../components/Navbar/Navbar";
import axiosInstance from "../../utils/axiosInstance";

export const Lists = () => {
    const [readingList, setReadingList] = useState([]);
    const [readBooks, setReadBooks] = useState([]);
    const [isLoading, setIsLoading] = useState(false);

    const navigate = useNavigate();

    useEffect(() => {
        setIsLoading(true);
        getAllBooksLists();
        return () => {};
    }, []);

    //Get User Info
    const getAllBooksLists = async () => {
        await axiosInstance.get("/get-all-books-lists").then((res) => {
            if (res.data) {
                console.log(res);
                setReadBooks(res.data.readBooksList);
                setReadingList(res.data.readingBooksList);
            }
        });
        setIsLoading(false);
    };

    const moveToReadList = async (bookId) => {
        setIsLoading(true);
        const data = { bookId: bookId };
        await axiosInstance
            .post("/move-to-already-read-books", data)
            .then((res) => {
                getAllBooksLists();
            });
        setIsLoading(false);
    };

    const moveToReadingList = async (bookId) => {
        setIsLoading(true);

        const data = { bookId: bookId };
        await axiosInstance.post("/move-to-reading-list", data).then((res) => {
            getAllBooksLists();
        });

        setIsLoading(false);
    };

    return (
        <>
            <Navbar setIsLoading={setIsLoading} />

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
                <div style={{ display: "flex" }}>
                    <div style={{ margin: "100px" }}>
                        {readingList ? (
                            <h1 className="listTitles">Reading List</h1>
                        ) : undefined}
                        {readingList
                            ? readingList.map((readingBook, idx) => (
                                  <BookCard
                                      key={idx}
                                      title={readingBook.title}
                                      authors={readingBook.authors}
                                      descr={readingBook.subtitle}
                                      imgSrc={
                                          readingBook.imageLinks
                                              ? readingBook.imageLinks.thumbnail
                                              : undefined
                                      }
                                      addToAlreadyReadList={() =>
                                          moveToReadList(readingBook._id)
                                      }
                                  />
                              ))
                            : undefined}
                    </div>
                    <div>
                        <div style={{ margin: "100px" }}>
                            {readBooks ? (
                                <h1 className="listTitles">Read Books List</h1>
                            ) : undefined}

                            {readBooks
                                ? readBooks.map((readBook, idx) => (
                                      <BookCard
                                          key={idx}
                                          title={readBook.title}
                                          authors={readBook.authors}
                                          descr={readBook.subtitle}
                                          imgSrc={
                                              readBook.imageLinks
                                                  ? readBook.imageLinks
                                                        .thumbnail
                                                  : undefined
                                          }
                                          addToReadingList={() =>
                                              moveToReadingList(readBook._id)
                                          }
                                      />
                                  ))
                                : undefined}
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};
