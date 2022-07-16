import { SearchOutlined } from "@ant-design/icons";
import { Input } from "antd";
import { AxiosResponse } from "axios";
import React, { useState } from "react";
import { useQuery } from "react-query";
import { useDebounce } from "../../utils/helper";
import { searchDoctor } from "./apis";
import DoctorCard from "./doctor-card";
import { IDoctors } from "./doctor-mock";
import "./styles.scss";

const SearchListing = () => {
    const [searchText, setSearchText] = useState("");
    const debSearchText = useDebounce(searchText);
    const handleSearchTextChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearchText(e.target.value);
    };

    const { data: { data: { searchResults = [] } = {} } = {} } = useQuery<
        AxiosResponse<IDoctors>,
        Error
    >(["doctor-search", debSearchText], () => searchDoctor(debSearchText));

    return (
        <div className="search-listing">
            <Input
                value={searchText}
                onChange={handleSearchTextChange}
                prefix={<SearchOutlined />}
                className="search-input"
                placeholder="Search via Doctor Name or HPR Id"
            />
            {searchResults.map((eachItem) => (
                <DoctorCard {...eachItem} />
            ))}
        </div>
    );
};

export default SearchListing;
