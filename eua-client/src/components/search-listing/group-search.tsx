import { SearchOutlined } from "@ant-design/icons";
import { Input } from "antd";
import { useMemo } from "react";
import { useLocation } from "react-router-dom";
import Loading from "../../elements/loading";
import DoctorCard from "./doctor-card";
import DoctorCard2 from "./doctor-card-2";
import { IDoctor } from "./doctor-mock";
import { useSearchListing } from "./hooks";
import "./styles.scss";

export interface IGroupSearch {
    docProfile: IDoctor;
}

const GroupSearch = () => {
    const {
        searchText,
        handleSearchTextChange,
        isApptLoading,
        isSearchLoading,
        searchResults,
    } = useSearchListing(false);

    const { docProfile } = useLocation().state as IGroupSearch;

    const updatedSearchResults = useMemo(
        () => searchResults.filter((item) => item.hprId !== docProfile.hprId),
        [searchResults, docProfile]
    );

    return (
        <div>
            <div className="doc-1">
                <span className="section-label">Primary Doctor</span>
                <DoctorCard {...docProfile} bookCTA={false} />
            </div>
            <div className="search-listing-2">
                <span className="section-label">Search Doctor 2</span>
                <Input
                    value={searchText}
                    onChange={handleSearchTextChange}
                    prefix={<SearchOutlined />}
                    className="search-input"
                    placeholder="Search via Doctor Name or HPR Id"
                />
                {(isApptLoading || isSearchLoading) && <Loading />}
                {updatedSearchResults.length ? (
                    updatedSearchResults
                        ?.filter((item) => item.hprId !== docProfile.hprId)
                        ?.map((eachItem) => (
                            <DoctorCard {...eachItem} isGroupConsult />
                        ))
                ) : (
                    <span>No Doctors Found</span>
                )}
            </div>
        </div>
    );
};

export default GroupSearch;
