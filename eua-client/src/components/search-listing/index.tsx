import { SearchOutlined } from "@ant-design/icons";
import { Input } from "antd";
import Loading from "../../elements/loading";
import DoctorCard from "./doctor-card";
import DoctorCard2 from "./doctor-card-2";
import { useSearchListing } from "./hooks";
import "./styles.scss";

const SearchListing = ({ isMyApp = false }) => {
    const {
        searchText,
        handleSearchTextChange,
        isApptLoading,
        isSearchLoading,
        results,
        searchResults,
    } = useSearchListing(isMyApp);

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
