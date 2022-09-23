import { AxiosResponse } from "axios";
import { useState } from "react";
import { useQuery } from "react-query";
import { useAppSelector } from "../../redux/hooks";
import { useDebounce } from "../../utils/helper";
import { selectProfile } from "../doc-profile";
import { IMyAppnts, listMyApp } from "../my-app/apis";
import { searchDoctor } from "./apis";
import { IDoctors } from "./doctor-mock";

export const useSearchListing = (isMyApp: boolean) => {
    const [searchText, setSearchText] = useState("");
    const debSearchText = useDebounce(searchText);
    const handleSearchTextChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearchText(e.target.value);
    };
    const selectedUserProfile = useAppSelector(selectProfile);

    const {
        data: { data: { searchResults = [] } = {} } = {},
        isLoading: isSearchLoading,
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
    } = useQuery<AxiosResponse<IMyAppnts>, Error>(
        ["my-appointment", selectedUserProfile.id, isMyApp],
        () => listMyApp(selectedUserProfile.id),
        {
            enabled: isMyApp,
        }
    );

    return {
        searchText,
        handleSearchTextChange,
        isApptLoading,
        isSearchLoading,
        results,
        searchResults,
    };
};
