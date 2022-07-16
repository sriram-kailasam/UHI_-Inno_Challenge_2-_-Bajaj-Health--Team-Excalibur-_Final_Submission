import { SearchOutlined } from "@ant-design/icons";
import { Input } from "antd";
import { AxiosResponse } from "axios";
import React, { useState } from "react";
import { useQuery } from "react-query";
import { useDebounce } from "../../utils/helper";
import { myAppMock } from "../my-app/mock";
import { searchDoctor } from "./apis";
import DoctorCard from "./doctor-card";
import { IDoctors } from "./doctor-mock";
import "./styles.scss";

const SearchListing = ({ isMyApp = false }) => {
    const [searchText, setSearchText] = useState("");
    const debSearchText = useDebounce(searchText);
    const handleSearchTextChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearchText(e.target.value);
    };

    const { data: { data: { searchResults = [] } = {} } = {} } = useQuery<
        AxiosResponse<IDoctors>,
        Error
    >(
        ["doctor-search", debSearchText, isMyApp],
        () => searchDoctor(debSearchText),
        {
            enabled: !isMyApp,
        }
    );

    return (
        <div className="search-listing">
            {!isMyApp && (
                <Input
                    value={searchText}
                    onChange={handleSearchTextChange}
                    prefix={<SearchOutlined />}
                    className="search-input"
                    placeholder="Search via Doctor Name or HPR Id"
                />
            )}
            {(isMyApp ? myAppMock : searchResults).map((eachItem) => (
                <DoctorCard isMyApp={isMyApp} {...eachItem} />
            ))}
        </div>
    );
};

export default SearchListing;
