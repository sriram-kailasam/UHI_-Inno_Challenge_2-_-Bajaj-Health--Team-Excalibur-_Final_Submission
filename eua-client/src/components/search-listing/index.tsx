import { SearchOutlined } from "@ant-design/icons";
import { Input } from "antd";
import React, { useState } from "react";
import { useQuery } from "react-query";
import { useDebounce } from "../../utils/helper";
import { searchDoctor } from "./apis";
import DoctorCard from "./doctor-card";
import "./styles.scss";

const SearchListing = () => {
    const [searchText, setSearchText] = useState("");
    const debSearchText = useDebounce(searchText);
    const handleSearchTextChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearchText(e.target.value);
    };

    // const {} = useQuery(["doctor-search", debSearchText], searchDoctor);

    return (
        <div className="search-listing">
            <Input
                value={searchText}
                onChange={handleSearchTextChange}
                prefix={<SearchOutlined />}
                className="search-input"
                placeholder="Search via Doctor Name or HPR Id"
            />
            <DoctorCard />
            <DoctorCard />
        </div>
    );
};

export default SearchListing;
