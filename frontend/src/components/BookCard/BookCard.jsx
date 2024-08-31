import React from "react";
import { FaBook, FaList } from "react-icons/fa6";
import bookThumbnail from "../../assets/images/book.jpg";

export const BookCard = ({
    title,
    authors,
    descr,
    imgSrc,
    addToReadingList,
    addToAlreadyReadList,
    width,
}) => {
    const authorsDisplay = authors ? authors.toString() : "";
    const bookTitle = title.slice(0, 40) + title.length > 40 ? "..." : "";

    const bookData = {
        title: title ? title : "No title has been provided",
        authors: authors ? authors : [],
        description: descr ? descr : "No description has been provided",
        imgSrc: imgSrc ? imgSrc : "no thumbnail",
    };

    return (
        <div className="border rounded p-4 bg-white hover:shadow-xl transition-all ease-in-out mb-10">
            <div className="items-center justify-between">
                <div>
                    <img
                        className={imgSrc ? "" : "bookImg"}
                        src={imgSrc ? imgSrc : bookThumbnail}
                        alt="thumbNail"
                    />
                </div>
                <div style={{ height: "100%" }}>
                    <h6 className="title">{title}</h6>
                    <h6 className="author">{authorsDisplay}</h6>
                    <p style={descr ? {} : { color: "red" }}>
                        {descr ? descr : "No description provided"}
                    </p>
                    {(addToReadingList || addToAlreadyReadList) && (
                        <div className="cardButtons">
                            {addToReadingList && (
                                <div style={{ display: "flex" }}>
                                    <label>Add To Reading List</label>
                                    <FaList
                                        className="text-slate-400 cursor-poiner hover:text-black"
                                        onClick={() =>
                                            addToReadingList(bookData)
                                        }
                                        size={25}
                                        style={{ margin: 5 }}
                                    />
                                </div>
                            )}
                            {addToAlreadyReadList && (
                                <div style={{ display: "flex" }}>
                                    <label>Add To Already Read List</label>
                                    <FaBook
                                        className="text-slate-400 cursor-poiner hover:text-black"
                                        onClick={() =>
                                            addToAlreadyReadList(bookData)
                                        }
                                        size={25}
                                        style={{ margin: 5 }}
                                    />
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};
