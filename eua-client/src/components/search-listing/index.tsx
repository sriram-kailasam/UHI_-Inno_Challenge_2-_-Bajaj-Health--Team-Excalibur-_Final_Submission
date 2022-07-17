import { SearchOutlined } from "@ant-design/icons";
import { Input } from "antd";
import { AxiosResponse } from "axios";
import React, { useState } from "react";
import { useQuery } from "react-query";
import { useAppSelector } from "../../redux/hooks";
import { useDebounce } from "../../utils/helper";
import { selectProfile } from "../doc-profile";
import { IMyAppnts, listMyApp } from "../my-app/apis";
import { IMyApp, myAppMock } from "../my-app/mock";
import { searchDoctor } from "./apis";
import DoctorCard from "./doctor-card";
import DoctorCard2 from "./doctor-card-2";
import { IDoctors } from "./doctor-mock";
import "./styles.scss";

const SearchListing = ({ isMyApp = false }) => {
    const [searchText, setSearchText] = useState("");
    const debSearchText = useDebounce(searchText);
    const handleSearchTextChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearchText(e.target.value);
    };
    const selectedUserProfile = useAppSelector(selectProfile);

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

    const { data: { data: { results = [] } = {} } = {} } = useQuery<
        AxiosResponse<IMyAppnts>,
        Error
    >(
        ["my-appointment", selectedUserProfile.id, isMyApp],
        () => listMyApp(selectedUserProfile.id),
        {
            enabled: isMyApp,
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
            {isMyApp
                ? results.map((eachItem) => <DoctorCard2 {...eachItem} />)
                : searchResults.map((eachItem) => <DoctorCard {...eachItem} />)}
        </div>
    );
};

export default SearchListing;
