import React from "react";
import "./SlideImg.css";

const ExampleImg = ({ text, imageUrl }) => {
    return (
        <>
            <div className="exaple-img-container">
                <img
                    className="example-img"
                    src={process.env.PUBLIC_URL + imageUrl}
                    alt={text}
                />
            </div>
        </>
    );
};

export default ExampleImg;
