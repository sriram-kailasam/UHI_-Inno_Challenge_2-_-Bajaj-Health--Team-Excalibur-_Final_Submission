import { SearchOutlined } from "@ant-design/icons";
import { Input } from "antd";
import { AxiosResponse } from "axios";
import React, { useState } from "react";
import { useQuery } from "react-query";
import Loading from "../../elements/loading";
import { useAppSelector } from "../../redux/hooks";
import { useDebounce } from "../../utils/helper";
import { selectProfile } from "../doc-profile";
import { IMyAppnts, listMyApp } from "../my-app/apis";
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

    const {
        data: { data: { searchResults = [] } = {} } = {},
        isLoading: isSearchLoading,
        isFetched: isSearchFetched,
    } = useQuery<AxiosResponse<IDoctors>, Error>(
        ["doctor-search", debSearchText, isMyApp],
        () => searchDoctor(debSearchText),
        {
            enabled: !isMyApp,
        }
    );

    const {
        data: { data: { results = [] } = {} } = {},
        isLoading: isApptLoading,
        isFetched: isApptFetched,
    } = useQuery<AxiosResponse<IMyAppnts>, Error>(
        ["my-appointment", selectedUserProfile.id, isMyApp],
        () => listMyApp(selectedUserProfile.id),
        {
            enabled: isMyApp,
        }
    );

    console.log("kjb", results);

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
            {(isApptLoading || isSearchLoading) && <Loading />}
            {isMyApp ? (
                results.length ? (
                    results.map((eachItem) => <DoctorCard2 {...eachItem} />)
                ) : (
                    <span>No Appointments</span>
                )
            ) : searchResults.length ? (
                searchResults.map((eachItem) => <DoctorCard {...eachItem} />)
            ) : (
                <span>No Doctors Found</span>
            )}
        </div>
    );
};

export default SearchListing;
