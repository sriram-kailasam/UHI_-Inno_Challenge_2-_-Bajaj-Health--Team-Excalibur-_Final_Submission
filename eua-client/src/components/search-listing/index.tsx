import React, { useState } from "react";
import { useDebounce } from "../../utils/helper";
import DoctorCard from "./doctor-card";
import "./styles.scss";

const SearchListing = () => {
    const [searchText, setSearchText] = useState("");
    const debSearchText = useDebounce(searchText);
    const handleSearchTextChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearchText(e.target.value);
    };

    return (
        <div className="search-listing">
            <DoctorCard />
            <DoctorCard />
        </div>
    );
};

export default SearchListing;
